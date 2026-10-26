## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CubeHelper |
| Source file | cube.helper.ts |

The **CubeHelper** class is a specialized utility designed to generate and render a geometric cube primitive within the WebGL2 context of the editor. It serves as a lightweight visual aid, likely used for gizmos, bounding box visualizations, or selection indicators within the scene editor environment.

**Functional Mission**
The primary responsibility of **CubeHelper** is to encapsulate the lifecycle of a cube meshfrom vertex and index buffer generation to the execution of draw calls using specific shaders. It solves the problem of repetitive mesh creation by providing a reusable, pre-configured geometric primitive that can be rendered with arbitrary transformations and colors.

**System Context & Integration**
This component operates at the intersection of the rendering engine and the editor's scene manipulation tools. It consumes `Shader` and `Mesh` abstractions from the `omega-game-engine` to interface with the GPU. In the broader execution flow, it is utilized by scene-editing behaviours (such as those found in `/AgentDocs/editor/behaviours/scene-editor/gizmos/bounding-box-gizmo.md`) to provide visual feedback to the user during object manipulation or selection. It acts as a bridge between raw WebGL2 commands and the high-level scene editor logic.

- **INTERNAL REFERENCES**: [CubeHelper](/AgentDocs/editor/behaviours/scene-editor/cube.helper.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `_gl` (via `constructor`)  The `WebGL2RenderingContext` used for all low-level GPU operations.

**Hardcoded Constants:**
- `size` (Default: `0.2`)  The edge length of the cube used during mesh generation in `createMesh`.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `constructor` | Class Constructor | Initializes the WebGL context, shaders, and triggers mesh creation and buffer initialization. |
| `draw` | Public Method | Executes the draw call for the cube, applying a transformation matrix, color, and specific shader. |
| `createMesh` | Private Method | Generates the vertex positions and index arrays for a standard 6-faced cube. |
| `initialize` | Private Method | Uploads the generated mesh data to the GPU via the provided shaders. |
| `bind` | Private Method | Binds the shader's internal buffers to the current WebGL state. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The constructor receives the WebGL context, a standard shader, and a picking shader.
    2. `createMesh` is called to define the geometry (vertices and indices) in CPU memory.
    3. `initialize` is called to transfer this geometry to the GPU using `shader.initBuffers` and `pickingShader.initBuffers`.
- **Data Path**: 
    - **Input**: `transformMatrix` (mat4), `color` (Color), `shader` (Shader).
    - **Processing**: The `shader` is activated via `use()`, buffers are bound, and the `ColorMaterial` within the shader is updated with the provided color vector.
    - **Output**: A WebGL draw call (`drawElements`) is dispatched to render the cube.
- **Conditional Branching**: 
    - In `draw`, the method performs a null-check on `shader?._shaderProgram`. If the shader program is not initialized, the function returns early to prevent WebGL errors.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (for `mat4` and `vec3` operations).
- **Internal Modules**: 
    - [Mesh](/AgentDocs/editor/behaviours/scene-editor/cube.helper.md) (via `omega-game-engine`)
    - [Shader](/AgentDocs/editor/behaviours/scene-editor/cube.helper.md) (via `omega-game-engine`)
    - [MeshData](/AgentDocs/editor/behaviours/scene-editor/cube.helper.md) (via `omega-game-engine`)
    - [Color](/AgentDocs/editor/behaviours/scene-editor/cube.helper.md) (via `omega-game-engine`)
    - [ColorMaterial](/AgentDocs/editor/behaviours/scene-editor/cube.helper.md) (via `omega-game-engine`)
- **External Packages**: `gl-matrix`