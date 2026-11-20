## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ScaleBoxHelper | editor/behaviours/scene-editor/scale-box.helper |

This component is responsible for managing and rendering a standardized 3D bounding box, often used in scene editors to visualize the scale or dimensions of selected objects. It encapsulates the necessary WebGL resourcesvertex and index buffersto draw a perfectly centered cube geometry.

It functions as a low-level rendering utility within the scene editor subsystem. It relies on the `Shader` class from `omega-game-engine` to execute the drawing commands, integrating directly with the rendering pipeline managed by the editor's core systems.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ScaleBoxHelper | Class | Manages the geometry and drawing logic for the scale visualization box. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `init` method pre-populates two WebGL buffers: one for vertex positions (defining the cube's corners) and one for indices (defining the triangles). The `draw` method binds these buffers, sets up the vertex attribute pointer for position data, and executes a `gl.drawElements` call to render the 36 triangles that form the cube.
- **Side Effects:** Interacts heavily with the WebGL2RenderingContext (`this.gl`) to create, bind, and buffer GPU resources.
- **Error Handling:** The `draw` method includes checks to ensure the provided `shader` object and its internal program handle (`shader._shaderProgram`) are valid before attempting to retrieve attribute locations.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Shader](/omega-game-engine/shader.md)