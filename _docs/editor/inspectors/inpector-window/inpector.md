## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EditorInpector | editor/inspectors/inpector-window/inpector |

This component is responsible for displaying and managing the inspection panel for a selected entity within the editor environment. Its primary role is to provide a dedicated UI surface where users can view, modify, and interact with the properties of a specific `SceneEntity`. It acts as the primary view layer for entity data inspection.

Architecturally, `EditorInpector` functions as a presentation component within the editor's UI layer. It consumes the `targetEntity` via an `@Input()` and utilizes `EditorService` to manage state changes, such as notifying the system when the inspector window is closed or when the scene state is updated. It integrates several sub-components like [InspectorHeader](/editor/inspectors/inpector-window/inspector-header.md) and [EntityInspector](/editor/inspectors/entity-inspector/entity-inspector.md) to fulfill its display responsibilities.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EditorInpector | Class | Manages the display and interaction logic for inspecting a target SceneEntity. |
| targetEntity | Input | The `SceneEntity` instance that this inspector component should display properties for. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes with an empty list of properties to show (`objectsToshow`). It manages the internal state of the currently inspected entity (`entity`). The `onClose` method is the primary state transition handler, which clears the internal entity reference and notifies the `EditorService` about the closure, triggering canvas resize and scene state updates.

- **Side Effects:** Mutates external/global state by emitting events via `EditorService` (`onEditorSaveStateRequest`, `onSceneUpdated`) and calling `requestCanvasResize`.

- **Error Handling:** No explicit error handling mechanisms are implemented in the provided code snippet.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [CommonModule](/angular/common.md) [MovableDirective](/editor/directives/moveable.directive.md) [EditorService](/editor/services/editor.service.md) [SceneEntity](/omega-game-engine.md) [Icon](/src/app/components/icon/icon.md) [InspectorHeader](/editor/inspectors/inpector-window/inspector-header.md) [EntityInspector](/editor/inspectors/entity-inspector/entity-inspector.md)