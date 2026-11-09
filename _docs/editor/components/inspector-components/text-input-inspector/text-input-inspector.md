## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TextInputInspector | editor/components/inspector-components/text-input-inspector/text-input-inspector.md |

This component provides a reusable, interactive input field designed to display and allow modification of textual or numerical data within an editor's inspector panel. It supports both standard text input via a change event and numerical manipulation via drag gestures, offering flexibility for various data types.

Architecturally, `TextInputInspector` functions as a presentation layer UI component. It consumes configuration and data via `@Input()` properties (such as `label`, `value`, `isNumber`, and `dragScale`) and communicates state changes back to its parent component via the `@Output()` `change` event. It relies on external directives like [mouse-drag.directive](/editor/directives/mouse-drag.directive.md) to enable drag functionality.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| TextInputInspector | Class | Component responsible for displaying and editing input values. |
| label | Input | The descriptive label displayed alongside the input field. |
| value | Input | The current string or number value held by the input. |
| isNumber | Input | Boolean flag determining if the input should be treated as a number. |
| dragScale | Input | Scaling factor applied during drag operations for numerical inputs. |
| numberDecimals | Input | The precision (number of decimal places) to use when formatting numerical output. |
| change | Output | Emits the new value (`string | number`) whenever the input is modified. |
| onChange | Method | Handles standard DOM change events, updating the internal value and emitting the change event. |
| onDrag | Method | Handles drag events, calculating a new numerical value based on delta and emitting the change event if `isNumber` is true. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component manages two primary input mechanisms: standard text input via `onChange`, which directly updates the bound value; and drag-based numerical input via `onDrag`. When dragging, the delta movement is scaled, added to the current value, and then rounded to the precision specified by `numberDecimals` before emitting the change.
- **Side Effects:** None. The component is purely reactive, managing internal state based on inputs and emitting events; it does not interact with the network or filesystem.
- **Error Handling:** The `onDrag` method uses `+this.value || 0` to safely coerce the current value to a number before performing arithmetic, providing a basic fallback against null or undefined initial values.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [mouse-drag.directive](/editor/directives/mouse-drag.directive.md)