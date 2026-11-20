## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TorusHelper | editor/behaviours/scene-editor/torus.helper |

This component is responsible for generating and managing the geometric data required to render a torus shape in a 3D scene. It handles the complex mathematical process of calculating the vertices and indices that define the surface of the torus based on user-defined parameters like radius and tube thickness.

As a specialized geometry utility, `TorusHelper` functions as a low-level rendering primitive provider. It interfaces directly with the WebGL context to create and populate vertex and index buffers, allowing other scene components, such as the main scene editor, to utilize this pre-calculated geometry for rendering via a provided [Shader](/omega-game-engine.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| TorusHelper | Class | Manages the creation, storage, and rendering of torus geometry. |
| draw | Method | Renders the torus geometry using the provided shader, binding the necessary vertex and index buffers. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `init` method calculates the 3D coordinates for vertices by iterating over angular segments (tubular and radial). It then generates triangle indices to connect these vertices, forming the mesh. The `draw` method then uses WebGL calls to bind the stored position and index buffers and executes a `gl.drawElements` call to render the geometry.

- **Side Effects:** Mutates the internal state by creating and populating WebGL buffers (`positionBuffer` and `indexBuffer`) within the provided `WebGL2RenderingContext`.

- **Error Handling:** The `draw` method includes checks to ensure the provided `shader` object and its internal program handle (`shader._shaderProgram`) are valid before attempting to retrieve attribute locations.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Shader](/omega-game-engine.md)