import { vec3 } from 'gl-matrix';
import { BrushSettings, Camera, Keybord, Mouse, SculptTool, TerrainBehaviour } from 'omega-game-engine';
import { EditorService } from '@editor/services/editor.service';
import { Raycast } from './raycast';

export type TerrainTool = SculptTool | 'paint' | 'erase';

/** What the terrain inspector has picked: the terrain, the tool, its layer and brush. */
export interface TerrainToolState {
  terrain: TerrainBehaviour;
  tool: TerrainTool;
  layer: number;
  brush: BrushSettings;
}

/**
 * The terrain brush in the viewport: while a terrain tool is on, the left
 * button sculpts or paints where the mouse points (the right button still
 * flies the camera), and the brush is drawn on the ground. It claims the
 * mouse so the picker and the gizmos leave it alone.
 */
export class TerrainEditBehaviour {
  public mouseClaimed = false;
  private stroking = false;
  private target?: number;
  private last: TerrainBehaviour | null = null;

  constructor(
    private gl: WebGL2RenderingContext,
    private editorService: EditorService,
  ) {}

  updateEditor(dt: number): void {
    const s = this.editorService.terrainTool.value;
    if (this.last && this.last !== s?.terrain) this.last.showBrush(null);
    this.last = s?.terrain ?? null;
    if (!s || !s.terrain.parent?.scene) {
      this.mouseClaimed = false;
      this.stop(s?.terrain);
      return;
    }
    this.mouseClaimed = true;
    const camera = Camera.mainCamera;
    const dir = Raycast.screenPointToRay(camera, { webgl: this.gl });
    const origin = vec3.clone(camera.transform.worldPosition);
    const p = s.terrain.raycast(origin, dir, 5000);
    s.terrain.showBrush(p ?? null, s.brush.radius);

    const down = !!Mouse.mouseButtonDown[0] && !Keybord.keyDown['alt'];
    if (down && !this.stroking) {
      this.stroking = true;
      this.target = p?.[1];
      s.terrain.beginStroke(s.tool === 'paint' || s.tool === 'erase' ? 'splat' : 'heights');
    }
    if (!down) {
      this.stop(s.terrain);
      return;
    }
    if (!p) return;
    if (s.tool === 'paint') s.terrain.paintAt(s.layer, p, s.brush, dt);
    else if (s.tool === 'erase') s.terrain.paintAt(0, p, s.brush, dt, true);
    else s.terrain.sculptAt(s.tool, p, s.brush, dt, this.target);
  }

  private stop(terrain?: TerrainBehaviour): void {
    if (!this.stroking) return;
    this.stroking = false;
    terrain?.endStroke();
    this.editorService.terrainHistoryChanged.emit();
  }
}
