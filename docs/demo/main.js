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

const gl = canvas.getContext('webgl2', { antialias: true });
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
  scene.setGlRenderingContext(gl);
  engine = new E.Engine();
  engine.initialize(canvas);
  engine.loadScene(scene);

  const settings = scene.renderPipeline.settings;
  settings.toneMapping = E.ToneMapping.ACES;

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
  if (lights.ring) lights.ring.transform.rotate(0, dt * 20, 0);

  engine.update(dt);
  engine.render();

  fpsFrames++; fpsTime += dt;
  if (fpsTime >= 0.5) {
    fps = Math.round(fpsFrames / fpsTime); fpsFrames = 0; fpsTime = 0;
    const bones = characters.reduce((n, c) => n + c.bones, 0);
    const verts = characters.reduce((n, c) => n + c.vertices, 0);
    document.getElementById('stats').textContent = window.innerWidth < 720
      ? `${fps} fps · ${bones} bones`
      : `${fps} fps · ${scene.objects.length} entities · ${bones} bones · ${(verts / 1000).toFixed(0)}k skinned vertices`;
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

function bindControls() {
  const find = (name) => scene.objects.find((o) => o.name === name);
  lights.magenta = find('Magenta light');
  lights.cyan = find('Cyan light');
  lights.ring = find('Ring');
  const sun = find('Directional light');
  const sunColor = sun ? [sun.color.r, sun.color.g, sun.color.b] : null;
  const settings = scene.renderPipeline.settings;

  const slider = (id, apply) => {
    const input = document.getElementById(id);
    const out = input.parentElement.querySelector('output');
    const update = () => { apply(Number(input.value)); if (out) out.textContent = Number(input.value).toFixed(2); };
    input.addEventListener('input', update);
    update();
  };
  slider('exposure', (v) => { settings.exposure.value = v; });
  slider('saturation', (v) => { settings.saturation.value = v; });
  slider('contrast', (v) => { settings.contrast.value = v; });
  slider('sun', (v) => { if (sun && sunColor) sun.color = new E.Color(sunColor[0] * v, sunColor[1] * v, sunColor[2] * v, 1); });
  document.getElementById('tonemap').addEventListener('change', (e) => { settings.toneMapping = Number(e.target.value); });
  document.getElementById('shadows').addEventListener('change', (e) => { settings.shadowsEnabled = e.target.checked; });
  document.getElementById('orbit-lights').addEventListener('change', (e) => { orbitLights = e.target.checked; });
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
