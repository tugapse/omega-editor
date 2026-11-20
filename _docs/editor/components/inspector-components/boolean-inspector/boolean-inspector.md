## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| BooleanInspector | editor/components/inspector-components/boolean-inspector/boolean-inspector.md |

This component is responsible for providing a user interface element that allows users to toggle a boolean state. It encapsulates the logic and presentation necessary to display a boolean value and emit a change event when the user interacts with the control.

It functions as a dedicated UI component within the application's inspector panel, specifically designed to manage and expose boolean properties to the user interface layer. It relies on the `Toggle` component for its visual representation of the state change.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| BooleanInspector | Class | Manages the display and interaction for a boolean property. Accepts `active` (boolean) and `label` (string) inputs, and emits a `change` event upon state modification. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component binds its internal state representation to the `@Input() active` property. When the underlying `Toggle` component triggers a change, the `BooleanInspector` captures this event and emits the new boolean value via the `@Output() change` EventEmitter.

- **Side Effects:** None.

- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [Toggle](/src/app/components/toggle/toggle.md)