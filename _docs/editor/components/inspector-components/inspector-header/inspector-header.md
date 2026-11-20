## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| InspectorHeader | editor/components/inspector-components/inspector-header/inspector-header.md |

This component is responsible for rendering the header section of the Inspector panel within the editor interface. Its primary duty is to display contextual information, such as the title of the inspector window, and to provide a mechanism for closing or dismissing the inspector view when an entity is no longer selected.

Architecturally, `InspectorHeader` functions as a presentation layer UI component. It consumes state via `@Input()` properties, specifically receiving the currently selected `SceneEntity` and the desired `windowTitle`. It interacts with core editor services, `EditorService` and `SceneTreeService`, to trigger state changes like deselection or canvas resizing upon user interaction (e.g., closing the panel).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `entity` | Input | The `SceneEntity` currently being inspected. Can be null if nothing is selected. |
| `windowTitle` | Input | The title displayed in the inspector header. Defaults to 'Inspector'. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `onClose` method orchestrates the panel dismissal sequence. It first emits an event via `SceneTreeService` to signal the deselection of the current entity. Subsequently, it emits a save state request via `EditorService`, followed by a delayed call to `EditorService.requestCanvasResize()` to ensure UI consistency after the state change.

- **Side Effects:** Mutates external/global state by emitting events through `SceneTreeService` and `EditorService`, which drive the application's state management (entity selection, editor state persistence, and canvas rendering).

- **Error Handling:** No explicit error handling (try/catch blocks) is present in the provided code.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [CommonModule](/common/common.md) [Icon](/components/icon/icon.md) [Toggle](/components/toggle/toggle.md) [EditorService](/editor/services/editor.service.md) [SceneTreeService](/editor/services/scene-tree.service.md)