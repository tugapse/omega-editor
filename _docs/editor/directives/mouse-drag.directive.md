## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| DragHandleDirective | editor/directives/mouse-drag.directive |

This directive provides robust, low-level drag-and-drop functionality to any HTML element designated as a "handle." Its primary responsibility is to capture mouse events (`mousedown`, `mousemove`, `mouseup`) on the host element and translate physical mouse movement into structured `DragEventData`. It allows fine-grained control over the dragging behavior via inputs like `dragMode` (horizontal, vertical, or both) and `movementThreshold`.

Architecturally, this directive functions as a specialized UI behavior modifier. It is designed to be applied to a specific handle element, which then emits events that are consumed by a parent component responsible for managing the state and position of a larger, draggable element. It acts as a bridge between raw DOM events and application-level movement logic, fitting within the UI component layer.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| DragMode | Type | Defines the allowed axis for dragging: 'horizontal', 'vertical', or 'both'. |
| DragEventData | Interface | Contains the movement data emitted during a drag operation: `deltaX`, `deltaY`, `distanceX`, and `distanceY`. |
| DragHandleDirective | Class | Implements the drag functionality, listening for mouse events and emitting the `drag` event. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The directive initializes the drag state upon `mousedown`, capturing starting coordinates. It then attaches global listeners to the `document` for `mousemove` and `mouseup`. During `mousemove`, it calculates the change in position, applies restrictions based on `dragMode`, and only emits the `drag` event if the movement exceeds `movementThreshold`. Upon `mouseup`, it cleans up all listeners and resets the state.

- **Side Effects:** Mutates global state by modifying the `document.body` style (setting `cursor` and adding/removing the `no-select` class) during the drag operation. It also manages global event listeners attached to the `document`.

- **Error Handling:** The directive relies on the `OnDestroy` lifecycle hook to ensure that `onMouseUp()` is called, which safely detaches all global event listeners, preventing memory leaks.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** None