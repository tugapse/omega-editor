## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EnumInspector | editor/inspectors/enum-inspector/enum-inspector.md |

This component is responsible for providing a user interface element to select a specific value from a predefined set of enumerated options. It encapsulates the logic necessary to display a list of items, manage the currently selected item, and emit an event when a new selection is made by the user.

As a UI component, `EnumInspector` serves as a presentation layer element within the editor interface. It consumes configuration data, specifically the list of available options (`items`) and the currently selected value, which are passed in via `@Input`. It communicates user interaction back to parent components via the `@Output` event emitter.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EnumInspector | Class | Manages the display and selection logic for an enumerated list. |
| label | Input | The descriptive label displayed alongside the inspector. |
| items | Input | An array of `DropdownItem` objects representing the available choices. |
| selected | Input/Setter | Binds the component's internal selection state to an external numeric value. |
| change | Output | Emits the selected `DropdownItem` when the user makes a selection. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes its internal selection (`_selected`) based on the provided `selected` input setter. The setter finds the matching `DropdownItem` within the `items` array by comparing the input numeric value against the `value` property of each item. The component relies on the `DropdownComponent` to handle the actual UI interaction and emits the selected item upon change.

- **Side Effects:** None.

- **Error Handling:** The setter includes a fallback mechanism: if no item matches the provided `value`, it defaults the selection to the first item in the `items` array (`this.items[0]`).

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [DropdownComponent](/src/app/components/dropdown/dropdown.md)