## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | PlanarQuadHelper |
| Source file | planar-quad.helper.ts |

The **PlanarQuadHelper** is a specialized WebGL utility class designed to render a specific geometric primitive: an L-shaped quad bracket. This component serves as a visual aid within the scene editor, providing a lightweight, buffer-based method to draw 2D-like planar shapes directly onto the WebGL context.

**Functional Mission**
The primary responsibility of **PlanarQuadHelper** is to manage the lifecycle of WebGL buffers (position and index) required to render a static, L-shaped geometry. It solves the problem of repetitive buffer creation for editor UI elements or selection indicators by encapsulating the vertex data and the draw call logic into a reusable helper.

**System Context & Integration**
This component operates at the low-level rendering layer of the editor. It is intended to be utilized by higher-level scene manipulation behaviours, such as [gizmos-behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md), to provide visual feedback during user interaction. It relies on an external `Shader` instance to define how the vertex data is processed by the GPU, acting as a bridge between raw geometry data and the engine's shader system.

- **INTERNAL REFERENCES**: [gizmos-behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The `WebGL2RenderingContext` used for all GPU operations.

**Hardcoded Constants:**
- `vertices` (Default: `Float32Array([...])`)  The raw coordinate data defining the L-shaped bracket.
- `indices` (Default: `Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7])`)  The element array defining the triangle topology.
- `12` (Default: `12`)  The count of indices used in the `drawElements` call.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `PlanarQuadHelper` | Class | Manages WebGL buffers and rendering logic for an L-shaped quad. |
| `constructor(gl)` | Constructor | Initializes the helper with a WebGL2 context and triggers buffer setup. |
| `draw(shader)` | Method | Binds buffers and executes the draw call using the provided shader. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives `WebGL2RenderingContext`.
    2. Defines a `Float32Array` containing 24 floats representing 8 vertices (3D coordinates).
    3. Defines a `Uint16Array` for index-based triangle rendering.
    4. Creates and populates `positionBuffer` (ARRAY_BUFFER) with vertex data.
    5. Creates and populates `indexBuffer` (ELEMENT_ARRAY_BUFFER) with index data.
- **Data Path**: 
    - `vertices` $\rightarrow$ `positionBuffer` $\rightarrow$ `gl.vertexAttribPointer` $\rightarrow$ GPU.
    - `indices` $\rightarrow$ `indexBuffer` $\rightarrow$ `gl.drawElements` $\rightarrow$ GPU.
- **Conditional Branching**:
    - `if (!shader._shaderProgram)`: Aborts `draw` if the shader is not compiled/ready.
    - `if (posLoc === -1)`: Aborts `draw` if the `A_POSITION` attribute cannot be located in the shader program.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix`
- **Internal Modules**: 
    - `Shader` (via `omega-game-engine`)
    - `ShaderUniformsEnum` (via `omega-game-engine`)
- **External Packages**: `gl-matrix`