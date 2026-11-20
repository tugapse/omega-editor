## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EnumInspector |
| Source file | enum-inspector.ts |

The **EnumInspector** is a specialized UI component designed to facilitate the selection of discrete values from a predefined set of options within the editor's inspection interface. It acts as a bridge between the raw data models of the engine and the user interface, providing a controlled way to modify properties that are constrained to specific enumeration values.

**Functional Mission**
The primary responsibility of **EnumInspector** is to render a selection interface (via a dropdown) that allows users to pick a single item from a list of `DropdownItem` objects. It solves the problem of providing a type-safe, user-friendly way to edit enumeration-based properties in the inspector panel, ensuring that only valid, predefined options are selectable.

**System Context & Integration**
This component functions as a leaf node within the broader inspector architecture. It is typically instantiated by higher-level inspectors, such as the [Entity Inspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md) or [Material Inspector](/AgentDocs/editor/inspectors/material-inspector/material-inspector.md), to handle specific property types. It consumes data through `@Input` decorators and communicates user selections back to the parent component or service via the `change` `@Output` event, facilitating state updates in the underlying engine or editor state.

- **INTERNAL REFERENCES**: [DropdownComponent](/AgentDocs/app/components/dropdown/dropdown.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `label` | `@Input` | The descriptive text displayed to the user to identify the property being edited. |
| `items` | `@Input` | An array of `DropdownItem` objects representing the available enumeration options. |
| `selected` | `@Input` (Setter) | Receives a numeric value, finds the corresponding `DropdownItem` in the `items` array, and updates the internal `_selected` state. |
| `change` | `@Output` | Emits the newly selected `DropdownItem` when the user makes a selection. |
| `_selected` | Property | Internal state holding the currently active `DropdownItem`. |

## 4. Execution Logic & Flow
- **Initialization**: The component initializes with an empty `items` array and an undefined `_selected` property. It relies on the `DropdownComponent` for the actual rendering of the selection UI.
- **Data Path**: 
    1. **Input**: A numeric value is passed to the `selected` setter.
    2. **Processing**: The setter executes a `.find()` operation on the `items` array, attempting to match the input value (coerced to a number via `+e.value`) with an item's value.
    3. **Fallback**: If no match is found, the component defaults to the first item in the `items` array (`this.items[0]`).
    4. **Output**: When a user interacts with the dropdown, the `change` event is triggered, emitting the selected `DropdownItem` object to the parent.
- **Conditional Branching**: 
    - The `selected` setter contains a logical OR (`||`) branch: if the `.find()` operation returns `undefined`, the logic pivots to select the first available item in the list to prevent null pointer errors in the UI.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [DropdownComponent](/AgentDocs/app/components/dropdown/dropdown.md)
- **External Packages**: 
    - `@angular/core` (Component, EventEmitter, Input, Output)