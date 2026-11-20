## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| BehaviourInspector | editor/inspectors/behaviour-inspector/behaviour-inspector.md |

This component is responsible for providing a detailed, interactive inspection panel specifically for `EntityBehaviour` instances within the editor environment. It aggregates various property typessuch as enums, booleans, and standard propertiesinto a unified view, allowing developers to inspect and modify the state of a selected behaviour object.

Architecturally, `BehaviourInspector` extends `ObjectInspector` and serves as a specialized UI controller within the editor's inspection system. It utilizes several specialized inspectors, such as [ObjectInspector](/editor/inspectors/object-inspector/object-inspector.md), [EnumInspector](/editor/inspectors/enum-inspector/enum-inspector.md), and [ShaderInspector](/editor/inspectors/shader-inspector/shader-inspector.md), to render different data types correctly. It also relies on [ConfirmationService](/src/app/services/confirmation.service.md) for user interaction confirmation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| behaviour | Getter/Setter | Gets or sets the `EntityBehaviour` object being inspected. Triggers property loading upon setting. |
| onEnumChanged | Method | Handles changes made to an enum property within the inspector. |
| onDefaultChanged | Method | Handles changes made to standard properties (string, number, boolean, etc.) within the inspector. |
| onRemoveBehaviourRequested | Method | Initiates the confirmation process to remove the associated behaviour from its parent entity. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by defining mappings for various rendering enums (`drawingEnums`). When the `behaviour` input is set, `loadProperties` is called, which iterates over these defined enums and boolean flags to construct lists of `ITargetProperty` objects for rendering. It maintains separate lists for enum properties (`_renderProperties`) and boolean properties (`_renderEnable`). Property updates are handled via `onEnumChanged` and `onDefaultChanged`, which directly mutate the `behaviour` object's properties.
- **Side Effects:** Mutates the state of the `EntityBehaviour` object when properties are changed via `onDefaultChanged` or `onEnumChanged`. It also interacts with the external state management via `ConfirmationService` when `onRemoveBehaviourRequested` is called.
- **Error Handling:** The `onRemoveBehaviourRequested` method uses `ConfirmationService` to handle user confirmation before attempting to call `this.behaviour.parent.removeBehaviour(this.behaviour)`, providing a safeguard against accidental removal.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [ObjectInspector](/editor/inspectors/object-inspector/object-inspector.md), [InpectorTogglePanel](/editor/components/inpector-toggle-panel/inpector-toggle-panel.md), [TextInputInspector](/editor/components/inspector-components/text-input-inspector/text-input-inspector.md), [BooleanInspector](/editor/components/inspector-components/boolean-inspector/boolean-inspector.md), [EnumInspector](/editor/inspectors/enum-inspector/enum-inspector.md), [Icon](/src/app/components/icon/icon.md), [ShaderInspector](/editor/inspectors/shader-inspector/shader-inspector.md), [DefaultInspector](/editor/inspectors/default-inspector/default-inspector.md), [ConfirmationService](/src/app/services/confirmation.service.md)