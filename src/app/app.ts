import { AfterViewInit, Component, inject, OnDestroy } from "@angular/core";

import { EditorService } from "@editor/services/editor.service";

import { RouterModule } from "@angular/router";
import {
  AudioCache,
  AudioEngine,
  AudioEngineDiagnostics,
  Camera,
  CanvasViewport,
  Scene,
  SequencerClock,
  VoiceFactory,
} from "omega-game-engine";
import { ConfirmationModalComponent } from "./components/confirmation-modal/confirmation-modal.component";
import { LoadingOverlayComponent } from "./components/loading/loading.component";
import { LoadingService } from "./services/loading.service";
import { OmegaCoreBridgeService } from "./services/omega-core-bridge.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrls: ["./app.scss"],
  standalone: true,
  imports: [RouterModule, ConfirmationModalComponent, LoadingOverlayComponent],
})
export class App implements OnDestroy, AfterViewInit {
  protected loadingService = inject(LoadingService);

  private scene!: Scene;

  constructor(
    private editorService: EditorService,
      private omegaCoreBridge: OmegaCoreBridgeService,
  ) {
    this.omegaCoreBridge.runTestCalculation();

    this.editorService.onSceneLoaded.subscribe(
      this.onEditorLoadScene.bind(this),
    );
  }

  onEditorLoadScene(scene: Scene): any {
    this.scene = scene;
    this.initializeScene(scene);
  }

  ngOnDestroy(): void {
    this.scene?.destroy();
  }
  ngAfterViewInit(): void {
    this.loadingService.hide();
  }

  private initializeScene(scene: Scene): any {
    this.scene = scene;
    this.scene.initialize();
    this.setupCamera();
    const engine = new AudioEngine();
    const cache = new AudioCache(engine.getContext() || new AudioContext());
    const clock = new SequencerClock(engine.getContext() || new AudioContext());

    // Connect voice factory to output to the Synth sub-bus
    const factory = new VoiceFactory(
      engine.getContext() || new AudioContext(),
      cache,
      engine.getSynthBus(), // Procedural synth bus inside the main engine
      engine.getReverbBus(),
      engine.getDelayBus(),
    );

    // 2. Set up the tester
    const testSuite = new AudioEngineDiagnostics(engine, cache, clock, factory);
    testSuite.runDiagnosticSuite();
  }

  private setupCamera() {
    if (!Camera.mainCamera) return;
    Camera.mainCamera.updateInEditor = true;
    Camera.mainCamera.update(0);
    Camera.mainCamera.aspectRatio =
      CanvasViewport.rendererWidth / CanvasViewport.rendererHeight;
  }
}
