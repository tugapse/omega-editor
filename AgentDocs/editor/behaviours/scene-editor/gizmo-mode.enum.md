## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | GizmoMode |
| Source file | gizmo-mode.enum.ts |

The **GizmoMode** enumeration serves as a type-safe definition for the various transformation states available to the user within the 3D viewport's manipulation tools. It acts as a central source of truth for identifying which specific transformation operation (translation, rotation, or scaling) is currently active.

**Functional Mission**
The primary responsibility of **GizmoMode** is to provide a discrete set of string-based identifiers that govern the behavior of transformation gizmos. By encapsulating these modes into an enum, the system ensures consistency across the scene editor, preventing errors that would arise from using raw strings to manage the state of object manipulation.

**System Context & Integration**
This component is a foundational piece of the scene editing logic. It is primarily consumed by modules responsible for rendering and handling user interaction with transformation handles, such as [Gizmos Behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md) and potentially [Bounding Box Gizmo](/AgentDocs/editor/behaviours/scene-editor/gizmos/bounding-box-gizmo.md). When a user selects a tool in the editor interface, the active mode is updated, which in turn dictates how raycasting results are interpreted and how the underlying entity's transform properties are modified.

- **INTERNAL REFERENCES**: [Gizmos Behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md), [Bounding Box Gizmo](/AgentDocs/editor/behaviours/scene-editor/gizmos/bounding-box-gizmo.md), [Gizmo Mode](/AgentDocs/editor/behaviours/scene-editor/gizmo-mode.enum.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `GizmoMode.Translate` (Default: `'translate'`)  Represents the mode for moving objects along axes.
- `GizmoMode.Rotate` (Default: `'rotate'`)  Represents the mode for rotating objects around axes.
- `GizmoMode.Scale` (Default: `'scale'`)  Represents the mode for resizing objects.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `GizmoMode` | Enum | Defines the set of valid transformation modes available in the scene editor. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None
- **Internal Modules**: None
- **External Packages**: None