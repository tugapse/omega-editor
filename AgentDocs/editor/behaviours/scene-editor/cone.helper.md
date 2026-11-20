## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ConeHelper |
| Source file | cone.helper.ts |

The **ConeHelper** is a specialized WebGL utility class designed to manage the lifecycle and rendering of a cone primitive within the scene editor. It encapsulates the complexities of geometry generation, buffer management, and low-level WebGL draw calls, providing a clean interface for visual debugging or gizmo representation.

**Functional Mission**
The primary responsibility of **ConeHelper** is to provide a lightweight, GPU-resident cone geometry for the editor's visual feedback systems. It solves the problem of procedural geometry management by handling the creation of vertex and index buffers, ensuring that the cone can be rendered efficiently using standard WebGL draw commands.

**System Context & Integration**
This component acts as a low-level rendering helper within the scene editor ecosystem. It is intended to be utilized by higher-level gizmo or visual aid systems, such as those found in [Gizmos Behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md). It receives a `Shader` instance from the engine to perform its draw calls, bridging the gap between raw geometric data and the engine's shading pipeline.

- **INTERNAL REFERENCES**: [Gizmos Behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `_gl` (via `constructor`)  The `WebGL2RenderingContext` used for all GPU operations.

**Hardcoded Constants:**
- `radius` (Default: `0.1`)  The radial extent of the cone base.
- `height` (Default: `0.3`)  The vertical extent of the cone.
- `segments` (Default: `16`)  The number of subdivisions around the cone's circumference.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ConeHelper` | Class | Manages the creation, storage, and rendering of a cone primitive. |
| `constructor` | Function | Initializes WebGL buffers with procedurally generated cone geometry. |
| `createConeGeometry` | Private Function | Calculates vertex positions (tip, base perimeter, base center) and index arrays. |
| `draw` | Public Function | Binds buffers, configures vertex attributes, and executes the WebGL draw call. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Calls `createConeGeometry` to generate raw numerical arrays for vertices and indices.
    2. Creates a `vertexBuffer` and uploads the vertex data using `gl.STATIC_DRAW`.
    3. Creates an `indexBuffer` and uploads the index data using `gl.STATIC_DRAW`.
    4. Stores the `indexCount` for subsequent draw calls.
- **Data Path**: 
    - **Input**: `radius`, `height`, `segments` (parameters for geometry generation).
    - **Processing**: Trigonometric calculation of base vertices $\rightarrow$ Index mapping for triangles $\rightarrow$ GPU Buffer upload.
    - **Output**: A rendered cone on the WebGL canvas via `drawElements`.
- **Conditional Branching**:
    - In `draw()`, the method checks if `shader?._shaderProgram` exists; if null or undefined, the execution terminates early to prevent WebGL errors.

## 5. Resource Dependencies
- **Standard Libraries**: `Math` (Trigonometry)
- **Internal Modules**: 
    - [Shader](/AgentDocs/engine/shaders/shader-sources.md) (via `omega-game-engine` import)
    - [ShaderUniformsEnum](/AgentDocs/engine/shaders/shader-sources.md) (via `omega-game-engine` import)
- **External Packages**: `omega-game-engine`