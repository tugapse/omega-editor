## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PlanarQuadHelper | editor/behaviours/scene-editor/planar-quad.helper |

This component is responsible for managing and rendering a specific geometric primitive: a solid L-shaped quad bracket. It encapsulates the necessary WebGL resourcesvertex and index buffersto define this shape, allowing for efficient, repeated drawing operations within the rendering pipeline.

It functions as a low-level rendering utility within the scene editor's behavior system. It relies on the `Shader` component to provide the necessary rendering context and shader program, integrating directly with the engine's rendering infrastructure to draw geometry defined by its internal buffers.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| PlanarQuadHelper | Class | Manages the creation and drawing of a fixed L-shaped quad using WebGL buffers. |
| draw | Method | Renders the stored L-shaped quad geometry using the provided `Shader` instance. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `init` method pre-calculates and uploads the vertex data (positions) and index data for the L-shaped quad into dedicated WebGL buffers (`positionBuffer` and `indexBuffer`). The `draw` method then binds these buffers, configures the vertex attribute pointers, and issues a `gl.drawElements` call to render the geometry using the provided shader.

- **Side Effects:** Interacts heavily with the WebGL2RenderingContext (`this.gl`) to create, bind, and buffer GPU resources.

- **Error Handling:** Includes checks to ensure the provided `shader` object has a valid `_shaderProgram` and that the attribute location for `ShaderUniformsEnum.A_POSITION` is valid (`!== -1`) before attempting to draw.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [omega-game-engine](/omega-game-engine.md)