## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EntityInspector | editor/inspectors/entity-inspector/entity-inspector.md |

This component is responsible for providing a detailed, interactive inspection panel for a `SceneEntity` within the editor environment. Its primary function is to dynamically discover, display, and allow modification of all relevant properties of a target entity, including standard data fields, transform data, and entity-specific behaviours.

It serves as a core UI component within the editor's inspection system, inheriting from [ObjectInspector](/editor/inspectors/object-inspector/object-inspector.md). It integrates various specialized inspectors (like [TransformInspector](/editor/inspectors/transform-inspector/transform-inspector.md) and [BehaviourInspector](/editor/inspectors/behaviour-inspector/behaviour-inspector.md)) to handle different data types, ensuring a comprehensive editing experience for game entities.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `targetEntity` | Input | Binds the inspector to a specific `SceneEntity` instance, triggering property preparation. |
| `excludeProperties` | Input | An array of property keys that should be explicitly ignored during property enumeration. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by preparing the list of visible properties (`objectsToshow`) based on the provided `SceneEntity`. It uses `isPropertyValid` to filter out private or excluded properties. Property values are updated via `onValueChanged` or specialized handlers, which then trigger a canvas resize via `editorService.requestCanvasResize()`. Behaviour management involves dynamically loading available behaviours using `ObjectInstanciator.getMetadata` and adding them to the entity upon selection.

- **Side Effects:** Mutates the state of the target `SceneEntity` when properties are changed. It also interacts with `editorService` to request canvas resizing upon data modification.

- **Error Handling:** Explicitly throws an error in `onDefaultChange` if the method is called without implementation, indicating an incomplete override.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [InpectorTogglePanel](/editor/components/inpector-toggle-panel/inpector-toggle-panel.md), [TransformInspector](/editor/inspectors/transform-inspector/transform-inspector.md), [ObjectInspector](/editor/inspectors/object-inspector/object-inspector.md), [BehaviourInspector](/editor/inspectors/behaviour-inspector/behaviour-inspector.md), [Toggle](/src/app/components/toggle/toggle.md), [Icon](/src/app/components/icon/icon.md), [AddBehaviourMenuComponent](/editor/components/add-behaviour-menu/add-behaviour-menu.md), [DefaultInspector](/editor/inspectors/default-inspector/default-inspector.md), [TextInputInspector](/editor/components/inspector-components/text-input-inspector/text-input-inspector.md)