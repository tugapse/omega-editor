## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Editor |
| Source file | editor.ts |

The **Editor** component serves as the central orchestrator and root container for the Omega Editor application. It manages the lifecycle of the game engine runtime, coordinates the interaction between various editor sub-systems (such as the scene tree, inspector, and asset explorer), and maintains the global state of the active scene during both edit and play modes.

**Functional Mission**
The primary mission of the **Editor** is to provide a unified workspace that bridges the gap between raw engine data and a user-friendly manipulation interface. It solves the problem of complex state synchronization by acting as a mediator between the `Engine` (via `EditorService`) and the UI components, ensuring that user inputs (like entity selection or gizmo manipulation) are correctly propagated to the underlying scene and vice versa.

**System Context & Integration**
The component sits at the top of the editor's component hierarchy. It initializes the WebGL context and hands it off to the `EditorService` to boot the engine. It listens to high-level events from the `SceneTreeService` to update the inspector and manages "behaviours" (grid, gizmos, and entity picking) that overlay the `Canvas`. It also handles persistence logic, allowing users to save scene data to the API via the `AssetService` or manage local session state.

- **INTERNAL REFERENCES**: 
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)
    - [EditorSettingsService](/AgentDocs/editor/services/editor.settings.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [WindowService](/AgentDocs/editor/services/window.service.md)
    - [AssetService](/AgentDocs/app/api/services/asset.service.md)
    - [LoadingService](/AgentDocs/app/services/loading.service.md)
    - [EditorInpector](/AgentDocs/editor/inspectors/inpector-window/inpector.md)
    - [TopBar](/AgentDocs/editor/components/top-bar/top-bar.md)
    - [SceneTree](/AgentDocs/editor/components/scene-tree/scene-tree.md)
    - [AssetExplorerWindow](/AgentDocs/editor/components/window/window.md)
    - [EngineStatsComponent](/AgentDocs/editor/components/engine-stats/engine-stats.md)
    - [WorkspaceComponent](/AgentDocs/editor/components/workspace/workspace.md)
    - [EditorMainMenu](/AgentDocs/editor/components/editor-main-menu/editor-main-menu.md)
    - [CodeWorkspaceComponent](/AgentDocs/code-editor/editor/code-editor.component.md)
    - [Canvas](/AgentDocs/editor/components/canvas/canvas.md)
    - [OmegaLoggerPanelComponent](/AgentDocs/editor/components/problems-panel/problems-panel.md)
    - [EditorGridBehaviour](/AgentDocs/editor/behaviours/scene-editor/grid-behaviour.md)
    - [GizmosBoxBehaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md)
    - [EditorEntityPicker](/AgentDocs/editor/behaviours/scene-editor/entitypick.behaviour.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `projectId` (via `ngAfterViewInit` -> `route.snapshot.paramMap`)  Retrieves the active project identifier from the URL.
- `sceneId` (via `ngAfterViewInit` -> `route.snapshot.paramMap`)  Retrieves the active scene identifier from the URL.
- `write-scene` (via `handleEngineReloaded` -> `queryParamMap`)  Flag to determine if the scene should be loaded from the API or a different source.

**Hardcoded Constants:**
- `omg_scene` (Default: `"omg_scene"`)  Key used for `sessionStorage` persistence.
- `3000` (Default: `3000`)  Duration in milliseconds for toast message visibility.
- `Colors.cornflowerBlue` (Default: `cornflowerBlue`)  Default clear color for the scene.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `onGlContextCreated` | Method | Receives the WebGL context from the canvas and initializes the engine. |
| `onSceneLoaded` | Method | Handles the transition when a new scene is ready, setting up edit mode and behaviours. |
| `onScenePlay` | Method | Transitions the scene from edit mode to running mode, capturing a snapshot for potential rollback. |
| `onScenePause` | Method | Suspends the scene execution loop. |
| `onSceneStop` | Method | Destroys the current running scene and restores the previous state from a snapshot. |
| `onSceneTreeEntitySelected` | Method | Updates the inspector target and gizmo focus when an entity is clicked in the tree. |
| `saveSceneToApi` | Method | Serializes the current scene and sends it to the backend via `AssetService`. |
| `toggleFullscreen` | Method | Toggles the UI fullscreen state and triggers a canvas resize. |
| `isLeftVisible` | Getter | Returns visibility state for the left panel based on user settings. |
| `isRightVisible` | Getter | Returns visibility state for the right panel based on user settings. |
| `isFooterVisible` | Getter | Returns visibility state for the footer based on user settings. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. `ngOnInit`: Triggers the `LoadingService` to show a global loading overlay.
    2. `ngAfterViewInit`: Extracts `projectId` and `sceneId` from the route.
    3. `editorService.reloadEngineRuntime()`: Boots the engine instance.
    4. `handleEngineReloaded`: Fetches scene JSON via `AssetService` and uses `SceneManager.loadScene` to instantiate the scene.
    5. `createEditorBehaviours`: Instantiates `EditorGridBehaviour`, `GizmosBoxBehaviour`, and `EditorEntityPicker`.
- **Data Path (Scene Save)**: 
    `Scene (toJsonObject)` $\rightarrow$ `JSON.stringify` $\rightarrow$ `AssetService.saveSceneAsset` $\rightarrow$ `API Response` $\rightarrow$ `Toast Notification`.
- **Conditional Branching**:
    - **Play/Pause Logic**: If `onScenePlay` is called while already running, it simply unpauses. If not running, it creates a `sceneState` snapshot before calling `scene.initialize()`.
    - **Stop Logic**: If the scene is not running and not paused, the function exits early to prevent redundant destruction.
    - **Error Handling**: `handleEngineReloaded` contains `try-catch` blocks to catch JSON parsing errors or engine loading failures, ensuring the `LoadingService` is hidden even on failure.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs`, `JSON`
- **Internal Modules**: 
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)
    - [EditorSettingsService](/AgentDocs/editor/services/editor.settings.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [WindowService](/AgentDocs/editor/services/window.service.md)
    - [AssetService](/AgentDocs/app/api/services/asset.service.md)
    - [LoadingService](/AgentDocs/app/services/loading.service.md)
    - [EditorGridBehaviour](/AgentDocs/editor/behaviours/scene-editor/grid-behaviour.md)
    - [GizmosBoxBehaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md)
    - [EditorEntityPicker](/AgentDocs/editor/behaviours/scene-editor/entitypick.behaviour.md)
    - [EngineLogger](/AgentDocs/engine/logger.md)
- **External Packages**: `@angular/core`, `@angular/common`, `@angular/router`, `rxjs`