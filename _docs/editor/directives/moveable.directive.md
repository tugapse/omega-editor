## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| MovableDirective | editor/directives/moveable.directive |

This directive provides comprehensive functionality to make a host HTML element both draggable and resizable within the viewport. It manages the complex state transitions required for these interactions, allowing users to manipulate the element's position via a designated handle or its dimensions via a resize handle.

This component functions as a low-level UI utility directive, attaching behavior directly to an element in the template. It relies on DOM manipulation and event listeners to manage its state, fitting into the application's presentation layer to enhance the interactivity of movable UI widgets.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `movableHandleId` | Input | The required ID of the child element used as the drag handle. |
| `resizeHandleId` | Input | The optional ID of the child element used as the resize handle. |
| `showResize` | Input | Boolean flag determining if the directive should automatically create a default resize handle. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The directive initializes by locating the specified drag and resize handles. It reads the element's initial CSS `transform` state to establish starting coordinates. Dragging is managed by listening to `mousedown` on the handle, followed by `mousemove` on the document, which uses `requestAnimationFrame` to calculate and apply new `translate` values while clamping movement within viewport boundaries. Resizing follows a similar pattern, calculating new width/height based on mouse movement relative to the start point.
- **Side Effects:** Mutates the global state by modifying the `style` and `cursor` properties of the host element and the `document.body`. It also uses `requestAnimationFrame` to schedule updates.
- **Error Handling:** It logs an error to the console if the required `movableHandleId` cannot be found during initialization.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** None