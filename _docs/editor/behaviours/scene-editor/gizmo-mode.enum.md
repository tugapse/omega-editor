## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| GizmoMode | editor/behaviours/scene-editor/gizmo-mode.enum |

This component defines a set of discrete, named constants representing the available modes for manipulating objects within the scene editor's gizmo interface. Its primary responsibility is to provide a strongly typed enumeration that dictates the specific transformation operationtranslation, rotation, or scalingthat the user intends to perform on a selected entity.

This enum serves as a fundamental data type within the scene editor's behavior system. It is consumed by the logic responsible for interpreting user input on the gizmo widget, allowing the system to correctly dispatch the appropriate transformation handler, which likely interacts with components like [SceneEditor](/editor/behaviours/scene-editor/scene-editor.md) or [GizmoController](/editor/behaviours/scene-editor/gizmo-controller.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| GizmoMode | Enum | Defines the possible modes for gizmo interaction: 'translate', 'rotate', and 'scale'. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None