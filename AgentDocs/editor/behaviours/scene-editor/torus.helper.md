## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | TorusHelper |
| Source file | torus.helper.ts |

The **TorusHelper** class is a specialized geometric utility designed to generate and render torus-shaped meshes within a WebGL2 context. It serves as a low-level primitive generator that encapsulates the mathematical complexity of calculating toroidal vertices and indices, abstracting the buffer management away from the higher-level scene editor logic.

**Functional Mission**
The primary responsibility of **TorusHelper** is to provide a reusable, GPU-ready representation of a torus. It solves the problem of procedural geometry generation by calculating the parametric coordinates for a torus and uploading the resulting vertex and index data to the GPU via WebGL buffers, allowing for efficient rendering of donut-shaped primitives.

**System Context & Integration**
This component functions as a helper within the scene editor's visual toolkit. It is intended to be utilized by higher-level gizmos or visual aids, such as those found in [gizmos-behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md), to provide visual feedback or spatial markers. It interacts directly with the WebGL rendering pipeline by accepting a [Shader](/AgentDocs/engine/shaders/shader-sources.md) and utilizing the `ShaderUniformsEnum` to map vertex data to the correct shader attributes during the draw call.

- **INTERNAL REFERENCES**: [Shader](/AgentDocs/engine/shaders/shader-sources.md), [gizmos-behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The `WebGL2RenderingContext` used for all buffer operations and draw calls.

**Hardcoded Constants:**
- `radius` (Default: `1.0`)  The distance from the center of the tube to the center of the torus.
- `tubeRadius` (Default: `0.02`)  The radius of the tube itself.
- `radialSegments` (Default: `64`)  The number of segments around the ring of the torus.
- `tubularSegments` (Default: `16`)  The number of segments around the tube.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `TorusHelper` | Class | Manages the lifecycle, geometry generation, and WebGL rendering of a torus mesh. |
| `constructor` | Function | Initializes the WebGL context and triggers the geometry generation process. |
| `init` | Private Method | Performs the mathematical calculation of vertices/indices and populates WebGL buffers. |
| `draw` | Public Method | Binds the necessary buffers and executes the WebGL draw call using the provided shader. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The constructor receives the `WebGL2RenderingContext` and geometric parameters.
    2. `init()` is called to perform heavy computation.
    3. Vertices are calculated using parametric equations:
        - $x = (R + r \cos(u)) \cos(v)$
        - $y = (R + r \cos(u)) \sin(v)$
        - $z = r \sin(u)$
    4. Indices are generated to form triangles from the vertex grid.
    5. `positionBuffer` (Float32Array) and `indexBuffer` (Uint16Array) are created and uploaded to the GPU.
- **Data Path**: 
    - Input (Radius, Tube, Segments) $\rightarrow$ Mathematical Vertex/Index Generation $\rightarrow$ GPU Buffer Upload $\rightarrow$ Draw Call Execution.
- **Conditional Branching**: 
    - In `draw()`, the method checks if `shader._shaderProgram` exists; if not, it aborts to prevent WebGL errors.
    - In `draw()`, it checks if the `A_POSITION` attribute location is valid (`!== -1`) before proceeding with buffer binding.

## 5. Resource Dependencies
- **Standard Libraries**: `Math` (for trigonometric calculations).
- **Internal Modules**: 
    - [Shader](/AgentDocs/engine/shaders/shader-sources.md)
    - [ShaderUniformsEnum](/AgentDocs/engine/shaders/shader-sources.md)
- **External Packages**: `WebGL2RenderingContext` (Web API).