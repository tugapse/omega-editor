## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | PlaneHelper |
| Source file | plane.helper.ts |

The **PlaneHelper** class is a specialized WebGL utility designed to facilitate the visual representation of planes within the scene editor. It manages the creation and buffering of geometric data required to render both a solid surface and a structural grid overlay, providing visual depth and spatial orientation to the user during scene manipulation.

**Functional Mission**
The primary responsibility of **PlaneHelper** is to encapsulate the low-level WebGL buffer management and draw calls necessary to render a subdivided plane. It solves the problem of providing a consistent, high-performance visual reference for "ground" or "surface" planes by pre-calculating vertex positions and index buffers for both solid quads and structural line segments.

**System Context & Integration**
This component acts as a low-level rendering helper within the scene editor ecosystem. It is intended to be utilized by higher-level behaviours or gizmo systems to provide visual feedback. While it operates directly on the `WebGL2RenderingContext`, its output is driven by `Shader` objects provided by the engine. It serves as a visual primitive that supports the spatial awareness required for complex editor interactions.

- **INTERNAL REFERENCES**: [PlaneHelper](/AgentDocs/editor/behaviours/scene-editor/plane.helper.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The `WebGL2RenderingContext` used for all GPU buffer operations and draw calls.

**Hardcoded Constants:**
- `divisions` (Default: `3`)  Determines the density of the grid structure (creates a 3x3 grid of quads).
- `54` (Default: `54`)  The number of indices used in the `drawSolid` call (6 indices per quad * 9 quads).
- `72` (Default: `72`)  The number of indices used in the `drawLines` call (8 indices per quad * 9 quads).

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `PlaneHelper` | Class | Manages WebGL buffers and rendering logic for plane geometries. |
| `constructor` | Function | Initializes the WebGL context and triggers the geometry generation. |
| `drawSolid` | Method | Binds position and index buffers to render the filled plane quads using a provided shader. |
| `drawLines` | Method | Binds position and line-index buffers to render the structural grid lines using a provided shader. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `init()` method is invoked upon instantiation.
    2. A 3x3 grid of vertices is calculated based on the `divisions` constant.
    3. Two sets of indices are generated: `indices` for solid triangle quads and `lineIndices` for the perimeter lines of each quad.
    4. Three WebGL buffers are created and populated: `positionBuffer` (vertices), `indexBuffer` (solid geometry), and `lineIndexBuffer` (wireframe geometry).
- **Data Path**: 
    - **Input**: `WebGL2RenderingContext` and `Shader` objects.
    - **Processing**: Vertex/Index data is uploaded to GPU memory via `bufferData`. During draw calls, `vertexAttribPointer` maps the buffer data to the shader's `A_POSITION` attribute.
    - **Output**: Rendered geometry on the WebGL canvas.
- **Conditional Branching**:
    - **Shader Validation**: Both `drawSolid` and `drawLines` check if `shader._shaderProgram` exists and if the `A_POSITION` attribute location is valid (`!== -1`) before proceeding with draw calls. If validation fails, the method returns early to prevent WebGL errors.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Shader](/AgentDocs/engine/shaders/shader-sources.md) (via `omega-game-engine`)
    - [ShaderUniformsEnum](/AgentDocs/engine/shaders/shader-sources.md) (via `omega-game-engine`)
- **External Packages**: `omega-game-engine`