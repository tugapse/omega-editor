## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| NumberRangeInspector | editor/components/inspector-components/number-range-inspector/number-range-inspector.md |

This component is responsible for providing a user interface element to visualize and manipulate a numerical range defined by a `NumberRange` object. It offers two primary interaction methods: a native HTML slider input for direct value entry and a custom drag-and-drop mechanism on a label element to allow for intuitive, proportional adjustment of the range value.

As a standalone Angular component, it functions as a specialized UI component within the editor's inspector panel. It manages the state synchronization between the internal UI elements (slider, drag handle) and the external `NumberRange` data model, emitting changes via the `rangeChange` output event to notify parent components or the core engine.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `label` | Input | A string used to label the inspector component. |
| `range` | Input | The `NumberRange` object whose value is being inspected and modified. |
| `rangeChange` | Output | Emits the updated `NumberRange` whenever the value is changed by the user. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component manages two distinct update paths. The `onSliderChange` and `onInputChange` methods handle updates from standard DOM events, calling `updateValue`. The `startLabelDrag` method initiates a global mouse listener setup to track movement (`handleLabelMove`). During dragging, the change in X position is translated into a proportional change in the range value based on a fixed pixel-to-range mapping (`pixelsForFullRange`). All updates are processed within `NgZone` to ensure Angular change detection is triggered correctly.
- **Side Effects:** The component mutates the external `NumberRange` object passed via `@Input() range` when a change is detected. It also interacts with the global `document.body` style and classes during label dragging to control the cursor and prevent text selection.
- **Error Handling:** The `clampAndRound` method ensures that any calculated value remains within the defined `min` and `max` bounds of the `NumberRange` and adheres to the specified `step` value, preventing invalid state propagation.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** [omega-game-engine](/omega-game-engine.md)