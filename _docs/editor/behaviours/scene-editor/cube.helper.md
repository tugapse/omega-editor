## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CubeHelper | editor/behaviours/scene-editor/cube.helper |

This component is responsible for generating and managing the geometric representation of a standard cube primitive within the scene editor. It encapsulates the necessary vertex, index, and mesh data required to render a 3D cube using WebGL2. Its primary responsibility is to provide a reusable, pre-configured mesh object that can be drawn with specific transformations and materials.

The `CubeHelper` acts as a concrete implementation detail within the scene editor's rendering pipeline. It utilizes low-level graphics context (`WebGL2RenderingContext`) and shader objects to initialize and draw the geometry. It integrates with the broader rendering system by accepting transformation matrices and color data to correctly display the cube, fitting into the rendering service layer of the application.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| CubeHelper | Class | Manages the creation, initialization, and rendering of a cube mesh. |
| draw | Method | Renders the cube using the provided transformation matrix, color, and shader. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `createMesh` method defines the 8 vertices and the 36 indices required to form the six faces of a cube. The `initialize` method then uploads this raw geometry data to the bound buffers of both the primary shader and the picking shader. The `draw` method handles the rendering loop by binding the correct shader, setting the material color, and executing `gl.drawElements`.

- **Side Effects:** Mutates the internal state of the `Mesh` object by assigning `MeshData`. It interacts directly with the `WebGL2RenderingContext` (`this._gl`) to perform drawing operations.

- **Error Handling:** Checks if `shader?._shaderProgram` exists before attempting to draw, preventing runtime errors if the shader is not properly initialized.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [omega-game-engine](/omega-game-engine.md)