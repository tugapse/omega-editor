## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | DragHandleDirective |
| Source file | mouse-drag.directive.ts |

The **DragHandleDirective** is a specialized Angular directive designed to transform any HTML element into a functional drag handle. It abstracts the complexities of mouse event tracking, coordinate calculation, and axis restriction, providing a clean interface for parent components to respond to movement.

**Functional Mission**
The primary responsibility of the **DragHandleDirective** is to capture user intent via mouse interactions and translate raw `MouseEvent` data into structured `DragEventData`. It solves the problem of implementing consistent, multi-axis dragging logic by managing global event listeners and enforcing movement thresholds, ensuring that drag operations are smooth and do not trigger accidental text selection or unintended axis movement.

**System Context & Integration**
This directive acts as an input mechanism for higher-level UI components. It is intended to be applied to "handle" elements (such as title bars or grab icons) within the editor. When a drag occurs, it emits data that downstream modulessuch as those managing window positioning or object transformationconsume to update the application state. It integrates with the DOM by temporarily modifying the `document.body` cursor and CSS classes to provide visual feedback and prevent interference with the user interface during active dragging.

- **INTERNAL REFERENCES**: While this directive is a standalone utility, its output is typically consumed by components that manage spatial state, potentially interacting with logic described in [Drag Mode](/AgentDocs/editor/directives/mouse-drag.directive.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `dragCursor` (via `@Input`)  Specifies the CSS cursor style applied to `document.body` during the drag operation.
- `dragMode` (via `@Input`)  Determines if movement is restricted to `horizontal`, `vertical`, or `both` axes.
- `movementThreshold` (via `@Input`)  The minimum pixel delta required to trigger a `drag` event emission.

**Hardcoded Constants:**
- `scale` (Default: `0.8`)  An unused input property currently present in the class definition.
- `dragCursor` (Default: `'grabbing'`)  The default CSS cursor value used during active dragging.
- `dragMode` (Default: `'horizontal'`)  The default axis restriction.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `DragMode` | Type | Defines allowed movement axes: `'horizontal'`, `'vertical'`, or `'both'`. |
| `DragEventData` | Interface | Defines the structure of emitted data: `deltaX`, `deltaY`, `distanceX`, `distanceY`. |
| `DragHandleDirective` | Class | The core directive implementing the drag logic and event orchestration. |
| `drag` | `@Output` | Emits `DragEventData` when movement exceeds the `movementThreshold`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The directive initializes with default values for `movementThreshold` (0), `dragMode` ('horizontal'), and `dragCursor` ('grabbing').
    - It prepares internal state variables for tracking `isDragging`, starting coordinates (`startX`, `startY`), and references to cleanup functions.
- **Data Path**: 
    - **Input**: `mousedown` event on the host element.
    - **Processing**: 
        1. Captures initial mouse coordinates.
        2. Attaches global `mousemove` and `mouseup` listeners to the `document`.
        3. On `mousemove`, calculates `deltaX`/`deltaY` (via `event.movementX/Y`) and total `distanceX`/`distanceY` (relative to `startX/Y`).
        4. Filters movement based on `dragMode` (zeroing out the restricted axis).
        5. Validates movement against `movementThreshold`.
    - **Output**: Emits a `DragEventData` object via the `drag` EventEmitter.
- **Conditional Branching**:
    - **Axis Restriction**: If `dragMode` is `'horizontal'`, `deltaY` is forced to `0`. If `'vertical'`, `deltaX` is forced to `0`.
    - **Threshold Check**: The `drag` event is only emitted if `Math.abs(deltaX) > movementThreshold` OR `Math.abs(deltaY) > movementThreshold`.
    - **Cleanup**: On `mouseup` or `ngOnDestroy`, the directive reverts the `document.body` cursor, removes the `no-select` class, and invokes unlisten functions to prevent memory leaks.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: None identified.
- **External Packages**: 
    - `@angular/core` (Directive, ElementRef, HostListener, Output, EventEmitter, Renderer2, OnDestroy, Input, RendererStyleFlags2)