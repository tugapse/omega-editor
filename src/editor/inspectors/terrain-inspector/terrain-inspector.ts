import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InpectorTogglePanel } from '@editor/components/inpector-toggle-panel/inpector-toggle-panel';
import { TerrainTool } from '@editor/behaviours/scene-editor/terrain-edit.behaviour';
import { EditorService } from '@editor/services/editor.service';
import {
  BrushSettings, cachedGroundTexture, exportHeightmap, generateRelief, GROUND_KINDS, GroundKind, heightmapToRaw,
  heightmapToRgba, importHeightmap, makeLayer, MAX_TERRAIN_LAYERS, rawToHeightmap, rgbaToHeightmap,
  TerrainBehaviour, TerrainLayer,
} from 'omega-game-engine';
import { Subscription } from 'rxjs';
import { Icon } from 'src/app/components/icon/icon';
import { ConfirmationService } from 'src/app/services/confirmation.service';

type Tab = 'sculpt' | 'paint' | 'layers' | 'chunks';

const GROUND_NAMES: Record<GroundKind, string> = {
  grass: 'Relva', dirt: 'Terra', rock: 'Rocha', snow: 'Neve', sand: 'Areia', gravel: 'Gravilha',
};

/**
 * The terrain's own inspector: sculpt and paint tools (used in the viewport
 * by TerrainEditBehaviour), the layers and their rules, and the chunks.
 */
@Component({
  selector: 'editor-terrain-inspector',
  imports: [InpectorTogglePanel, Icon],
  templateUrl: './terrain-inspector.html',
  styleUrl: './terrain-inspector.scss',
})
export class TerrainInspector implements OnInit, OnDestroy {
  @Input() terrain!: TerrainBehaviour;

  tab: Tab = 'sculpt';
  tool: TerrainTool | null = null;
  layer = 0;
  brush: BrushSettings = { radius: 10, strength: 0.5, hardness: 0.35 };
  relief = { seed: 1, amplitude: 60, scale: 256, ridges: 0.3 };
  openLayer = -1;

  readonly sculptTools: { id: TerrainTool; label: string; icon: string }[] = [
    { id: 'raise', label: 'Subir', icon: '▲' },
    { id: 'lower', label: 'Baixar', icon: '▼' },
    { id: 'smooth', label: 'Alisar', icon: '≈' },
    { id: 'flatten', label: 'Aplanar', icon: '▬' },
    { id: 'noise', label: 'Ruído', icon: '⁂' },
  ];
  readonly grounds = GROUND_KINDS.map((k) => ({ id: k, label: GROUND_NAMES[k] }));
  readonly maxLayers = MAX_TERRAIN_LAYERS;
  private swatches = new Map<string, string>();
  private sub?: Subscription;

  constructor(private editorService: EditorService, private confirmation: ConfirmationService) {}

  ngOnInit(): void {
    this.sub = this.editorService.terrainHistoryChanged.subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.editorService.terrainTool.value?.terrain === this.terrain) this.editorService.terrainTool.next(null);
  }

  get material() { return this.terrain.material; }
  get layers(): TerrainLayer[] { return this.terrain.material.layers; }
  get settings() { return this.terrain.settings; }

  setTab(tab: Tab): void {
    this.tab = tab;
    this.setTool(null);
  }

  setTool(tool: TerrainTool | null): void {
    this.tool = this.tool === tool ? null : tool;
    this.publish();
  }

  /** Tells the viewport what to do with the mouse. */
  publish(): void {
    this.editorService.terrainTool.next(this.tool ? { terrain: this.terrain, tool: this.tool, layer: this.layer, brush: this.brush } : null);
  }

  setBrush(key: keyof BrushSettings, e: Event): void {
    this.brush[key] = Number((e.target as HTMLInputElement).value) / (key === 'radius' ? 1 : 100);
    this.publish();
  }

  pickLayer(i: number): void {
    this.layer = i;
    if (this.tool !== 'paint') this.tool = 'paint';
    this.publish();
  }

  swatch(kind: GroundKind): string {
    let url = this.swatches.get(kind);
    if (!url) {
      const t = cachedGroundTexture(kind, 64);
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      c.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(t.albedo.map((v, k) => (k % 4 === 3 ? 255 : v))), 64, 64), 0, 0);
      url = `url(${c.toDataURL()})`;
      this.swatches.set(kind, url);
    }
    return url;
  }

  undo(): void { this.terrain.undo(); }
  redo(): void { this.terrain.redo(); }
  get canUndo(): boolean { return this.terrain.history.canUndo; }
  get canRedo(): boolean { return this.terrain.history.canRedo; }

  bake(): void { this.terrain.bakeRules(); }
  clearPainting(): void { this.terrain.clearPainting(); }

  setRelief(key: keyof TerrainInspector['relief'], e: Event): void {
    this.relief[key] = Number((e.target as HTMLInputElement).value);
  }

  generate(): void {
    this.confirmation.confirm({
      title: 'Gerar relevo',
      message: 'Isto substitui as alturas de todos os blocos.',
      confirmText: 'Gerar', cancelText: 'Cancelar',
    }).subscribe((ok) => {
      if (!ok) return;
      this.terrain.beginStroke('heights');
      for (const c of this.terrain.grid.all()) this.terrain.history.save(c);
      generateRelief(this.terrain.grid, { ...this.relief, sharpness: 1.4 });
      this.terrain.endStroke();
    });
  }

  // ---- Layers ----

  layerChanged(textures = false): void {
    this.material.changed(textures);
  }

  setLayerNumber(l: TerrainLayer, key: 'tiling' | 'normalStrength' | 'heightBlend' | 'slopeBlend' | 'noise', e: Event): void {
    l[key] = Number((e.target as HTMLInputElement).value);
    this.layerChanged();
  }

  setRange(l: TerrainLayer, key: 'height' | 'slope', end: 0 | 1, e: Event): void {
    l[key][end] = Number((e.target as HTMLInputElement).value);
    this.layerChanged();
  }

  setGround(l: TerrainLayer, e: Event): void {
    l.ground = (e.target as HTMLSelectElement).value as GroundKind;
    this.layerChanged(true);
  }

  setName(l: TerrainLayer, e: Event): void {
    l.name = (e.target as HTMLInputElement).value;
  }

  toggleAuto(l: TerrainLayer): void {
    l.auto = !l.auto;
    this.layerChanged();
  }

  addLayer(): void {
    if (this.layers.length >= MAX_TERRAIN_LAYERS) return;
    this.layers.push(makeLayer(`Camada ${this.layers.length + 1}`, 'sand', { auto: false }));
    this.openLayer = this.layers.length - 1;
    this.layerChanged(true);
  }

  removeLayer(i: number): void {
    if (this.layers.length <= 1) return;
    this.layers.splice(i, 1);
    this.layer = Math.min(this.layer, this.layers.length - 1);
    this.openLayer = -1;
    this.layerChanged(true);
  }

  moveLayer(i: number, by: -1 | 1): void {
    const j = i + by;
    if (j < 0 || j >= this.layers.length) return;
    [this.layers[i], this.layers[j]] = [this.layers[j], this.layers[i]];
    this.openLayer = j;
    this.layerChanged(true);
  }

  setMaterialNumber(key: 'heightBlend' | 'macroVariation', e: Event): void {
    this.material[key] = Number((e.target as HTMLInputElement).value);
    this.layerChanged();
  }

  toggleTriplanar(): void {
    this.material.triplanar = !this.material.triplanar;
    this.terrain.recompile();
  }

  // ---- Chunks ----

  /** The cells around and under the chunks, as rows for the grid view. */
  get cells(): { cx: number; cz: number; state: 'chunk' | 'free' | 'empty' }[][] {
    const all = this.terrain.grid.all();
    if (!all.length) return [[{ cx: 0, cz: 0, state: 'free' }]];
    const xs = all.map((c) => c.cx), zs = all.map((c) => c.cz);
    const x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 1, z0 = Math.min(...zs) - 1, z1 = Math.max(...zs) + 1;
    const free = new Set(this.terrain.grid.freeNeighbours().map(([x, z]) => `${x},${z}`));
    const rows = [];
    for (let z = z0; z <= z1; z++) {
      const row = [];
      for (let x = x0; x <= x1; x++) {
        row.push({ cx: x, cz: z, state: (this.terrain.grid.get(x, z) ? 'chunk' : free.has(`${x},${z}`) ? 'free' : 'empty') as 'chunk' | 'free' | 'empty' });
      }
      rows.push(row);
    }
    return rows;
  }

  cellClicked(cell: { cx: number; cz: number; state: string }): void {
    if (cell.state === 'free') {
      this.terrain.addChunk(cell.cx, cell.cz);
      return;
    }
    if (cell.state !== 'chunk' || this.terrain.grid.count <= 1) return;
    this.confirmation.confirm({
      title: 'Apagar bloco',
      message: `Apagar o bloco ${cell.cx}, ${cell.cz}? Não se pode anular.`,
      confirmText: 'Apagar', cancelText: 'Cancelar',
    }).subscribe((ok) => { if (ok) { this.terrain.history.clear(); this.terrain.removeChunk(cell.cx, cell.cz); } });
  }

  // ---- Heightmaps ----

  exportPng(): void {
    const map = exportHeightmap(this.terrain.grid);
    if (!map) return;
    const c = document.createElement('canvas');
    c.width = map.width; c.height = map.height;
    c.getContext('2d')!.putImageData(new ImageData(heightmapToRgba(map), map.width, map.height), 0, 0);
    c.toBlob((b) => b && this.download(b, 'terreno.png'));
  }

  exportRaw(): void {
    const map = exportHeightmap(this.terrain.grid);
    if (map) this.download(new Blob([heightmapToRaw(map) as BlobPart]), `terreno-${map.width}x${map.height}.r16`);
  }

  importFile(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    (e.target as HTMLInputElement).value = '';
    if (!file) return;
    const apply = (map: ReturnType<typeof rawToHeightmap>) => {
      this.terrain.beginStroke('heights');
      for (const c of this.terrain.grid.all()) this.terrain.history.save(c);
      importHeightmap(this.terrain.grid, map);
      this.terrain.endStroke();
    };
    if (/\.(r16|raw)$/i.test(file.name)) {
      void file.arrayBuffer().then((b) => apply(rawToHeightmap(new Uint8Array(b))));
      return;
    }
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      apply(rgbaToHeightmap(ctx.getImageData(0, 0, img.width, img.height).data, img.width, img.height));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  }

  private download(blob: Blob, name: string): void {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
}
