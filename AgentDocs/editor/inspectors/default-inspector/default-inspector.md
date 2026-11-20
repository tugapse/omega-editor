## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | DefaultInspector |
| Source file | default-inspector.ts |

The **DefaultInspector** component serves as a polymorphic property editor within the Omega Editor's inspection system. Its primary purpose is to act as a high-level orchestrator that dynamically renders appropriate UI controls based on the data type of a target property. By abstracting the complexity of individual inspector components, it provides a unified interface for modifying object properties in real-time.

**Functional Mission**
The mission of **DefaultInspector** is to bridge the gap between raw data structures (like `Vector3`, `Color`, or `NumberRange`) and user-interactive UI components. It solves the problem of manual property mapping by providing a centralized handler that receives property updates from specialized sub-components and propagates those changes back to the underlying data model and the wider application state.

**System Context & Integration**
This component sits within the inspector hierarchy, typically utilized by [Object Inspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md) to handle generic or fallback property types. It receives an `ITargetProperty` via input and emits changes through an `EventEmitter`. When a user interacts with a sub-componentsuch as [Boolean Inspector](/AgentDocs/editor/components/inspector-components/boolean-inspector/boolean-inspector.md), [Vector Inspector](/AgentDocs/editor/components/inspector-components/vector-inspector/vector-inspector.md), or [Color Inspector](/AgentDocs/editor/inspectors/color-inspector/color-inspector.md)the **DefaultInspector** captures the event, updates the local property value, and notifies the system of the mutation.

- **INTERNAL REFERENCES**: 
    - [Boolean Inspector](/AgentDocs/editor/components/inspector-components/boolean-inspector/boolean-inspector.md)
    - [TextInput Inspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md)
    - [Vector Inspector](/AgentDocs/editor/components/inspector-components/vector-inspector/vector-inspector.md)
    - [Color Inspector](/AgentDocs/editor/inspectors/color-inspector/color-inspector.md)
    - [Enum Inspector](/AgentDocs/editor/inspectors/enum-inspector/enum-inspector.md)
    - [Number Range Inspector](/AgentDocs/editor/components/inspector-components/number-range-inspector/number-range-inspector.md)
    - [Object Inspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `item` | `@Input() ITargetProperty` | The specific property object being inspected and edited. |
| `change` | `@Output() EventEmitter` | Emits the new value whenever a property is successfully modified. |
| `_onPropertyChanged` | `private method` | Internal sink that updates the `item.value` and triggers the `change` event. |
| `onValueChanged` | `public method` | Handler for standard scalar/range value changes (string, number, boolean, NumberRange). |
| `onVectorChanged` | `public method` | Handler for vector-based value changes (Vector2, Vector3, Vector4). |
| `onColorChanged` | `public method` | Handler for color-based value changes. |
| `onEnumChange` | `protected method` | Handler for dropdown/enum selection changes using `DropdownItem`. |
| `onRangeChange` | `protected method` | Handler specifically for `NumberRange` component updates. |

## 4. Execution Logic & Flow
- **Initialization**: The component receives an `ITargetProperty` via the `item` input. It prepares the template to render specific inspector sub-components based on the property's type.
- **Data Path**: 
    1. **User Interaction**: User modifies a value in a sub-component (e.g., `VectorInspector`).
    2. **Event Capture**: The sub-component calls a specific handler in `DefaultInspector` (e.g., `onVectorChanged`).
    3. **Processing**: The handler calls `_onPropertyChanged`, which performs a type check to ensure the value is not a raw DOM `Event`.
    4. **State Update**: `this.item.value` is updated with the new value.
    5. **Output**: The `change` event is emitted with the new value to notify parent components (like the `ObjectInspector`).
- **Conditional Branching**: 
    - `_onPropertyChanged` includes a guard clause `if (value instanceof Event) return;` to prevent accidental assignment of DOM events to data properties.

## 5. Resource Dependencies
- **Standard Libraries**: `@angular/core`
- **Internal Modules**: 
    - [Boolean Inspector](/AgentDocs/editor/components/inspector-components/boolean-inspector/boolean-inspector.md)
    - [TextInput Inspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md)
    - [Vector Inspector](/AgentDocs/editor/components/inspector-components/vector-inspector/vector-inspector.md)
    - [Color Inspector](/AgentDocs/editor/inspectors/color-inspector/color-inspector.md)
    - [Enum Inspector](/AgentDocs/editor/inspectors/enum-inspector/enum-inspector.md)
    - [Number Range Inspector](/AgentDocs/editor/components/inspector-components/number-range-inspector/number-range-inspector.md)
    - [Object Inspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)
- **External Packages**: `omega-game-engine` (provides `Color`, `NumberRange`, `Vector2`, `Vector3`, `Vector4`)