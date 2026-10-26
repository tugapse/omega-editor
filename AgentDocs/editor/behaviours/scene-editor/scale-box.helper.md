## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ScaleBoxHelper |
| Source file | scale-box.helper.ts |

The **ScaleBoxHelper** is a specialized WebGL utility class designed to render a geometric wireframe or solid cube used for visual scaling operations within the scene editor. It serves as a low-level rendering primitive that abstracts the complexities of buffer management and vertex attribute configuration for a standard 3D box.

**Functional Mission**
The primary responsibility of **ScaleBoxHelper** is to provide a reusable, GPU-resident cube geometry that can be drawn using a provided shader. It solves the problem of repeatedly defining vertex and index data for scale gizmos by encapsulating the creation of `WebGLBuffer` objects for positions and indices, ensuring efficient rendering during editor interaction cycles.

**System Context & Integration**
This component operates within the WebGL rendering pipeline of the editor. It is intended to be utilized by higher-level gizmo or behaviour systems, such as [gizmos-behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md) or [bounding-box-gizmo](/AgentDocs/editor/behaviours/scene-editor/gizmos/bounding-box-gizmo.md), to provide visual feedback when a user is manipulating the scale of an entity. It relies on an external `Shader` instance to define how the geometry is rasterized, specifically requiring the shader to support the `A_POSITION` attribute.

- **INTERNAL REFERENCES**: [gizmos-behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md), [bounding-box-gizmo](/AgentDocs/editor/behaviours/scene-editor/gizmos/bounding-box-gizmo.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The `WebGL2RenderingContext` used for all GPU operations.

**Hardcoded Constants:**
- `vertices` (Default: `Float32Array` of 24 floats)  Defines the 8 corner coordinates of a centered unit cube.
- `indices` (Default: `Uint16Array` of 36 values)  Defines the triangle connectivity for the 6 faces of the cube.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `constructor` | Class | Initializes the WebGL context and triggers geometry buffer allocation. |
| `init` | Private Method | Generates and uploads vertex and index data to the GPU. |
| `draw` | Public Method | Binds buffers and executes the `drawElements` command using the provided shader. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives `WebGL2RenderingContext`.
    2. Defines a static set of 24 vertices representing a cube centered at the origin (range -0.5 to 0.5).
    3. Defines 36 indices to form 12 triangles (2 per face).
    4. Creates and populates `positionBuffer` (ARRAY_BUFFER) with vertex data.
    5. Creates and populates `indexBuffer` (ELEMENT_ARRAY_BUFFER) with index data.
- **Data Path**: 
    - **Input**: `Shader` object containing a compiled `_shaderProgram`.
    - **Processing**: 
        1. Locates the `A_POSITION` attribute within the shader.
        2. Binds the `positionBuffer` and configures the vertex attribute pointer.
        3. Binds the `indexBuffer`.
    - **Output**: A rendered cube on the WebGL canvas via `gl.drawElements`.
- **Conditional Branching**:
    - If `shader._shaderProgram` is null/undefined, the `draw` method exits immediately.
    - If the attribute location for `A_POSITION` is `-1` (not found), the `draw` method exits immediately.

## 5. Resource Dependencies
- **Standard Libraries**: `WebGL2RenderingContext`, `WebGLBuffer`, `Float32Array`, `Uint16Array`
- **Internal Modules**: 
    - [Shader](/AgentDocs/engine/shaders/shader-sources.md) (via `omega-game-engine`)
    - [ShaderUniformsEnum](/AgentDocs/engine/shaders/shader-sources.md) (via `omega-game-engine`)
- **External Packages**: `omega-game-engine`