## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CircleHelper |
| Source file | circle.helper.ts |

The **CircleHelper** is a specialized WebGL utility class designed to generate and render circular geometric primitives within the scene editor. It abstracts the complexity of procedural geometry generation, specifically handling the creation of vertex and index buffers required to represent a circle as either a continuous line loop or a collection of discrete points.

Its primary mission is to provide a lightweight, reusable mechanism for drawing circular visual aids, such as selection rings or gizmo outlines, directly onto the WebGL context. By managing its own GPU buffers, it ensures efficient rendering cycles during the editor's draw loop.

**Functional Mission**
The **CircleHelper** solves the problem of procedural circle rendering by calculating trigonometric vertex positions and managing the lifecycle of WebGL buffers. Its core mission is to provide a high-performance, low-level drawing interface for circular shapes within the editor's visual workspace.

**System Context & Integration**
This component operates at a low level within the rendering pipeline, typically invoked by higher-level scene editor behaviours or gizmo systems. It relies on an external `Shader` instance to define how the vertices are processed and rendered. While it does not directly interact with the [Gizmos Behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md), it serves as a fundamental building block for visual feedback mechanisms used during scene manipulation.

- **INTERNAL REFERENCES**: [CircleHelper](/AgentDocs/editor/behaviours/scene-editor/circle.helper.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `_gl` (via `constructor`)  The `WebGL2RenderingContext` used for all GPU buffer operations and draw calls.

**Hardcoded Constants:**
- `radius` (Default: `1.0`)  The radial distance from the center to the vertices in `createCircleGeometry`.
- `segments` (Default: `64`)  The number of subdivisions used to approximate the circle's curvature.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `constructor` | Class | Initializes the WebGL context and pre-calculates/uploads circle geometry to the GPU. |
| `createCircleGeometry` | Private Method | Procedurally generates vertex (x, y, z) and index arrays based on radius and segments. |
| `draw` | Public Method | Binds buffers, sets shader attributes, and executes the WebGL draw call (either `LINE_LOOP` or `POINTS`). |
| `destroy` | Public Method | Explicitly deletes the vertex and index buffers from GPU memory to prevent leaks. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives `WebGL2RenderingContext`.
    2. Calls `createCircleGeometry` to generate raw numerical arrays.
    3. Creates a `vertexBuffer` and uploads the `Float32Array` of vertices using `STATIC_DRAW`.
    4. Creates an `indexBuffer` and uploads the `Uint16Array` of indices using `STATIC_DRAW`.
- **Data Path**: 
    - **Input**: `Shader` object, `pointSize` (number), `asPoints` (boolean).
    - **Processing**: 
        1. Activates the provided shader.
        2. Locates the `A_POSITION` attribute.
        3. Binds the vertex and index buffers.
        4. Loads shader-specific uniform data via `shader.loadDataIntoShader()`.
        5. If `asPoints` is true, sets `u_pointSize` and uses `gl.POINTS`.
        6. If `asPoints` is false, uses `gl.LINE_LOOP`.
    - **Output**: Direct rendering of a circle to the WebGL viewport.
- **Conditional Branching**:
    - **Shader Validation**: If `shader._shaderProgram` is null/undefined, the `draw` method exits immediately.
    - **Render Mode**: A boolean check on `asPoints` determines whether the GPU uses `gl.POINTS` (for particle-like rendering) or `gl.LINE_LOOP` (for outline rendering).

## 5. Resource Dependencies
- **Standard Libraries**: `Math` (for trigonometric calculations).
- **Internal Modules**: 
    - [Shader](/AgentDocs/editor/behaviours/scene-editor/circle.helper.md) (via `omega-game-engine` import)
    - [ShaderUniformsEnum](/AgentDocs/editor/behaviours/scene-editor/circle.helper.md) (via `omega-game-engine` import)
- **External Packages**: `omega-game-engine`