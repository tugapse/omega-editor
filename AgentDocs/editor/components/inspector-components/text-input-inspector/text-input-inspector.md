## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | TextInputInspector |
| Source file | text-input-inspector.ts |

The **TextInputInspector** is a specialized UI component designed to facilitate the editing of string or numeric properties within the editor's inspection interface. It provides a unified interface for both direct text entry via standard input fields and granular numeric manipulation through mouse-drag interactions.

**Functional Mission**
The primary responsibility of **TextInputInspector** is to provide a controlled input mechanism that bridges user intent with the underlying data model. It solves the problem of precise value adjustment by allowing users to either type exact values or "scrub" numeric values using drag gestures, ensuring that data integrity (such as decimal precision) is maintained during the transition from the UI to the application state.

**System Context & Integration**
This component acts as a leaf node within the inspector hierarchy, typically utilized by higher-level inspectors such as the [Entity Inspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md) or [Material Inspector](/AgentDocs/editor/inspectors/material-inspector/material-inspector.md). It receives data via `@Input` properties and communicates state changes back to the parent via the `@Output` `change` event. When configured for numeric input, it integrates with the [DragHandleDirective](/AgentDocs/editor/directives/mouse-drag.directive.md) to enable high-density interaction patterns common in professional creative tools.

- **INTERNAL REFERENCES**: [DragHandleDirective](/AgentDocs/editor/directives/mouse-drag.directive.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `dragScale` (Default: `1.0`)  Multiplier applied to the horizontal drag delta to control the sensitivity of numeric adjustments.
- `numberDecimals` (Default: `6`)  The fixed precision used when rounding numeric values during drag operations.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `label` | `@Input` | The descriptive text displayed alongside the input field. |
| `value` | `@Input` | The current state of the input (string or number). |
| `isNumber` | `@Input` | Boolean flag determining if the input should be treated as a numeric type. |
| `dragScale` | `@Input` | Sensitivity coefficient for mouse-drag value increments. |
| `numberDecimals` | `@Input` | Precision limit for numeric rounding. |
| `change` | `@Output` | Emits the updated `string | number` value to the parent component. |
| `onChange` | Method | Handles standard DOM input events, performing type conversion if `isNumber` is true. |
| `onDrag` | Method | Handles drag-based increments for numeric values using `DragEventData`. |

## 4. Execution Logic & Flow
- **Initialization**: The component receives configuration via inputs (`label`, `isNumber`, etc.) and the current `value`. It prepares to listen for both standard input events and drag events via the `DragHandleDirective`.
- **Data Path (Text Entry)**:
    1. User types into the input field.
    2. `onChange($event)` is triggered.
    3. The raw value is extracted from the target.
    4. If `isNumber` is true, the value is cast via `Number()`.
    5. The local `this.value` is updated.
    6. `this.change.emit(this.value)` broadcasts the update.
- **Data Path (Numeric Drag)**:
    1. User performs a drag gesture on the drag handle.
    2. `onDrag($event)` is triggered with `DragEventData`.
    3. **Conditional Branching**: If `isNumber` is true:
        a. Calculate `newValue` = `(deltaX * dragScale) + current_value`.
        b. Apply `toFixed(numberDecimals)` to ensure precision.
        c. Cast back to `number`.
        d. Update `this.value` and emit via `this.change`.
    4. If `isNumber` is false, the drag logic is bypassed.

## 5. Resource Dependencies
- **Standard Libraries**: (None identified)
- **Internal Modules**: 
    - [DragHandleDirective](/AgentDocs/editor/directives/mouse-drag.directive.md)
- **External Packages**: 
    - `@angular/core`