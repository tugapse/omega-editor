## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EditorVectorGizmoComponent | editor/components/inspector-components/vector-inspector/component/vector-gizmo |

This component provides a visual, interactive gizmo rendered on an HTML Canvas element, allowing users to manipulate the X, Y, and Z coordinates of a vector property. It implements two distinct interaction modes'trackball' for X/Y manipulation and 'roll' for Z rotationbased on where the mouse clicks within the gizmo's circular area.

Architecturally, this component functions as a specialized UI control within the editor's inspector panel. It acts as a presentation layer, capturing raw mouse events and translating them into structured data changes via the `valueChange` EventEmitter, which is consumed by higher-level logic components responsible for updating the underlying data model.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EditorVectorGizmoComponent | Class | Manages the rendering and interaction logic for the vector gizmo. Exposes inputs for initial state (`x`, `y`, `z`) and an output event (`valueChange`) for reporting changes. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes a 2D rendering context upon view initialization. It uses mouse event listeners (`onMouseDown`, `onMouseMove`, `onMouseUp`) to determine the interaction mode ('trackball' or 'roll'). In 'trackball' mode, mouse movement translates directly to changes in X and Y values. In 'roll' mode, the change in mouse angle relative to the initial click position is calculated and mapped to a change in the Z value. The `drawGizmo` method handles the visual rendering of the concentric circles and the Z-axis indicator line.

- **Side Effects:** Mutates the internal state (`isDragging`, `dragMode`, `lastMouse`) based on user input. It emits events (`valueChange`) which propagate state changes outside the component boundary.

- **Error Handling:** Relies on the nullish coalescing operator (`!`) when accessing the canvas context, assuming the context will always be available after `ngAfterViewInit`. No explicit try/catch blocks are present for runtime errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** None