## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ObjectInspector | editor/inspectors/object-inspector/object-inspector.md |

This component is responsible for providing a dynamic, interactive panel that displays and allows modification of the properties of a selected target object within the editor environment. It abstracts the complexity of accessing object properties, filtering them based on user configuration (allow/deny lists), and rendering the appropriate UI control for each property type.

Architecturally, `ObjectInspector` functions as a presentation layer component within the editor UI. It consumes the target object via an `@Input()` and utilizes injected services like [SceneTreeService](/editor/services/scene-tree.service.md) and [EditorService](/editor/services/editor.service.md) to manage state changes and notify the rest of the application when properties are modified.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ITargetObject | Interface | Defines the structure for an object being inspected, including its key, type, and property container. |
| ITargetProperty | Interface | Extends `ITargetObject` to represent a specific property within the object, including its current `value`. |
| ObjectInspector | Class | The main component class that handles property loading, rendering, and value updates for a target object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component loads properties by iterating over the `property` object of the selected target. It determines the appropriate UI representation (e.g., `color`, `vector234`, `enum`) by inspecting the runtime type or a custom `className` property of the value. Property updates trigger an emission via the `change` output and subsequently call `loadProperties()` to refresh the view.
- **Side Effects:** Mutates the internal state of the `_selectedObject.property` when a value changes. It also interacts with the external state managed by [EditorService](/editor/services/editor.service.md) by calling `updateScene()` to notify subscribers of scene updates.
- **Error Handling:** The component handles null or undefined target objects gracefully by setting `_properties` to an empty array in `loadProperties()`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [InpectorTogglePanel](/editor/components/inpector-toggle-panel/inpector-toggle-panel.md), [EditorService](/editor/services/editor.service.md), [SceneTreeService](/editor/services/scene-tree.service.md), [DropdownItem](/src/app/components/dropdown/dropdown.md), [BooleanInspector](/editor/components/inspector-components/boolean-inspector/boolean-inspector.md), [TextInputInspector](/editor/components/inspector-components/text-input-inspector/text-input-inspector.md), [VectorInspector](/editor/components/inspector-components/vector-inspector/vector-inspector.md), [ColorInspector](/editor/inspectors/color-inspector/color-inspector.md), [EnumInspector](/editor/inspectors/enum-inspector/enum-inspector.md), [NumberRangeInspector](/editor/components/inspector-components/number-range-inspector/number-range-inspector.md)