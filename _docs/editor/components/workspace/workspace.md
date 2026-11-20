## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| WorkspaceComponent | [workspace](/editor/components/workspace/workspace.md) |

This component is responsible for rendering and managing the layout of the main editing environment, including side panels and a footer area. Its primary function is to provide a dynamic, resizable container structure that allows users to adjust the dimensions of the left panel, right panel, and footer area interactively.

Architecturally, `WorkspaceComponent` acts as a high-level UI container component. It manages the visual state of the layout via its internal width and height properties and communicates layout changes back to the core editing functionality by calling `editorService.requestCanvasResize()` upon user interaction completion.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `showLeft` | Input | Boolean flag determining if the left panel should be visible. |
| `showRight` | Input | Boolean flag determining if the right panel should be visible. |
| `showFooter` | Input | Boolean flag determining if the footer area should be visible. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component implements drag-and-drop resizing functionality using `@HostListener` hooks on the `document`. It tracks the initial mouse position and component dimensions upon `startResize`. During `onMouseMove`, it calculates the delta movement and updates `leftWidth`, `rightWidth`, or `footerHeight` based on which resize handle is active, ensuring minimum size constraints are met. Upon `onMouseUp`, it finalizes the resize operation and notifies the `EditorService`.

- **Side Effects:** Mutates global state by changing `document.body.style.cursor` during resizing. It also calls `editorService.requestCanvasResize()`, which implies interaction with external application state or rendering systems.

- **Error Handling:** The component uses `Math.max(50, ...)` to enforce a minimum size constraint (50 units) on all dimensions, preventing negative or excessively small panel sizes during resizing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [editor/services/editor.service](/editor/services/editor.service.md)