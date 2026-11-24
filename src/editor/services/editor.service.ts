import { EventEmitter, inject, Injectable } from "@angular/core";
import {
  DependencyManager,
  Camera,
  CameraFlyBehaviour,
  CanvasViewport,
  Engine,
  Scene,
} from "omega-game-engine";
import { BehaviorSubject } from "rxjs";
import type { TerrainToolState } from "@editor/behaviours/scene-editor/terrain-edit.behaviour";
import { GizmoMode } from "../behaviours/scene-editor/gizmo-mode.enum";
import { TransformSpace } from "../behaviours/scene-editor/transform-space.enum";
import { EditorStateService } from "./editor-state.service";
import { EditorResourceLoader } from "./editor-resource-loader.service";
import { API_URL } from "src/app/api/api-url.token";
import { AuthService } from "src/app/api/services/auth.service";

@Injectable({ providedIn: "root" })
export class EditorService {
  private _gameEngine!: Engine | null;
  private editorStateService: EditorStateService = inject(EditorStateService);
  apiUrl = inject(API_URL);
  private authService = inject(AuthService);

  public onSceneLoaded = new EventEmitter<Scene>();
  public onScenePlay = new EventEmitter<Scene>();
  public onScenePause = new EventEmitter<Scene>();
  public onSceneStop = new EventEmitter<Scene>();
  public onSceneUpdated = new EventEmitter<Scene>();
  public onEditorSaveStateRequest = new EventEmitter();
  public editorRunningState = new EventEmitter<boolean>();

  public onRenderingContextCreated = new EventEmitter<WebGL2RenderingContext>();
  public onCanvasRequestResize = new BehaviorSubject<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  public onCanvasRequestReset = new EventEmitter();

  public onRenderFrame = new BehaviorSubject<WebGL2RenderingContext | null>(
    null,
  );
  public onUpdateFrame = new BehaviorSubject<number>(0);

  public gizmoMode = new BehaviorSubject<GizmoMode>(GizmoMode.Translate);
  /** The terrain tool picked in the terrain inspector (null: none, the mouse selects as usual). */
  public terrainTool = new BehaviorSubject<TerrainToolState | null>(null);
  /** A terrain stroke ended (undo and redo can change). */
  public terrainHistoryChanged = new EventEmitter<void>();
  public transformSpace = new BehaviorSubject<TransformSpace>(
    TransformSpace.Local,
  );
  private _canvas!: HTMLCanvasElement | null;
  public setCanvas(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
  }

  private _gl!: WebGL2RenderingContext;

  public get scene(): Scene {
    return this.currentScene;
  }

  public get camera(): Camera {
    return this._camera;
  }

  public get gl(): WebGL2RenderingContext {
    return this._gl;
  }

  public get gameEngine(): Engine | null {
    if (!this._gameEngine) {
      this._gameEngine = new Engine();
    }
    return this._gameEngine;
  }

  private currentScene!: Scene;
  private _camera!: Camera;
  constructor() {
    // Register the engine's core classes up front. Loading a saved scene
    // needs them, and they were otherwise only registered when a project's
    // compiled bundle loaded, so projects without scripts could not load scenes.
    new DependencyManager().registerDependencies();
    // Lets the engine load project files stored as asset://<id> (with the JWT).
    inject(EditorResourceLoader).register();
    this.initializeEditorCamera();
    this.onRenderingContextCreated.subscribe(
      this.onGlContextCreated.bind(this),
    );
  }

  onGlContextCreated(gl: WebGL2RenderingContext) {
    console.log("onGlContextCreated");
    this._gl = gl;
  }

  loadScene(scene: Scene) {
    this.currentScene = scene;
    this.gameEngine?.loadScene(scene);
    this.onSceneLoaded.emit(scene);
  }

  requestCanvasResize() {
    this.onCanvasRequestResize.next({
      width: CanvasViewport.rendererWidth,
      height: CanvasViewport.rendererHeight,
    });
  }

  requestScenePlay(scene?: Scene) {
    this.onScenePlay.emit(scene);
  }

  requestScenePause(scene?: Scene) {
    this.onScenePause.emit(scene);
  }

  requestSceneStop(scene?: Scene) {
    this.onSceneStop.emit(scene);
  }

  public setGizmoMode(mode: GizmoMode) {
    this.gizmoMode.next(mode);
  }

  public setTransformSpace(space: TransformSpace) {
    this.transformSpace.next(space);
  }

  public setToggleWorkspacePanel(
    panel: "left" | "right" | "footer",
    visible: boolean,
  ) {}

  protected initializeEditorCamera() {
    this._camera = new Camera();
    this._camera.name = "Editor Camera";
    this._camera.fieldOfView = 65;
    this._camera.transform.translate(2, 3, 10);
    this._camera.transform.rotate(0, 180, 0);
    this._camera.initialize();
    this._camera.addBehaviour(new CameraFlyBehaviour());
    Camera.setMainCamera(this._camera);
    this._camera.updateInEditor = true;
  }

  public async reloadEngineRuntime(): Promise<Engine | null> {
    const project = this.editorStateService.activeProject();
    if (!project?.id) {
      if (this._gameEngine) {
        this._gameEngine.destroy();
        this._gameEngine = null;
      }
      return null;
    }

    if (this._gameEngine) {
      this._gameEngine.destroy();
      this._gameEngine = null;
    }

    const baseGateway = this.apiUrl.endsWith("/api")
      ? this.apiUrl
      : `${this.apiUrl}/api`;

    // Fetch with the JWT in the header (never in the URL), then import the
    // code from a blob URL. 404 means the project has no compiled scripts yet.
    const response = await fetch(`${baseGateway}/projects/${project.id}/code/bundle`, {
      headers: { Authorization: `Bearer ${this.authService.getToken() ?? ""}` },
      cache: "no-store",
    });
    if (response.status === 404) {
      console.info(`Project ${project.id} has no compiled scripts yet.`);
      return null;
    }
    if (!response.ok) {
      console.error(`Could not load the scripts of project ${project.id} (HTTP ${response.status}).`);
      return null;
    }

    const moduleUrl = URL.createObjectURL(
      new Blob([await response.text()], { type: "text/javascript" }),
    );
    try {
      const gameModule = await import(/* @vite-ignore */ moduleUrl);
      if (!gameModule.Game) {
        console.error("The project's scripts don't export a 'Game' class.");
        return null;
      }

      const engine = new gameModule.Game();
      if (!(engine instanceof Engine)) {
        console.error("The project's exported 'Game' class does not extend Engine.");
        return null;
      }

      engine.registerDependencies();
      this._gameEngine = engine;
      return engine;
    } catch (error) {
      console.error(`The scripts of project ${project.id} failed to run:`, error);
      return null;
    } finally {
      URL.revokeObjectURL(moduleUrl);
    }
  }
}
