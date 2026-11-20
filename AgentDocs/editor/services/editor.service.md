## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EditorService |
| Source file | src/editor/services/editor.service.ts |

The **EditorService** acts as the central orchestration hub for the Omega Editor's runtime environment. It manages the lifecycle of the game engine, the editor's viewport camera, and the WebGL rendering context. By serving as a bridge between the Angular application layer and the underlying `omega-game-engine`, it provides a reactive interface for scene management, playback controls, and real-time editor state updates.

**Functional Mission**
The primary mission of **EditorService** is to manage the execution lifecycle of the game engine instance and provide a unified event-driven API for editor-related operations. It solves the problem of synchronizing the high-performance game engine loop with the Angular framework's reactive state management, handling critical tasks such as dynamic module injection for project runtimes and viewport resizing.

**System Context & Integration**
This service sits at the core of the editor's execution flow. It consumes project data from [EditorStateService](/AgentDocs/editor/services/editor-state.service.md) to dynamically load and boot the specific game logic for a project via `reloadEngineRuntime`. It emits signals that downstream components, such as the [Canvas](/AgentDocs/editor/components/canvas/canvas.md) or playback UI, use to respond to scene changes or engine state transitions. It also manages the global editor camera, which is essential for the [Gizmos Behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md) and scene navigation.

- **INTERNAL REFERENCES**: 
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [GizmoMode](/AgentDocs/editor/behaviours/scene-editor/gizmo-mode.enum.md)
    - [TransformSpace](/AgentDocs/editor/behaviours/scene-editor/transform-space.enum.md)
    - [API_URL](/AgentDocs/app/api/api-url.token.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `apiUrl` (via `inject(API_URL)`)  The base URL for the backend API used to fetch project bundles.
- `omega-auth-token` (via `localStorage.getItem`)  Authentication token for securing dynamic module requests.
- `token` (via `sessionStorage.getItem`)  Fallback authentication token.

**Hardcoded Constants:**
- `65` (Default: `fieldOfView`)  Initial field of view for the editor camera.
- `2, 3, 10` (Default: `translate`)  Initial position of the editor camera.
- `0, 180, 0` (Default: `rotate`)  Initial rotation of the editor camera.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `loadScene` | Method | Assigns a new scene to the current context and instructs the engine to load it. |
| `requestCanvasResize` | Method | Triggers a resize event using current `CanvasViewport` dimensions. |
| `requestScenePlay` | Method | Emits a signal to start scene playback. |
| `requestScenePause` | Method | Emits a signal to pause scene playback. |
| `requestSceneStop` | Method | Emits a signal to stop the current scene execution. |
| `setGizmoMode` | Method | Updates the current active `GizmoMode` via BehaviorSubject. |
| `setTransformSpace` | Method | Updates the current active `TransformSpace` via BehaviorSubject. |
| `reloadEngineRuntime` | Method | Asynchronously destroys the current engine and dynamically imports/boots a new project bundle. |
| `setCanvas` | Method | Registers the HTMLCanvasElement for rendering context management. |
| `gameEngine` | Getter | Provides access to the `Engine` instance, lazily initializing it if necessary. |
| `scene` | Getter | Returns the currently active `Scene`. |
| `camera` | Getter | Returns the editor's primary `Camera`. |
| `gl` | Getter | Returns the active `WebGL2RenderingContext`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Initializes the `_camera` with specific FOV, position, and rotation.
    2. Attaches `CameraFlyBehaviour` to the camera.
    3. Sets the camera as the global main camera.
    4. Subscribes to `onRenderingContextCreated` to capture the WebGL context.
- **Data Path (Engine Reloading)**: 
    1. **Input**: `reloadEngineRuntime` is called.
    2. **Processing**: 
        - Retrieves active project ID from `EditorStateService`.
        - Destroys existing `_gameEngine` if present.
        - Constructs a dynamic `bundleUrl` using `apiUrl` and auth tokens.
        - Performs a dynamic `import()` of the remote bundle.
        - Validates that the exported `Game` class exists and is an instance of `Engine`.
    3. **Output**: Returns the new `Engine` instance or `null` on failure.
- **Conditional Branching**:
    - **Project Validation**: If `project.id` is missing during reload, the engine is destroyed and `null` is returned.
    - **Module Validation**: If the imported module lacks a `Game` export or the export is not an `Engine` instance, error logs are generated and `null` is returned.
    - **Error Handling**: A `try-catch` block wraps the dynamic import to catch network or execution faults during runtime injection.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs` (BehaviorSubject, EventEmitter)
- **Internal Modules**: 
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [GizmoMode](/AgentDocs/editor/behaviours/scene-editor/gizmo-mode.enum.md)
    - [TransformSpace](/AgentDocs/editor/behaviours/scene-editor/transform-space.enum.md)
    - [API_URL](/AgentDocs/app/api/api-url.token.md)
- **External Packages**: `omega-game-engine` (Engine, Scene, Camera, CameraFlyBehaviour, CanvasViewport)