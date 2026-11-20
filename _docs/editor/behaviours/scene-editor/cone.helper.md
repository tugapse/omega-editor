## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ConeHelper | editor/behaviours/scene-editor/cone.helper |

This component is responsible for generating and managing the necessary WebGL buffers (vertex and index) required to render a 3D cone geometry. Its primary responsibility is encapsulating the geometry creation logic, ensuring that the cone's vertices and indices are correctly loaded into GPU buffers for efficient rendering within the scene editor context.

This class functions as a low-level rendering utility within the scene editor subsystem. It relies on the `WebGL2RenderingContext` provided during instantiation to manage GPU resources. It interacts with the `Shader` component to execute the drawing commands, fitting into the rendering pipeline managed by the broader scene editor architecture.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ConeHelper | Class | Manages the creation, storage, and rendering of a cone mesh using WebGL buffers. |
| draw | Method | Executes the rendering of the cone geometry using the provided shader, binding the necessary vertex and index buffers. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `createConeGeometry` method generates the cone's vertices and indices by calculating points around a circular base and connecting them to a single tip vertex. The constructor then takes these arrays and uploads them to dedicated `WebGLBuffer` objects (one for vertices, one for indices) on the GPU. The `draw` method binds these buffers, configures the vertex attribute pointers, and issues a `gl.drawElements` call.

- **Side Effects:** Mutates external state by creating and managing `WebGLBuffer` objects on the GPU context (`_gl`).

- **Error Handling:** Checks if the provided `shader` object and its internal `_shaderProgram` exist before attempting to draw, preventing runtime errors if the shader is not properly initialized.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [omega-game-engine]/Shader, [omega-game-engine]/ShaderUniformsEnum