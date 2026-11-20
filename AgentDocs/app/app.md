## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | App |
| Source file | app.ts |

The **App** component serves as the primary entry point and orchestrator for the Omega Editor's runtime environment. It is responsible for managing the lifecycle of the WebGL rendering context, initializing the 3D scene, and coordinating the setup of both visual and auditory subsystems.

**Functional Mission**
The primary mission of **App** is to bridge the gap between the Angular application framework and the underlying `omega-game-engine`. It handles the critical transition from a loading state to an active rendering state by listening for the creation of the WebGL context and the loading of scene data, subsequently populating the scene with primitives, lights, and complex entities.

**System Context & Integration**
This component acts as a central hub that integrates several high-level services. It utilizes [LoadingService](/AgentDocs/app/services/loading.service.md) to manage UI visibility during heavy asset loading and [OmegaCoreBridgeService](/AgentDocs/app/services/omega-core-bridge.service.md) for low-level system communication. It heavily relies on [EditorService](/AgentDocs/editor/services/editor.service.md) to receive signals regarding the rendering context and scene availability. Once a scene is active, it populates the environment by interacting with the engine's cache and entity management systems, effectively setting the stage for user interaction within the editor.

- **INTERNAL REFERENCES**: 
    - [LoadingService](/AgentDocs/app/services/loading.service.md)
    - [OmegaCoreBridgeService](/AgentDocs/app/services/omega-core-bridge.service.md)
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [ConfirmationModalComponent](/AgentDocs/app/components/confirmation-modal/confirmation-modal.component.md)
    - [LoadingOverlayComponent](/AgentDocs/app/components/loading/loading.component.md)
    - [RotateBehaviour](/AgentDocs/editor/behaviours/rotate.md)
    - [SunBehaviour](/AgentDocs/editor/behaviours/sun-behaviour.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `write-scene` (via `route.snapshot.queryParamMap`)  A query parameter used to trigger the automatic creation of a new scene upon initialization.

**Hardcoded Constants:**
- `assets/primitives/torus.obj`  Path to the torus mesh data.
- `assets/objs/monkey.obj`  Path to the monkey mesh data.
- `assets/images/wood-texture.jpg`  Path to the floor's albedo texture.
- `assets/images/wood-normal1.jpg`  Path to the floor's normal map.
- `assets/images/brick-wall/TCom_Wall_Stone3_2x2_512_albedo.jpeg`  Default wall texture for entities.
- `assets/images/brick-wall/TCom_Wall_Stone3_2x2_512_normal.jpeg`  Default wall normal map for entities.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `onEditorLoadScene` | Method | Callback triggered when the editor successfully loads a scene; initiates scene initialization. |
| `ngOnDestroy` | Method | Lifecycle hook to ensure the `Scene` is properly destroyed to prevent memory leaks. |
| `ngAfterViewInit` | Method | Lifecycle hook to hide the loading overlay once the view is ready. |
| `onGlContextCreated` | Method | Asynchronous handler for when the WebGL2 context becomes available. |
| `createNewScene` | Method | Orchestrates the instantiation of a new `Scene` and triggers asset loading. |
| `loadAssets` | Method | Sequential execution of scene population (lights, objects, skybox, floor). |
| `initializeScene` | Method | Configures the engine's audio subsystem and camera settings. |
| `createEntity` | Method | A factory method that encapsulates the creation of `SceneEntity`, `Mesh`, and `Material` assignments. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The constructor injects services and subscribes to `onRenderingContextCreated` and `onSceneLoaded` via `EditorService`.
    2. `OmegaCoreBridgeService.runTestCalculation()` is invoked immediately.
- **Data Path (Scene Creation Flow)**:
    1. `onGlContextCreated` detects `write-scene=true` $\rightarrow$ calls `createNewScene()`.
    2. `createNewScene()` $\rightarrow$ instantiates `Scene` $\rightarrow$ calls `loadAssets()`.
    3. `loadAssets()` $\rightarrow$ executes `createLights`, `otherObjetcs`, `addMonkeyObj`, `createSkybox`, and `createFloor` in sequence.
    4. `createEntity()` $\rightarrow$ fetches textures from `EngineCache` $\rightarrow$ applies `LitMaterial` $\rightarrow$ returns `SceneEntity`.
- **Conditional Branching**:
    - **Query Param Check**: If `write-scene` is not `"true"`, the automatic scene creation is bypassed.
    - **Shader/Material Logic**: In `createEntity`, if no shader or material is provided, a default `LitMaterial` is instantiated; if a shader is provided, its internal material is extracted.
    - **Camera Setup**: `setupCamera` exits early if `Camera.mainCamera` is not present.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (vec3)
- **Internal Modules**: 
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [LoadingService](/AgentDocs/app/services/loading.service.md)
    - [OmegaCoreBridgeService](/AgentDocs/app/services/omega-core-bridge.service.md)
    - [RotateBehaviour](/AgentDocs/editor/behaviours/rotate.md)
    - [SunBehaviour](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [ConfirmationModalComponent](/AgentDocs/app/components/confirmation-modal/confirmation-modal.component.md)
    - [LoadingOverlayComponent](/AgentDocs/app/components/loading/loading.component.md)
- **External Packages**: `@angular/core`, `@angular/router`, `gl-matrix`, `omega-game-engine`