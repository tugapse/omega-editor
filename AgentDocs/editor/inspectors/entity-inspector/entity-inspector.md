## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EntityInspector |
| Source file | entity-inspector.ts |

The **EntityInspector** component serves as the primary interface for inspecting and modifying the properties of a `SceneEntity` within the editor environment. It acts as a high-level orchestrator that dynamically generates a user interface based on the properties of the selected entity, providing a bridge between the raw engine data and the user's interactive controls.

**Functional Mission**
The primary responsibility of **EntityInspector** is to provide a contextual property editor for game entities. It solves the problem of dynamic property exposure by scanning an entity's keys, filtering out internal or private engine properties, and mapping valid properties to specific UI inspectors (such as transform, color, or enum inspectors). It also manages the lifecycle of adding new behaviours to an entity via a specialized menu.

**System Context & Integration**
This component extends [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md) and integrates deeply with the `omega-game-engine` to reflect real-time changes. It listens for property changes from various sub-inspectors and propagates those changes back to the `SceneEntity`. When a property is modified, it triggers a canvas resize request via the `editorService` to ensure the visual representation in the viewport remains synchronized with the updated entity state. It also facilitates the addition of new logic to entities by interacting with the `ObjectInstanciator` to create new `EntityBehaviour` instances.

- **INTERNAL REFERENCES**: 
    - [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [TransformInspector](/AgentDocs/editor/inspectors/transform-inspector/transform-inspector.md)
    - [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)
    - [BehaviourInspector](/AgentDocs/editor/inspectors/behaviour-inspector/behaviour-inspector.md)
    - [DefaultInspector](/AgentDocs/editor/inspectors/default-inspector/default-inspector.md)
    - [TextInputInspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md)
    - [AddBehaviourMenuComponent](/AgentDocs/editor/components/add-behaviour-menu/add-behaviour-menu.md)
    - [ColorInspector](/AgentDocs/editor/inspectors/color-inspector/color-inspector.md)
    - [Toggle](/AgentDocs/app/components/toggle/toggle.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `this.editorService.gl`  Accesses the WebGL context required for instantiating new behaviours.
- `this.editorService.onSceneUpdated`  An EventEmitter used to notify the system when the scene structure changes (e.g., after adding a behaviour).
- `this.editorService.requestCanvasResize()`  Method to trigger a viewport refresh following property updates.

**Hardcoded Constants:**
- `excludeProperties` (Default: `['name', 'active', 'updateInEditor', 'entityType', 'show', 'tag', 'destroyed', 'behaviours', 'scene', 'gl']`)  A list of internal engine properties that should not be exposed to the user in the inspector.
- `menuY` (Default: `rect.top - 100`)  Vertical offset calculation for the Add Behaviour menu positioning.
- `menuX` (Default: `24`)  Horizontal offset for the Add Behaviour menu positioning.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `targetEntity` | `@Input` (Setter) | Receives the selected `SceneEntity`, determines if it is a 'Scene' type, and triggers property preparation. |
| `excludeProperties` | `@Input` | Allows external configuration of which entity properties are hidden from the UI. |
| `onNameChanged` | Method | Updates the `name` property of the entity and triggers a scene update. |
| `onTagChanged` | Method | Updates the `tag` property of the entity. |
| `onValueChanged` | Override (Method) | Handles standard scalar value changes (string, number, boolean) and applies them to the entity. |
| `onColorChanged` | Override (Method) | Handles `Color` type changes specifically for color-based properties. |
| `onAddBehaviourRequested` | Method | Calculates menu positioning and populates the list of available behaviours via `ObjectInstanciator`. |
| `onBehaviourSelected` | Method | Instantiates a new behaviour class and attaches it to the current entity. |
| `onEnumChange` | Override (Method) | Handles selection changes from dropdown/enum UI components. |
| `onDefaultChanged` | Method | Handles generic property updates for types not covered by specific overrides. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Extends `ObjectInspector`.
    - Initializes `_enums` by converting `CameraType` into a dropdown-compatible object.
    - Appends scene-specific properties (`isRunning`, `inEditMode`, `ellapsedTime`) to the `excludeProperties` list.
- **Data Path (Property Mapping)**:
    1. `targetEntity` is set.
    2. `prepareProperties(entity)` is called.
    3. `Object.keys(entity)` are iterated.
    4. `isPropertyValid(key)` filters out private/excluded keys.
    5. `mapProperty(entity, key)` determines if the property is an `enum` or a standard type.
    6. Resulting `ITargetProperty[]` is stored in `objectsToshow` for template rendering.
- **Conditional Branching**:
    - **Behaviour Menu**: If `onAddBehaviourRequested` is triggered, the component queries `ObjectInstanciator` for metadata matching `EntityBehaviour` or `RenderBehaviour`, filtering out the base classes.
    - **Value Updates**: `onValueChanged` checks for `NaN` or missing entities before applying changes to prevent engine corruption.
    - **Scene Detection**: The `_isScene` flag is toggled based on whether `entity.className == 'Scene'`, allowing for specialized property exclusion logic.

## 5. Resource Dependencies
- **Standard Libraries**: `CommonModule` (Angular)
- **Internal Modules**: 
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [TransformInspector](/AgentDocs/editor/inspectors/transform-inspector/transform-inspector.md)
    - [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)
    - [BehaviourInspector](/AgentDocs/editor/inspectors/behaviour-inspector/behaviour-inspector.md)
    - [Toggle](/AgentDocs/app/components/toggle/toggle.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [AddBehaviourMenuComponent](/AgentDocs/editor/components/add-behaviour-menu/add-behaviour-menu.md)
    - [DefaultInspector](/AgentDocs/editor/inspectors/default-inspector/default-inspector.md)
    - [TextInputInspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md)
    - [ColorInspector](/AgentDocs/editor/inspectors/color-inspector/color-inspector.md)
    - [DropdownItem](/app/components/dropdown/dropdown.md)
- **External Packages**: `@angular/core`, `@angular/common`, `omega-game-engine`