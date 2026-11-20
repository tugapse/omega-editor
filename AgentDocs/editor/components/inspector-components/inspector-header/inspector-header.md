## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | InspectorHeader |
| Source file | inspector-header.ts |

The **InspectorHeader** component serves as the top-level UI container for the inspector panel, providing contextual information and control actions for the currently selected entity. It acts as a bridge between the selection state managed by the scene tree and the editor's global state management.

**Functional Mission**
The primary responsibility of **InspectorHeader** is to display the title of the active inspection context (either a custom string or the entity's name) and provide a mechanism to close or deselect the current entity. It solves the problem of providing a clear visual anchor for the user, indicating exactly which object is being manipulated in the inspector.

**System Context & Integration**
This component is a child element within the broader inspector workflow. It listens for input via the `entity` property to determine context. When the user triggers the close action, the component communicates upstream to [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md) to clear the selection and to [EditorService](/AgentDocs/editor/services/editor.service.md) to trigger state persistence and UI layout adjustments (canvas resizing).

- **INTERNAL REFERENCES**: 
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `windowTitle` (Default: `'Inspector'`)  The fallback title displayed when no specific context is provided.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `entity` | `@Input` | Receives the currently selected `SceneEntity` or `null` to determine inspector context. |
| `windowTitle` | `@Input` | Receives a custom string to override the default "Inspector" header text. |
| `onClose()` | Method | Orchestrates the teardown of the current inspection session by emitting events to services. |

## 4. Execution Logic & Flow
- **Initialization**: The component receives an `entity` (of type `SceneEntity`) and a `windowTitle` via Angular inputs. It injects `EditorService` and `SceneTreeService` for state manipulation.
- **Data Path**: 
    - `Input (entity)` $\rightarrow$ Template rendering (displays entity context).
    - `User Interaction (onClose)` $\rightarrow$ `SceneTreeService.onEntitySelected.emit()` $\rightarrow$ Deselection of entity.
    - `User Interaction (onClose)` $\rightarrow$ `EditorService.onEditorSaveStateRequest.emit()` $\rightarrow$ Triggering of editor state persistence.
    - `User Interaction (onClose)` $\rightarrow$ `setTimeout` $\rightarrow$ `EditorService.requestCanvasResize()` $\rightarrow$ Layout recalculation.
- **Conditional Branching**: The `onClose` logic uses a `setTimeout` with a 30ms delay to ensure that the canvas resize request occurs after the DOM/state changes from the emitted events have been processed by the engine.

## 5. Resource Dependencies
- **Standard Libraries**: `@angular/common`, `@angular/core`
- **Internal Modules**: 
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [Toggle](/AgentDocs/app/components/toggle/toggle.md)
- **External Packages**: `omega-game-engine` (provides `SceneEntity`)