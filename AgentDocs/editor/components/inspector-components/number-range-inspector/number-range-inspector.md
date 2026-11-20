## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | NumberRangeInspector |
| Source file | number-range-inspector.ts |

The **NumberRangeInspector** is a specialized UI component designed to provide a highly interactive interface for manipulating numerical ranges within the editor's inspection system. It bridges the gap between raw data models and user-friendly controls by offering three distinct methods of interaction: a standard HTML range slider, direct numerical input fields, and a unique "virtual slide" feature where the component's label can be dragged to adjust the value.

This component serves as a granular leaf node within the broader inspector architecture. It is typically consumed by higher-level inspector modules, such as the [Entity Inspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md) or [Material Inspector](/AgentDocs/editor/inspectors/material-inspector/material-inspector.md), to allow users to fine-tune properties like bounds, scales, or thresholds. By emitting `rangeChange` events, it ensures that state changes are propagated back to the underlying engine data models, maintaining synchronization between the UI and the game state.

**Functional Mission**
The primary responsibility of **NumberRangeInspector** is to facilitate precise and intuitive manipulation of a `NumberRange` object. It solves the problem of complex range adjustment by providing multi-modal input (slider, text, and drag) while enforcing data integrity through step-based rounding and boundary clamping.

**System Context & Integration**
The component operates within the Angular change detection cycle, utilizing `NgZone` to ensure that high-frequency mouse movements during label dragging are correctly processed. It acts as a data transformer: receiving a `NumberRange` via `@Input`, processing user interactions through internal logic, and outputting the updated range via `@Output`. It is a critical component in the [Inspector Window](/AgentDocs/editor/inspectors/inpector-window/inpector.md) ecosystem.

- **INTERNAL REFERENCES**: [NumberRange](/omega-game-engine) (External Engine Type)

## 2. Environment & Configuration
**Environment Lookups:**
- `NgZone` (via `constructor`)  Used to run high-frequency drag updates within the Angular zone to ensure UI synchronization.
- `ChangeDetectorRef` (via `constructor`)  Used to manually trigger change detection when values are updated via non-standard DOM interactions.

**Hardcoded Constants:**
- `pixelsForFullRange` (Default: `200`)  Defines the pixel width used to calculate the ratio for the "virtual slide" label dragging logic.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `label` | `@Input` | The descriptive text displayed alongside the range controls. |
| `range` | `@Input` | The `NumberRange` object containing `min`, `max`, and `value`. |
| `rangeChange` | `@Output` | Emits the updated `NumberRange` object whenever a value change is finalized. |
| `startLabelDrag` | Method | Initiates the "virtual slide" interaction by attaching global mouse listeners. |
| `onSliderChange` | Method | Handles input events from the native HTML range slider. |
| `onInputChange` | Method | Handles input events from the direct numerical text fields. |
| `updateValue` | Method | The central sink for all value updates; performs validation, clamping, and emission. |
| `clampAndRound` | Method | Enforces the `step` increment and keeps the value within `min`/`max` bounds. |

## 4. Execution Logic & Flow
- **Initialization**: The component receives a `NumberRange` object. It prepares to listen for DOM events via `Renderer2` and maintains internal state for drag tracking (`isDraggingLabel`, `lastX`).
- **Data Path**: 
    1. **Input**: User interacts via Slider, Text Input, or Label Drag.
    2. **Processing**: 
        - *Slider/Text*: `parseFloat` is applied to the raw string.
        - *Label Drag*: `deltaX` is calculated relative to `pixelsForFullRange`, converted to a value offset, and added to the current value.
        - *Refinement*: The resulting value passes through `clampAndRound` to respect `step` and bounds.
    3. **Output**: If the value is valid and changed, `range.value` is updated, the native slider element is synced, and `rangeChange` is emitted.
- **Conditional Branching**:
    - **Drag Check**: `handleLabelMove` exits early if `isDraggingLabel` is false or `range` is undefined.
    - **Change Check**: `updateValue` only proceeds if the new value is a valid number and differs from the current `range.value`.
    - **Step Logic**: `clampAndRound` checks if `range.step > 0` before applying rounding logic.

## 5. Resource Dependencies
- **Standard Libraries**: `Renderer2`, `NgZone`, `ChangeDetectorRef`, `ElementRef`, `EventEmitter` (Angular Core).
- **Internal Modules**: 
    - No direct internal component imports found; relies on `NumberRange` from `omega-game-engine`.
- **External Packages**: `@angular/core`