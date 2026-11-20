## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | MovableDirective |
| Source file | moveable.directive.ts |

The **MovableDirective** is a specialized Angular directive designed to augment HTML elements with interactive spatial capabilities. It provides a robust mechanism for users to manipulate the position and dimensions of elements within the viewport through direct mouse interaction, effectively turning static UI components into draggable and resizable windows or containers.

**Functional Mission**
The primary responsibility of the **MovableDirective** is to manage complex DOM manipulation logic related to translation (dragging) and scaling (resizing). It solves the problem of implementing smooth, performant, and boundary-aware spatial controls by abstracting mouse event listeners, coordinate calculations, and `requestAnimationFrame` orchestration away from the host component.

**System Context & Integration**
This directive acts as a low-level utility for UI components that require spatial freedom, such as floating panels or editor windows. It integrates with the DOM by listening to global `document` events to ensure continuity of movement even when the cursor leaves the host element's bounds. While it operates independently of specific business logic, it is architecturally compatible with components like [Window](/AgentDocs/editor/components/window/window.md) or any element requiring manual layout adjustments within the [Workspace](/AgentDocs/editor/components/workspace/workspace.md).

- **INTERNAL REFERENCES**: [MovableDirective](/AgentDocs/editor/directives/moveable.directive.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `window.innerWidth` / `window.innerHeight`  Used to calculate viewport boundaries for movement clamping.
- `window.getComputedStyle`  Used during initialization to parse existing CSS transform matrices.

**Hardcoded Constants:**
- `minWidth` (Default: `150`)  Minimum allowable width during resizing.
- `minHeight` (Default: `100`)  Minimum allowable height during resizing.
- `defaultResizeId` (Default: `movable-resize-handle-[UUID]`)  Fallback ID for auto-generated resize handles.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `movableHandleId` | `@Input` (Required) | Specifies the ID of the child element that triggers the dragging action. |
| `resizeHandleId` | `@Input` (Optional) | Specifies the ID of the child element that triggers the resizing action. |
| `showResize` | `@Input` | Boolean flag to enable or disable the automatic creation of a default resize handle. |
| `onMouseDown` | `@HostListener` | Detects initial click to differentiate between a drag intent and a resize intent. |
| `onMouseMove` | `@HostListener` | Orchestrates the high-frequency updates of position/size via `requestAnimationFrame`. |
| `onMouseUp` | `@HostListener` | Terminates the active interaction state and cleans up UI styles. |
| `onHoverMouseMove` | `@HostListener` | Dynamically updates the host cursor style based on the hovered interactive zone. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Locates the `dragHandleElement` via `movableHandleId`.
    2. Attempts to locate the `resizeHandleElement` via `resizeHandleId`.
    3. If no resize handle is found and `showResize` is true, it programmatically creates a `div` with Font Awesome icons and appends it to the host.
    4. Parses the host element's current `transform` property (handling `matrix`, `matrix3d`, or `translate` strings) to synchronize the internal `translateX` and `translateY` signals with the existing DOM state.
- **Data Path**: 
    - **Input**: Mouse coordinates (`clientX`, `clientY`) and initial element dimensions/offsets.
    - **Processing**: 
        - *Dragging*: Calculates `newTranslate = currentMouse - startDragOffset`. Clamps values between `0` and `viewport - elementSize`.
        - *Resizing*: Calculates `newSize = startSize + (currentMouse - startClient)`. Clamps values against `minWidth`/`minHeight`.
    - **Output**: Direct application of `transform: translate(...)` or `width`/`height` styles to the host element via `Renderer2`.
- **Conditional Branching**:
    - **Interaction Type**: In `onMouseDown`, the logic branches based on whether `event.target` is contained within the `resizeHandleElement` (triggers resize) or the `dragHandleElement` (triggers drag).
    - **Animation Throttling**: In `onMouseMove`, the logic checks `animationFrameId`; if an animation frame is already queued, it exits to prevent redundant calculations and frame skipping.

## 5. Resource Dependencies
- **Standard Libraries**: `crypto` (for UUID generation).
- **Internal Modules**: None.
- **External Packages**: `@angular/core` (Directive, ElementRef, HostListener, Renderer2, Input, OnInit, OnDestroy, signal).