## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Canvas |
| Source file | canvas.ts |

The **Canvas** component serves as the primary visual viewport and rendering bridge between the Angular application and the `omega-game-engine`. It manages the lifecycle of the WebGL2 context, handles high-frequency animation frames via `requestAnimationFrame`, and orchestrates the execution of the engine's update and render loops.

By operating outside of the Angular Zone, the component ensures that the intensive computational requirements of the game engine do not trigger unnecessary change detection cycles, thereby maintaining high performance and stable frame rates. It acts as a central hub for viewport-related events, such as resizing and context management, while providing real-time performance telemetry to the rest of the system.

**Functional Mission**
The primary responsibility of **Canvas** is to provide a high-performance, controlled environment for WebGL2 rendering. It solves the problem of synchronizing a high-frequency game loop with the browser's refresh rate while providing a stable interface for the engine to receive input and output visual data.

**System Context & Integration**
The component integrates deeply with the `EditorService` to respond to global editor commands like resizing or resetting the WebGL context. It consumes state from `EditorSettingsService` to apply viewport configurations (like clear colors) and listens to `GizmoMode` and `TransformSpace` updates to ensure the visual representation of editor tools remains synchronized with the user's intent.

Downstream, it emits performance statistics via the `stats` output, which are typically consumed by the [Engine Stats](/AgentDocs/editor/components/engine-stats/engine-stats.md) component. It also facilitates the communication of frame-level updates (delta time and GL context) through the `EditorService`.

- **INTERNAL REFERENCES**: [EditorService](/AgentDocs/editor/services/editor.service.md), [EditorSettingsService](/AgentDocs/editor/services/editor.settings.md), [GizmoMode](/AgentDocs/editor/behaviours/scene-editor/gizmo-mode.enum.md), [TransformSpace](/AgentDocs/editor/behaviours/scene-editor/transform-space.enum.md), [Engine Stats](/AgentDocs/editor/components/engine-stats/engine-stats.md), [Icon](/AgentDocs/app/components/icon/icon.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `viewportClearColor` (via `editorSettings.settings`)  Determines the background color used during the WebGL clear pass.

**Hardcoded Constants:**
- `targetFps` (Default: `60`)  The intended frequency of the render loop.
- `frameInterval` (Default: `16.66ms`)  Calculated interval based on `targetFps` to throttle rendering.
- `defaultClearColor` (Default: `Colors.brown`)  Fallback color if no setting is provided.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `onGlContextCreated` | Output | Emits the `WebGL2RenderingContext` when successfully initialized. |
| `stats` | Output | Emits `EngineStats` objects containing FPS and timing telemetry. |
| `gl` | Property | Public access to the active `WebGL2RenderingContext`. |
| `gizmoMode` | Property | Current active [GizmoMode](/AgentDocs/editor/behaviours/scene-editor/gizmo-mode.enum.md). |
| `transformSpace` | Property | Current active [TransformSpace](/AgentDocs/editor/behaviours/scene-editor/transform-space.enum.md). |
| `shouldRender` | Method | Boolean check determining if the engine should proceed with the current frame based on tab/window focus. |
| `setGizmoMode` | Method | Updates the global gizmo mode via `EditorService`. |
| `toggleTransformSpace` | Method | Toggles between Local and World transform spaces. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Subscribes to `EditorService` events for resizing and resetting.
    2. `ngAfterViewInit` triggers `initWebGL()`.
    3. `initWebGL` acquires the `webgl2` context and emits it.
    4. The engine is initialized with the canvas element.
    5. `requestAnimationFrame` is invoked outside the Angular Zone to start the `render` loop.
- **Data Path**: 
    1. **Input**: `timestamp` from `requestAnimationFrame`.
    2. **Processing**: 
        - Calculate `delta` time.
        - Execute `engine.update(delta)`.
        - If `frameInterval` has elapsed, execute `executeRenderPass()`.
        - Accumulate timing metrics (update, render, browser overhead).
    3. **Output**: 
        - `onUpdateFrame` (delta).
        - `onRenderFrame` (GL context).
        - `stats` (EngineStats object every 1000ms).
- **Conditional Branching**:
    - `shouldRender()`: If the tab is inactive or window is unfocused, the loop skips update/render logic and immediately schedules the next frame.
    - `timeSinceLastDraw >= frameInterval`: Throttles the `executeRenderPass` to maintain the target FPS.
    - `resizeCanvas(force)`: Only updates WebGL viewport and canvas dimensions if dimensions have actually changed or `force` is true.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs` (Subject, fromEvent), `performance` (timing).
- **Internal Modules**: 
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [EditorSettingsService](/AgentDocs/editor/services/editor.settings.md)
    - [GizmoMode](/AgentDocs/editor/behaviours/scene-editor/gizmo-mode.enum.md)
    - [TransformSpace](/AgentDocs/editor/behaviours/scene-editor/transform-space.enum.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [CanvasViewport](/AgentDocs/engine/phisics/world.md) (via `omega-game-engine` imports)
- **External Packages**: `@angular/core`, `omega-game-engine`