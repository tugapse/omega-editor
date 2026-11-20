## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Raycast |
| Source file | raycast.ts |

The **Raycast** component is a specialized mathematical utility class designed to bridge the gap between 2D screen-space interactions (such as mouse clicks) and 3D world-space coordinates. It provides the essential geometric calculations required for spatial selection and interaction within the editor's viewport.

**Functional Mission**
The primary responsibility of **Raycast** is to perform coordinate space transformations and geometric intersection tests. It solves the problem of translating user input from a flat 2D canvas into a directional vector (ray) in a 3D scene, and subsequently determining where that ray intersects with mathematical primitives like planes.

**System Context & Integration**
This component acts as a low-level utility for higher-level editor behaviours. It is critical for modules that require spatial awareness, such as [Entity Pick Behaviour](/AgentDocs/editor/behaviours/scene-editor/entitypick.behaviour.md) or various gizmo interactions. By consuming camera matrices and viewport dimensions, it facilitates the transition from user interface events to meaningful 3D scene manipulations.

- **INTERNAL REFERENCES**: [Raycast](/AgentDocs/editor/behaviours/scene-editor/raycast.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `position.x` / `position.y` (via `Mouse.mousePosition`)  The 2D coordinates of the cursor on the canvas.
- `CanvasViewport.rendererWidth` (via `CanvasViewport`)  The width of the rendering viewport used for normalization.
- `CanvasViewport.rendererHeight` (via `CanvasViewport`)  The height of the rendering viewport used for normalization.

**Hardcoded Constants:**
- `0.0001` (Default: `0.0001`)  Epsilon value used to prevent division by zero during plane intersection calculations.
- `-1.0` (Default: `-1.0`)  Z-coordinate used for clip space to eye space transformation.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `screenPointToRay` | Static Func | Converts 2D screen coordinates into a normalized 3D direction vector in world space. |
| `intersectRayWithPlane` | Static Func | Calculates the 3D point where a given ray intersects an infinite plane defined by an origin and normal. |

## 4. Execution Logic & Flow
- **Initialization**: Requires a valid `Camera` instance (providing projection and view matrices) and a `WebGL2RenderingContext` to access the canvas dimensions.
- **Data Path (screenPointToRay)**:
    1. **Normalization**: Converts pixel coordinates to Normalized Device Coordinates (NDC) range `[-1, 1]`.
    2. **Clip to Eye**: Transforms NDC coordinates into eye space using the inverse projection matrix.
    3. **Eye to World**: Transforms eye space coordinates into world space using the inverse view matrix.
    4. **Vectorization**: Extracts the resulting position and normalizes it to produce a unit direction vector.
- **Data Path (intersectRayWithPlane)**:
    1. **Dot Product Check**: Calculates the dot product of the ray direction and plane normal to check for parallelism.
    2. **Intersection Calculation**: If not parallel, calculates the scalar `t` representing the distance along the ray to the intersection point.
    3. **Point Derivation**: Scales the ray direction by `t` and adds it to the ray origin to return the final `vec3` intersection point.
- **Conditional Branching**:
    - In `intersectRayWithPlane`, if the absolute value of the denominator (dot product) is less than or equal to `0.0001`, the function returns `null` to indicate no intersection (ray is parallel to the plane).

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Camera](/AgentDocs/editor/behaviours/scene-editor/raycast.md) (via `omega-game-engine`)
    - [CanvasViewport](/AgentDocs/editor/behaviours/scene-editor/raycast.md) (via `omega-game-engine`)
    - [Mouse](/AgentDocs/editor/behaviours/scene-editor/raycast.md) (via `omega-game-engine`)
- **External Packages**: 
    - `gl-matrix` (for `mat4`, `vec3`, `vec4` operations)
    - `omega-game-engine` (for core engine types)