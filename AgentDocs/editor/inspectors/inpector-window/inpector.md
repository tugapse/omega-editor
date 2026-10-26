## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EditorInpector |
| Source file | inpector.ts |

The **EditorInpector** component serves as the primary container and orchestrator for the property inspection interface within the editor. It acts as a specialized window that dynamically adapts its content based on the currently selected entity in the scene, providing a centralized location for users to view and modify object attributes.

**Functional Mission**
The primary responsibility of **EditorInpector** is to manage the lifecycle and visibility of the inspection panel. It solves the problem of contextual property editing by receiving a `targetEntity` and delegating the rendering of specific properties to specialized sub-components, ensuring that the user interface remains relevant to the selected object.

**System Context & Integration**
This component sits within the editor's UI layer, acting as a bridge between the scene state and the user interface. It consumes `SceneEntity` data via an `@Input()` and interacts heavily with the [EditorService](/AgentDocs/editor/services/editor.service.md) to manage global editor states. When the inspector is closed, it triggers state persistence requests and canvas updates through the service, ensuring that any changes made during the inspection session are synchronized with the engine's scene state.

- **INTERNAL REFERENCES**: 
    - [InspectorHeader](/AgentDocs/editor/components/inspector-components/inspector-header/inspector-header.md)
    - [MovableDirective](/AgentDocs/editor/directives/moveable.directive.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [EntityInspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md)
    - [EditorService](/AgentDocs/editor/services/editor.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `targetEntity` | `@Input() SceneEntity` | The currently selected entity from the scene to be inspected. |
| `objectsToshow` | Property (Array) | A collection of metadata describing properties to be rendered in the UI. |
| `entity` | Property (SceneEntity \| null) | Internal tracking of the active entity state. |
| `onClose()` | Method | Handles the teardown of the inspector, emitting save requests and scene update signals via the `EditorService`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The component initializes with an empty `objectsToshow` array.
    - It injects the `EditorService` to facilitate communication with the broader editor environment.
- **Data Path**: 
    - **Input**: Receives a `targetEntity` (of type `SceneEntity`) from a parent component.
    - **Processing**: While the logic for populating `objectsToshow` is not explicitly defined in this file, the component is structured to pass the entity context down to the [EntityInspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md).
    - **Output**: Renders a structured UI containing a header, icons, and entity-specific property editors.
- **Conditional Branching**:
    - **onClose() Execution**: When the close action is triggered, the component nullifies the local `entity` reference and executes a sequence of service calls:
        1. Emits `onEditorSaveStateRequest(true)` to persist changes.
        2. Calls `requestCanvasResize()` to adjust the viewport.
        3. Emits `onSceneUpdated` with the current scene to notify downstream listeners of the state change.

## 5. Resource Dependencies
- **Standard Libraries**: `@angular/common`, `@angular/core`
- **Internal Modules**: 
    - [MovableDirective](/AgentDocs/editor/directives/moveable.directive.md)
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [InspectorHeader](/AgentDocs/editor/components/inspector-components/inspector-header/inspector-header.md)
    - [EntityInspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md)
- **External Packages**: `omega-game-engine` (provides `SceneEntity`)