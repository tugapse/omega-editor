## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EditorService | /editor/services/editor.service.md |

This component serves as the central orchestration service for the editor environment, managing the lifecycle of the game engine, scene loading, and editor-specific interactions like camera control and gizmo manipulation. Its primary responsibility is to provide a unified interface through which other parts of the application can interact with the underlying rendering and simulation capabilities of the game engine.

As a core service, `EditorService` acts as a controller layer, mediating between the application state (managed by [EditorStateService](/editor/services/editor-state.service.md)) and the complex, low-level rendering engine. It exposes numerous event emitters and subjects to allow decoupled components to subscribe to state changes, such as scene loading events or rendering frame updates.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| onSceneLoaded | EventEmitter | Emitted when a scene has been successfully loaded into the engine. |
| onScenePlay | EventEmitter | Emitted when the scene playback is requested. |
| onScenePause | EventEmitter | Emitted when the scene playback is paused. |
| onSceneStop | EventEmitter | Emitted when the scene playback is stopped. |
| onSceneUpdated | EventEmitter | Emitted when the scene state has been updated. |
| onEditorSaveStateRequest | EventEmitter | Emitted to signal a request to save the current editor state. |
| editorRunningState | EventEmitter | Emitted to broadcast the current running state of the editor. |
| onRenderingContextCreated | EventEmitter | Emitted when the WebGL2RenderingContext is available for rendering. |
| onCanvasRequestResize | BehaviorSubject | Subject used to request canvas resizing with new width and height. |
| onCanvasRequestReset | EventEmitter | Emitted to request a reset of the canvas viewport. |
| onRenderFrame | BehaviorSubject | Subject that emits the WebGL2RenderingContext during a render frame. |
| onUpdateFrame | BehaviorSubject | Subject that emits the current frame update count. |
| gizmoMode | BehaviorSubject | Subject controlling the active gizmo mode (e.g., Translate, Rotate). |
| transformSpace | BehaviorSubject | Subject controlling the active coordinate space for transformations (e.g., Local, World). |
| setCanvas | Method | Sets the internal reference to the HTMLCanvasElement used by the editor. |
| get scene | Getter | Returns the currently loaded Scene object. |
| get camera | Getter | Returns the active Camera instance. |
| get gl | Getter | Returns the initialized WebGL2RenderingContext. |
| get gameEngine | Getter | Returns the active Engine instance, initializing it if necessary. |
| setGizmoMode | Method | Updates the active gizmo mode via the `gizmoMode` subject. |
| setTransformSpace | Method | Updates the active transformation space via the `transformSpace` subject. |
| setToggleWorkspacePanel | Method | Controls the visibility of specific workspace panels. |
| reloadEngineRuntime | Method | Asynchronously destroys and reloads the entire game engine runtime based on the active project configuration. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service initializes a default camera upon construction and maintains a reference to the `Engine` instance. Scene loading involves setting the current scene and calling `gameEngine?.loadScene()`. The `reloadEngineRuntime` method handles complex dynamic module loading by constructing a URL pointing to a project's bundled code, fetching it, and instantiating the `Game` class from the loaded module.
- **Side Effects:** The code interacts heavily with external state and systems. It reads authentication tokens from `localStorage` and `sessionStorage`, makes network requests via `apiUrl` to load project bundles, and mutates the internal state of the `Engine` and `Camera` objects.
- **Error Handling:** The `reloadEngineRuntime` method uses a `try...catch` block to handle critical failures during dynamic module loading, logging specific errors related to linker failures or network issues.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- `API_URL`  The base URL for the application's API endpoints, used to construct dynamic bundle URLs.

**Module Dependencies:**
- **Standard/External:** `EventEmitter`, `BehaviorSubject` (from RxJS), `Engine`, `Scene`, `Camera`, `CanvasViewport` (from `omega-game-engine`).
- **Internal:** [EditorStateService](/editor/services/editor-state.service.md), [API_URL](/src/app/api/api-url.token.md).