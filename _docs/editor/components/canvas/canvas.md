## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Canvas | /editor/components/canvas/canvas.md |

This component is responsible for hosting and managing the primary rendering surface for the editor's 3D scene, utilizing a WebGL2 context. Its primary responsibility is to orchestrate the game engine's lifecyclehandling updates, rendering frames, and managing performance statisticswithin the browser's animation loop. It acts as the bridge between the high-level editor state and the low-level graphics API.

Architecturally, `Canvas` functions as a core UI component that integrates deeply with the application's state management via services like [EditorService](/editor/services/editor.service.md) and [EditorSettingsService](/editor/services/editor.settings.md). It subscribes to global events (like resize or reset) to maintain synchronization with the editor's overall state, ensuring the rendering context is always correctly configured and active.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| onGlContextCreated | EventEmitter | Emitted when the WebGL2 context has been successfully initialized. |
| stats | EventEmitter | Emitted periodically containing performance metrics (FPS, frame times). |
| gizmoMode | GizmoMode | Current mode for gizmo interactions (e.g., Translate, Rotate). |
| transformSpace | TransformSpace | Current coordinate space used for transformations (e.g., Local, World). |
| setGizmoMode | Method | Sets the gizmo mode by calling the corresponding method on [EditorService](/editor/services/editor.service.md). |
| toggleTransformSpace | Method | Switches the current transformation space between World and Local. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component runs a continuous animation loop driven by `requestAnimationFrame`. In each frame, it first checks if rendering is permitted via `shouldRender()`. If permitted, it calculates the delta time, executes the engine's `update()` method, and then conditionally executes the `executeRenderPass()` if enough time has passed since the last draw cycle (based on `frameInterval`). Performance metrics are tracked and emitted every second.
- **Side Effects:** The component heavily mutates external state by interacting with the WebGL context (`this.gl`) and the `EditorService`. It also subscribes to global events from `EditorService` and uses `requestAnimationFrame` to drive the rendering loop.
- **Error Handling:** It includes `try...catch` blocks around engine initialization and update/render calls to prevent application crashes due to user code errors within the engine.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `rxjs`, `performance` (Browser API)
- **Internal:** [EditorService](/editor/services/editor.service.md), [EditorSettingsService](/editor/services/editor.settings.md), [Icon](/src/app/components/icon/icon.md)