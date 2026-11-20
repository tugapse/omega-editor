## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| DefaultInspector | editor/inspectors/default-inspector/default-inspector.md |

This component serves as the central hub for displaying and managing the properties of a selected target object within the editor interface. Its primary responsibility is to dynamically render the appropriate inspector UI based on the data type of the property being inspected, allowing users to modify values such as strings, numbers, booleans, colors, and vectors.

Architecturally, `DefaultInspector` acts as a presentation layer component that consumes an `ITargetProperty` input. It delegates the actual rendering logic to specialized inspector components like [TextInputInspector](/editor/components/inspector-components/text-input-inspector/text-input-inspector.md) or [ColorInspector](/editor/components/inspector-components/color-inspector/color-inspector.md). It communicates changes back to the parent system via the `change` output event.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| DefaultInspector | Class | Manages the display and modification of a single `ITargetProperty`. |
| change | EventEmitter | Emits the final modified value of the property when a change occurs. |
| onValueChanged | Method | Handles value changes for string, number, boolean, or NumberRange types. |
| onVectorChanged | Method | Handles value changes for Vector2, Vector3, or Vector4 types. |
| onColorChanged | Method | Handles value changes for Color types. |
| onEnumChange | Method | Handles value changes for enumerated properties via a dropdown selection. |
| onRangeChange | Method | Handles value changes for properties managed by a NumberRange component. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component maintains an internal mechanism (`_onPropertyChanged`) to update the `ITargetProperty`'s value and emit the change event upon any successful modification. It routes incoming change events from specialized child components (e.g., `TextInputInspector`, `ColorInspector`) to the appropriate internal handler based on the data type.

- **Side Effects:** Mutates the state of the bound `ITargetProperty` object and emits events to notify parent components of data changes.

- **Error Handling:** Includes a check within `_onPropertyChanged` to ignore events that are instances of `Event`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [BooleanInspector](/editor/components/inspector-components/boolean-inspector/boolean-inspector.md), [TextInputInspector](/editor/components/inspector-components/text-input-inspector/text-input-inspector.md), [VectorInspector](/editor/components/inspector-components/vector-inspector/vector-inspector.md), [ColorInspector](/editor/components/inspector-components/color-inspector/color-inspector.md), [EnumInspector](/editor/components/inspector-components/enum-inspector/enum-inspector.md), [NumberRangeInspector](/editor/components/inspector-components/number-range-inspector/number-range-inspector.md), [ITargetObject](/editor/inspectors/object-inspector/object-inspector.md), [ITargetProperty](/editor/inspectors/object-inspector/object-inspector.md)