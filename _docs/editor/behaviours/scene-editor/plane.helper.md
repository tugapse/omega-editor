## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PlaneHelper | editor/behaviours/scene-editor/plane.helper |

This component is responsible for generating and managing the necessary WebGL buffers to represent a planar surface within the scene editor. It initializes geometry dataincluding vertices for solid rendering and indices for structural linesto create a structured grid, allowing the plane to be drawn both as a solid surface and as a wireframe outline.

The `PlaneHelper` acts as a low-level rendering utility within the scene editor's behaviour layer. It encapsulates the complex setup of GPU buffers, abstracting the raw WebGL calls away from the higher-level scene management logic, and provides specific methods (`drawSolid`, `drawLines`) for rendering using a provided `Shader`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| PlaneHelper | Class | Manages the geometry and rendering state for a planar surface. |
| drawSolid | Method | Renders the plane as a fully filled, solid surface using the provided shader. |
| drawLines | Method | Renders the internal grid structure of the plane as lines using the provided shader. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `init` method constructs a 3x3 grid of vertices. It then calculates two sets of indices: one set for drawing solid quads (using `TRIANGLES`) and another set for drawing the structural lines (using `LINES`). These vertex and index data are loaded into dedicated `WebGLBuffer` objects (`positionBuffer`, `indexBuffer`, `lineIndexBuffer`). The drawing methods then bind these buffers and execute the appropriate WebGL draw calls.

- **Side Effects:** Mutates external state by interacting directly with the `WebGL2RenderingContext` (`this.gl`), creating and populating GPU buffers.

- **Error Handling:** Checks if the provided `shader` object has a valid `_shaderProgram` before attempting to draw. It also checks if the attribute location (`posLoc`) is valid (`!== -1`) before proceeding with vertex attribute setup.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `omega-game-engine`
- **Internal:** None