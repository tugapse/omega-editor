## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | WorkspaceComponent |
| Source file | workspace.ts |

The **WorkspaceComponent** serves as the primary layout orchestrator for the editor's main interface. It manages the spatial distribution of the workspace by controlling the dimensions of the left panel, right panel, and footer, providing a flexible environment for the user to customize their viewing area.

**Functional Mission**
The primary responsibility of **WorkspaceComponent** is to implement a dynamic, resizable layout system. It solves the problem of fixed-size UI panels by providing interactive "drag-to-resize" handles, allowing users to expand or contract sidebars and the bottom panel to suit their current workflow needs.

**System Context & Integration**
This component acts as a structural container that dictates the visual boundaries for other editor elements. It integrates closely with the [EditorService](/AgentDocs/editor/services/editor.service.md) to signal when layout changes have concluded, specifically triggering a canvas resize to ensure the rendering engine aligns with the new viewport dimensions. It functions as a high-level layout manager that sits above the individual functional modules of the editor.

- **INTERNAL REFERENCES**: [EditorService](/AgentDocs/editor/services/editor.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `leftWidth` (Default: `250`)  Initial width of the left panel in pixels.
- `rightWidth` (Default: `250`)  Initial width of the right panel in pixels.
- `footerHeight` (Default: `200`)  Initial height of the footer panel in pixels.
- `50` (Minimum threshold)  The minimum allowed dimension (width or height) for any resizable panel to prevent UI collapse.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `showLeft` | `@Input` | Boolean flag to toggle visibility of the left panel. |
| `showRight` | `@Input` | Boolean flag to toggle visibility of the right panel. |
| `showFooter` | `@Input` | Boolean flag to toggle visibility of the footer panel. |
| `startResize` | Method | Initializes the resizing state, captures initial mouse/dimension coordinates, and updates the global cursor. |
| `onMouseMove` | `@HostListener` | Calculates delta movement and updates panel dimensions based on the active `resizing` type. |
| `onMouseUp` | `@HostListener` | Terminates the resizing state, resets the cursor, and notifies the editor service to refresh the canvas. |

## 4. Execution Logic & Flow
- **Initialization**: Sets default dimensions for `leftWidth`, `rightWidth`, and `footerHeight`. Initializes `resizing` state to `null`.
- **Data Path**: 
    1. **Input**: User interaction via `MouseEvent` on a resize handle.
    2. **Processing**: `startResize` captures the baseline state $\rightarrow$ `onMouseMove` calculates `deltaX`/`deltaY` $\rightarrow$ Dimensions are updated via `Math.max` to enforce minimum bounds.
    3. **Output**: Updated dimension properties trigger Angular change detection, updating the template layout; `onMouseUp` triggers `editorService.requestCanvasResize()`.
- **Conditional Branching**:
    - `if (!this.resizing)`: Early exit in `onMouseMove` if no resize operation is active.
    - `if (this.resizing === 'left' | 'right' | 'footer')`: Logic branches to apply specific mathematical transformations (addition vs. subtraction) depending on which axis/panel is being manipulated.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
- **External Packages**: 
    - `@angular/core`
    - `@angular/common`