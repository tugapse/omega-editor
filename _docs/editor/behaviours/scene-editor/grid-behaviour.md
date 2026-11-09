## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EditorGridBehaviour | editor/behaviours/scene-editor/grid-behaviour |

This component is responsible for rendering a visual grid overlay within the scene editor environment. Its primary function is to draw persistent, structured lines (both horizontal and vertical) onto the rendering surface, providing users with a spatial reference system for placing and manipulating entities. It achieves this by utilizing a custom shader and mesh rendering pipeline.

This behaviour acts as a specialized rendering service within the scene editor architecture. It inherits from [RendererBehaviour](/editor/behaviours/scene-editor/grid-behaviour.md) and is configured to render in the [RenderLayer.POST_SCENE](/omega-game-engine.md) layer, ensuring it appears on top of the main scene geometry. It relies on core engine components like [ColorMaterial](/omega-game-engine.md) and [Shader](/omega-game-engine.md) for its visual output.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EditorGridBehaviour | Class | Manages the creation and rendering of the scene grid lines. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `EditorGridBehaviour` initializes by setting up a custom shader and mesh. The `draw()` method is the execution point, which calls `drawHorizontalLines` and `drawVerticalLines` to generate and render the grid lines based on a configurable count. The line drawing logic uses `Vector3` instances to define start and end points for the lines, which are then passed to the internal `drawLine` method.
- **Side Effects:** Mutates the internal state of the `RendererBehaviour` (e.g., setting `this.active`) and performs rendering operations via the underlying WebGL context (`this._gl`).
- **Error Handling:** Includes a check in `draw()` to ensure the shader program is initialized (`!this.shader?._shaderProgram`) and that the behaviour is active (`!this.active`) before attempting to render.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [omega-game-engine](/omega-game-engine.md)