## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CircleHelper | editor/behaviours/scene-editor/circle.helper |

This component is responsible for generating and managing the necessary WebGL buffers (vertex and index) required to render a geometric circle shape. It encapsulates the low-level graphics setup, allowing higher-level systems to request the drawing of a circle without needing to manage buffer creation or geometry calculation themselves.

It functions as a specialized rendering utility within the scene editor's behaviour layer. It relies on the `omega-game-engine` for shader access and interacts with the rendering context (`WebGL2RenderingContext`) to perform all buffer operations, fitting into the rendering pipeline managed by the scene editor.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| CircleHelper | Class | Manages the geometry and rendering state for a circle. |
| draw | Method | Renders the circle using the provided shader, allowing drawing as a line loop or as individual points. |
| destroy | Method | Releases the underlying WebGL buffers associated with the circle geometry. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor calculates the vertices and indices for a circle based on a specified radius and segment count. The `draw` method binds these pre-calculated buffers to the active shader program, sets necessary attributes and uniforms, and executes the appropriate drawing command (`LINE_LOOP` or `POINTS`).
- **Side Effects:** Mutates the state of the WebGL context by creating, binding, and deleting `WebGLBuffer` objects.
- **Error Handling:** Checks if the provided `shader` object has a valid `_shaderProgram` before attempting to draw, preventing runtime errors if the shader is not initialized.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `omega-game-engine`
- **Internal:** None