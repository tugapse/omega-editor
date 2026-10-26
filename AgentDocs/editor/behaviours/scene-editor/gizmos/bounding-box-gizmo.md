## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | BoundingBoxGizmo |
| Source file | bounding-box-gizmo.ts |

The **BoundingBoxGizmo** is a specialized visualization utility within the scene editor's gizmo system. Its primary purpose is to provide visual feedback of an entity's spatial boundaries by rendering a wireframe bounding box in the 3D viewport. This allows users to perceive the volume and scale of selected objects during the editing process.

**Functional Mission**
The core mission of **BoundingBoxGizmo** is to translate abstract `BoundingBox` data into visible geometric lines within the renderer. It solves the problem of spatial ambiguity by drawing a padded, wireframe representation of an object's extents, ensuring that the boundaries are clearly distinguishable from the object's actual mesh.

**System Context & Integration**
This component acts as a drawing bridge between the engine's mathematical representations and the visual output. It consumes `BoundingBox` data and utilizes a `RendererBehaviour` to execute draw calls. It is part of the broader gizmo ecosystem, likely orchestrated by [GizmosBehaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md), to provide contextual visual aids when an entity is selected in the editor.

- **INTERNAL REFERENCES**: [BoundingBox](/AgentDocs/editor/behaviours/scene-editor/gizmos/bounding-box-gizmo.md) (via engine types), [RendererBehaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos/bounding-box-gizmo.md) (via engine types).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `spacing` (Default: `0.1`)  An optional padding value added to the bounding box dimensions to prevent Z-fighting or to make the box more visible.
- `selectedBoundingBoxLineWidth` (Default: `3.0`)  The thickness of the lines used to draw the bounding box.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `selectedBoundingBoxColor` | Property (Color) | Stores the color used for the selected entity's bounding box. |
| `selectedBoundingBoxLineWidth` | Property (number) | Stores the thickness of the lines for the bounding box. |
| `drawBoundingBox` | Method | Calculates the 8 vertices of a padded bounding box and issues line draw commands to the renderer. |

## 4. Execution Logic & Flow
- **Initialization**: The class is instantiated with a `RendererBehaviour` instance, which is stored privately for use in drawing operations.
- **Data Path**: 
    1. **Input**: Receives a `BoundingBox` object (containing `min_x`, `min_y`, `min_z`, `max_x`, `max_y`, `max_z`) and an optional `spacing` value.
    2. **Processing**: 
        - Calculates 8 distinct `Vector3` points representing the corners of the box (Top-Left-Far, Top-Left-Near, Bottom-Left-Far, Bottom-Left-Near, Top-Right-Far, Top-Right-Near, Bottom-Right-Far, Bottom-Right-Near).
        - Applies the `spacing` offset to all coordinates to expand the box outward.
    3. **Output**: Executes a series of `this.renderer.drawLine` calls to construct the wireframe (4 vertical edges, 4 depth edges, and 4 horizontal edges).
- **Conditional Branching**: No conditional branching logic is present in the current implementation.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - `Color`, `Colors`, `RendererBehaviour`, `BoundingBox`, `Vector3` (via `omega-game-engine`)
- **External Packages**: None identified.