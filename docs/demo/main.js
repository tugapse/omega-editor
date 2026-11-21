// Omega engine demo: the Showcase scene plus two Mixamo characters.
// Everything here uses the engine's public API (omega-engine.js is the
// engine bundled as one ES module).
import * as E from './omega-engine.js';

const canvas = document.getElementById('view');
const statusEl = document.getElementById('status');
const progressEl = document.getElementById('progress');

const CHARACTERS = [
  {
    name: 'Ely',
    format: 'binary FBX',
    file: 'assets/models/ely.fbx',
    firstClip: 'Skinning test',
    extraClips: [{ file: 'assets/models/ely-breakdance.fbx', name: 'Breakdance' }],
    position: [-1.8, 0, 3.6],
    yaw: 20,
  },
  {
    name: 'Vampire',
    format: 'ASCII FBX + COLLADA clip',
    file: 'assets/models/vampire-twist-dance.fbx',
    firstClip: 'Twist dance',
    extraClips: [{ file: 'assets/models/vampire-crouch-turn.dae', name: 'Crouch turn' }],
    position: [1.8, 0, 3.6],
    yaw: -20,
  },
];

// --- Loading with progress -------------------------------------------------

const MODEL_FILES = CHARACTERS.flatMap((c) => [c.file, ...c.extraClips.map((x) => x.file)]);
const received = new Map();
const totals = new Map();
function showProgress(text) {
  const total = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  const done = [...received.values()].reduce((a, b) => a + b, 0);
  progressEl.style.width = `${Math.min(100, (done / total) * 100).toFixed(1)}%`;
  if (text) statusEl.textContent = text;
}

/** Scene files are stored as project://Textures/…; here they live in assets/. */
const resolve = async (uri) => (uri.startsWith('project://') ? `assets/${uri.slice('project://'.length)}` : uri);
const base = new E.DefaultResourceLoader(resolve);
E.Resources.setLoader({
  loadText: (uri) => base.loadText(uri),
  loadImage: (uri) => base.loadImage(uri),
  // Models are big: stream them to show progress.
  async loadBinary(uri) {
    const response = await fetch(await resolve(uri));
    if (!response.ok) throw new Error(`${uri}: HTTP ${response.status}`);
    const length = Number(response.headers.get('content-length')) || 0;
    if (length) totals.set(uri, length);
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      size += value.length;
      received.set(uri, size);
      showProgress(`Loading ${uri.split('/').pop()} (${(size / 1e6).toFixed(1)} MB)`);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const c of chunks) { bytes.set(c, offset); offset += c.length; }
    return bytes.buffer;
  },
});

// --- Engine, camera, scene -----------------------------------------------------

const gl = canvas.getContext('webgl2', { antialias: false }) // the scene is drawn off-screen: canvas MSAA would only cost;
if (!gl) throw fail('This browser has no WebGL 2.');
new E.DependencyManager().registerDependencies();
E.Resources.for(gl);

const camera = new E.Camera();
camera.name = 'Demo camera';
camera.fieldOfView = 50;
camera.initialize();
E.Camera.setMainCamera(camera);

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width === w && canvas.height === h) return;
  canvas.width = w;
  canvas.height = h;
  gl.viewport(0, 0, w, h);
  E.CanvasViewport.rendererWidth = w;
  E.CanvasViewport.rendererHeight = h;
  camera.aspectRatio = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

let scene;
let engine;
const characters = [];

async function start() {
  // Start the model downloads at once; the scene loads meanwhile.
  for (const f of MODEL_FILES) E.Resources.for(gl).getModel(f).catch(() => {});

  showProgress('Loading the scene…');
  const sceneJson = await (await fetch('assets/scene/showcase.scene')).json();
  scene = await E.SceneManager.loadScene(gl, sceneJson);
  window.omegaDemo = { E, scene }; // for the console
  scene.setGlRenderingContext(gl);
  engine = new E.Engine();
  engine.initialize(canvas);
  engine.loadScene(scene);

  const settings = scene.renderPipeline.settings;
  settings.toneMapping = E.ToneMapping.ACES;
  applyQuality(new URLSearchParams(location.search).get('quality') ?? 'auto');

  for (const def of CHARACTERS) {
    showProgress(`Placing ${def.name}…`);
    const { root, entities } = await E.instantiateModel(gl, def.file, { name: def.name, scene });
    root.transform.setLocalPosition(...def.position);
    root.transform.setLocalRotation(0, def.yaw, 0);
    const animator = root.getBehaviour(E.Animator);
    await animator.whenLoaded();
    animator.inPlace = true;
    animator.getClip(0).name = def.firstClip;
    for (const extra of def.extraClips) {
      const model = await E.Resources.for(gl).getModel(extra.file);
      const clip = model.clips[0];
      clip.name = extra.name;
      animator.addClip(clip);
    }
    const renderers = entities.map((e) => e.getBehaviour(E.SkinnedMeshRendererBehaviour)).filter(Boolean);
    await Promise.all(renderers.map((r) => r.whenLoaded()));
    animator.play(def.firstClip);
    characters.push({ def, root, animator, bones: renderers[0]?.boneIds.length ?? 0, vertices: renderers.reduce((n, r) => n + (r.mesh?.meshData?.vertices.length ?? 0), 0) });
  }

  scene.isRunning = true;
  buildCharacterUi();
  bindControls();
  document.getElementById('loading').classList.add('done');
  requestAnimationFrame(frame);
}

// --- Per-frame: orbit camera, moving lights, stats ---------------------------------

const orbit = { yaw: 0, pitch: 12, distance: 7.5, target: [0, 1.0, 2.6], auto: true };
const lights = {};
let orbitLights = true;
let syncTimeOfDay = null; // set by bindControls: moves the slider with the sun's clock
let lightTime = 0;
let last = 0;
let fpsTime = 0, fpsFrames = 0, fps = 0;

function placeCamera() {
  const y = (orbit.yaw * Math.PI) / 180, p = (orbit.pitch * Math.PI) / 180;
  const [tx, ty, tz] = orbit.target;
  // Portrait screens see less sideways: step back so both characters fit.
  const distance = orbit.distance * Math.max(1, 0.75 / camera.aspectRatio);
  camera.transform.setLocalPosition(tx + Math.sin(y) * Math.cos(p) * distance, ty + Math.sin(p) * distance, tz + Math.cos(y) * Math.cos(p) * distance);
  camera.transform.lookAt(new E.Vector3(tx, ty, tz));
}

function frame(now) {
  const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
  last = now;
  resize();
  if (orbit.auto && !dragging) orbit.yaw += dt * 6;
  placeCamera();

  if (orbitLights) {
    lightTime += dt;
    const swing = (light, phase, radius, height) => {
      if (!light) return;
      const a = lightTime * 0.6 + phase;
      light.transform.setLocalPosition(Math.cos(a) * radius, height, 2.6 + Math.sin(a) * radius);
    };
    swing(lights.magenta, 0, 3.2, 2.2);
    swing(lights.cyan, Math.PI, 3.2, 2.2);
  }

  engine.update(dt);
  engine.render();

  fpsFrames++; fpsTime += dt;
  if (fpsTime >= 0.5) {
    fps = Math.round(fpsFrames / fpsTime); fpsFrames = 0; fpsTime = 0;
    const bones = characters.reduce((n, c) => n + c.bones, 0);
    const verts = characters.reduce((n, c) => n + c.vertices, 0);
    const pipeline = scene.renderPipeline;
    const res = Math.round(pipeline.currentRenderScale * 100);
    const sh = pipeline.shadowMap.stats;
    document.getElementById('stats').textContent = window.innerWidth < 720
      ? `${fps} fps · ${res}% res`
      : `${fps} fps · ${res}% res · ${scene.objects.length} entities · ${bones} bones · ${(verts / 1000).toFixed(0)}k skinned vertices`;
    syncTimeOfDay?.();
    const info = document.getElementById('quality-info');
    if (info) {
      const st = pipeline.settings;
      info.textContent = `${qualityLabel}: ${res}% resolution${st.dynamicResolution ? ' (dynamic)' : ''}, ` +
        `${st.shadowMapSize}² shadow atlas, ${st.shadowFilter}-tap filter, ` +
        `shadow views redrawn ${sh.redrawn}/${sh.views}, ${sh.draws} caster draws. GPU: ${GPU_NAME}.`;
    }
  }
  requestAnimationFrame(frame);
}

// --- Controls ------------------------------------------------------------------------

function buildCharacterUi() {
  const section = document.getElementById('characters');
  for (const c of characters) {
    const block = document.createElement('div');
    block.innerHTML = `<h3>${c.def.name} <small>· ${c.def.format}, ${c.bones} bones</small></h3><div class="clips"></div>
      <div class="row"><label>Speed</label><input type="range" min="0" max="2" step="0.05" value="1"><output>1.00</output></div>
      <label class="check"><input type="checkbox" checked> Dance in place</label>`;
    const clips = block.querySelector('.clips');
    const buttons = c.animator.clipList.map((clip) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = clip.name;
      b.setAttribute('aria-pressed', String(clip === c.animator.currentClip));
      b.addEventListener('click', () => {
        c.animator.crossFade(clip.name, 0.4);
        buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      });
      clips.appendChild(b);
      return b;
    });
    const speed = block.querySelector('input[type=range]');
    const out = block.querySelector('output');
    speed.addEventListener('input', () => { c.animator.speed = Number(speed.value); out.textContent = Number(speed.value).toFixed(2); });
    block.querySelector('input[type=checkbox]').addEventListener('change', (e) => { c.animator.inPlace = e.target.checked; });
    section.appendChild(block);
  }
}

const QUALITY_NAMES = ['Low', 'Medium', 'High'];
const GPU_NAME = (() => {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  return String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
})();
let qualityLabel = '';

/** 'auto' picks Low on phones and tablets, High elsewhere; also 'low', 'medium', 'high' or 0–2. */
function applyQuality(choice) {
  const key = String(choice).toLowerCase();
  const named = { low: 0, medium: 1, high: 2, 0: 0, 1: 1, 2: 2 }[key];
  const auto = named === undefined;
  const quality = auto ? E.RenderPipelineSettings.suggestedQuality(gl) : named;
  scene.renderPipeline.settings.applyQuality(quality);
  qualityLabel = QUALITY_NAMES[quality] + (auto ? ' (auto)' : '');
  const select = document.getElementById('quality');
  if (select) select.value = auto ? 'auto' : String(quality);
}

function bindControls() {
  const find = (name) => scene.objects.find((o) => o.name === name);
  lights.magenta = find('Magenta light');
  lights.cyan = find('Cyan light');
  lights.ring = find('Ring');
  // The sun's SunBehaviour drives the sky (colours, clouds, stars, moon) from the time of day.
  const sun = find('Directional light')?.getBehaviour(E.SunBehaviour);
  const ringSpin = lights.ring?.getBehaviour(E.RotateBehaviour);
  const timeInput = document.getElementById('time-of-day');
  if (sun) timeInput.value = sun.dayCycleSettings.timeOfDay.value;
  const settings = scene.renderPipeline.settings;

  const slider = (id, apply, format = (v) => v.toFixed(2)) => {
    const input = document.getElementById(id);
    const out = input.parentElement.querySelector('output');
    const update = () => { apply(Number(input.value)); if (out) out.textContent = format(Number(input.value)); };
    input.addEventListener('input', update);
    update();
  };
  slider('exposure', (v) => { settings.exposure.value = v; });
  slider('saturation', (v) => { settings.saturation.value = v; });
  slider('contrast', (v) => { settings.contrast.value = v; });
  const clock = (v) => `${String(Math.floor(v) % 24).padStart(2, '0')}:${String(Math.round((v % 1) * 60) % 60).padStart(2, '0')}`;
  slider('time-of-day', (v) => { if (sun) sun.dayCycleSettings.timeOfDay.value = v; }, clock);
  // SunBehaviour advances timeOfDay by speed * 0.01 hours per second: 20 makes a day last 2 minutes.
  const DAY_SPEED = 20;
  const dayCycle = document.getElementById('day-cycle');
  const setDayCycle = () => { if (sun) sun.dayCycleSettings.speed.value = dayCycle.checked ? DAY_SPEED : 0; };
  dayCycle.addEventListener('change', setDayCycle);
  setDayCycle();
  const timeOut = timeInput.parentElement.querySelector('output');
  syncTimeOfDay = () => {
    if (!sun || !dayCycle.checked || document.activeElement === timeInput) return;
    const v = sun.dayCycleSettings.timeOfDay.value;
    timeInput.value = v;
    timeOut.textContent = clock(v);
  };
  document.getElementById('tonemap').addEventListener('change', (e) => { settings.toneMapping = Number(e.target.value); });
  document.getElementById('shadows').addEventListener('change', (e) => { settings.shadowsEnabled = e.target.checked; });
  document.getElementById('quality').addEventListener('change', (e) => applyQuality(e.target.value));
  document.getElementById('orbit-lights').addEventListener('change', (e) => {
    orbitLights = e.target.checked;
    if (ringSpin) ringSpin.active = e.target.checked;
  });
  document.getElementById('auto-rotate').addEventListener('change', (e) => { orbit.auto = e.target.checked; });
  const panel = document.getElementById('panel');
  document.getElementById('toggle-panel').addEventListener('click', () => panel.classList.toggle('open'));
}

// Orbit with the mouse or one finger; zoom with the wheel or two fingers.
let dragging = false;
const pointers = new Map();
let pinch = 0;
canvas.addEventListener('pointerdown', (e) => { pointers.set(e.pointerId, [e.clientX, e.clientY]); dragging = true; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  const prev = pointers.get(e.pointerId);
  if (!prev) return;
  pointers.set(e.pointerId, [e.clientX, e.clientY]);
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    if (pinch) orbit.distance = Math.min(16, Math.max(2.5, orbit.distance * (pinch / d)));
    pinch = d;
    return;
  }
  orbit.yaw -= (e.clientX - prev[0]) * 0.3;
  orbit.pitch = Math.min(60, Math.max(-5, orbit.pitch + (e.clientY - prev[1]) * 0.2));
});
const release = (e) => { pointers.delete(e.pointerId); pinch = 0; if (!pointers.size) dragging = false; };
canvas.addEventListener('pointerup', release);
canvas.addEventListener('pointercancel', release);
canvas.addEventListener('wheel', (e) => { e.preventDefault(); orbit.distance = Math.min(16, Math.max(2.5, orbit.distance * Math.exp(e.deltaY * 0.001))); }, { passive: false });

function fail(message) {
  statusEl.textContent = message;
  statusEl.classList.add('error');
  return new Error(message);
}

start().catch((error) => { console.error(error); fail(`Could not start the demo: ${error.message}`); });
