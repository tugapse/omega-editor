## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EditorGridBehaviour |
| Source file | grid-behaviour.ts |

The **EditorGridBehaviour** is a specialized rendering component designed to provide visual spatial orientation within the scene editor. It functions as a visual aid, overlaying a coordinate grid onto the scene to assist users in perceiving depth, scale, and position during the editing process.

**Functional Mission**
The primary responsibility of **EditorGridBehaviour** is to manage the lifecycle and rendering of a 2D grid plane within a 3D environment. It solves the problem of "floating" objects by providing a stable visual reference frame, utilizing WebGL line primitives to draw horizontal and vertical axes.

**System Context & Integration**
As a subclass of `RendererBehaviour`, this component integrates into the engine's rendering pipeline, specifically targeting the `RenderLayer.POST_SCENE` layer to ensure the grid is drawn on top of existing scene geometry without being occluded by standard depth testing. It relies on the `Shader` and `ColorMaterial` systems to apply its visual properties and interacts with the `WebGL2RenderingContext` to execute low-level draw calls.

- **INTERNAL REFERENCES**: [EditorGridBehaviour](/AgentDocs/editor/behaviours/scene-editor/grid-behaviour.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The `WebGL2RenderingContext` used for all low-level drawing operations.

**Hardcoded Constants:**
- `gridColor` (Default: `new Color(0.31, 0.31, 0.48)`)  The RGBA color applied to the grid lines.
- `gridLineWidt` (Default: `1.0`)  The thickness/scale factor for the grid lines (Note: typo in source).
- `lineWidth` (Default: `10.0`)  The WebGL line width set during construction.
- `count` (Default: `10`)  The number of lines drawn in each direction during the `draw` cycle.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `EditorGridBehaviour` | Class | Main controller for grid rendering logic and lifecycle. |
| `gridColor` | Property | Publicly accessible color configuration for the grid. |
| `gridLineWidt` | Property | Publicly accessible width configuration for the grid. |
| `createMesh()` | Method | Initializes the internal `Mesh` and `MeshData` structures. |
| `createGridVertices()` | Method | Placeholder for vertex generation logic. |
| `draw()` | Method | The main render loop entry point; manages shader state and line drawing. |
| `drawVerticalLines()` | Method | Iterates through X-axis coordinates to draw vertical lines. |
| `drawHorizontalLines()` | Method | Iterates through Z-axis coordinates to draw horizontal lines. |
| `drawLine()` | Method | (Inherited) Executes the actual WebGL draw call for a single line segment. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives `WebGL2RenderingContext`.
    2. Instantiates `ColorMaterial` and `Shader`.
    3. Sets `dephMode` to `Less` and `renderLayer` to `POST_SCENE`.
    4. Calls `createMesh()` to prepare empty geometry.
    5. Sets global WebGL `lineWidth` to `10.0`.
    6. Sets `active` status to `false` by default.
- **Data Path**: 
    1. `draw()` is called by the renderer.
    2. Checks `active` status and `shader` validity.
    3. If not initialized, triggers `initialize()`.
    4. `gridColor` is converted to a `vec4` and passed to the shader material.
    5. `drawVerticalLines` and `drawHorizontalLines` generate `Vector3` start/end points.
    6. Points are passed to `drawLine` for GPU execution.
- **Conditional Branching**:
    - `if (!this.shader?._shaderProgram || !this.active)`: Aborts drawing if the shader is not ready or the component is toggled off.
    - `if (!this._initialized)`: Triggers the engine's initialization sequence if the component hasn't been prepared.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (vec3)
- **Internal Modules**: 
    - `Color` (via `omega-game-engine`)
    - `ColorMaterial` (via `omega-game-engine`)
    - `DephFunction` (via `omega-game-engine`)
    - `Mesh` (via `omega-game-engine`)
    - `MeshData` (via `omega-game-engine`)
    - `RendererBehaviour` (via `omega-game-engine`)
    - `RenderLayer` (via `omega-game-engine`)
    - `Shader` (via `omega-game-engine`)
    - `Vector3` (via `omega-game-engine`)
- **External Packages**: `gl-matrix`