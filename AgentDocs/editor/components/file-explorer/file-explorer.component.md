## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | FileExplorerComponent |
| Source file | file-explorer.component.ts |

The **FileExplorerComponent** serves as the primary interface for navigating and interacting with the project's file system hierarchy. It provides a visual representation of directories and files, allowing users to traverse the file tree, select files for editing, and trigger context-specific actions via a custom context menu.

**Functional Mission**
The core mission of the **FileExplorerComponent** is to manage the visual state of the file system tree and act as a bridge between the user's navigational intent and the underlying file system logic. It solves the problem of hierarchical data visualization and provides a centralized entry point for file-related operations like opening, navigating, and context-menu-driven modifications.

**System Context & Integration**
This component integrates deeply with the `FileSystemService` to retrieve and observe the current directory structure. When a file is selected, it emits an observable via the `fileContentRequested` output, facilitating the hand-off of file data to downstream editor components. It also manages the visibility and positioning of the `ContextMenuComponent`, ensuring that user interactions with specific nodes are translated into actionable commands within the system.

- **INTERNAL REFERENCES**: 
    - [FileSystemService](/AgentDocs/editor/components/file-explorer/file-system.service.md)
    - [ContextMenuComponent](/AgentDocs/editor/components/context-menu/context-menu.component.md)
    - [FileNode](/AgentDocs/editor/components/file-explorer/file-explorer.model.md)
    - [ContextMenuAction](/AgentDocs/editor/components/file-explorer/file-explorer.model.md)
    - [ContextMenuState](/AgentDocs/editor/components/context-menu/context-menu.component.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `contextMenuState.actions` (Default: `[{ id: 'new-file', ... }, { id: 'new-folder', ... }, { id: 'rename', ... }, { id: 'delete', ... }]`)  Defines the static set of available operations in the file explorer's context menu.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `fileContentRequested` | `EventEmitter<Observable<string>>` | Emits an observable containing the content of a file when a file node is clicked. |
| `directoryListing$` | `Observable<FileNode[]>` | An observable stream representing the current list of files and folders in the active directory. |
| `activeFile` | `FileNode \| null` | Tracks the currently selected file node. |
| `contextMenuState` | `signal<ContextMenuState>` | A reactive signal managing the visibility, position, and target node of the context menu. |
| `onNodeClick` | `Function` | Handles single-click events on nodes; triggers file content requests if the node is a file. |
| `onNodeDoubleClick` | `Function` | Handles double-click events; triggers directory navigation if the node is a directory. |
| `onContextMenu` | `Function` | Intercepts right-click events to position and display the context menu at the cursor location. |
| `handleContextMenuAction` | `Function` | Processes selected actions from the context menu (currently a placeholder for future logic). |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The component subscribes to `fileSystemService.currentDirectory$` and assigns it to `directoryListing$`.
    - The `contextMenuState` signal is initialized with default visibility (false) and a predefined set of actions.
- **Data Path**: 
    - **Navigation**: User double-clicks a directory $\rightarrow$ `onNodeDoubleClick` $\rightarrow$ `fileSystemService.navigateToDirectory(path)` $\rightarrow$ `currentDirectory$` emits new list $\rightarrow$ `directoryListing$` updates UI.
    - **File Selection**: User clicks a file $\rightarrow$ `onNodeClick` $\rightarrow$ `fileSystemService.getFileContent(path)` $\rightarrow$ `fileContentRequested.emit(content$)` $\rightarrow$ Downstream editor receives content.
- **Conditional Branching**:
    - **Node Type Check (Click)**: If `node.type === 'file'`, set `activeFile` and emit content; otherwise, do nothing.
    - **Node Type Check (Double Click)**: If `node.type === 'directory'`, clear `activeFile` and navigate; otherwise, do nothing.
    - **Context Menu Trigger**: On `onContextMenu`, `event.preventDefault()` is called to suppress the browser's default menu, followed by a signal update to show the custom menu at `clientX/Y`.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs` (Observable, take), `@angular/core` (Component, ChangeDetectionStrategy, Output, EventEmitter, signal), `@angular/common` (CommonModule).
- **Internal Modules**: 
    - [FileSystemService](/AgentDocs/editor/components/file-explorer/file-system.service.md)
    - [FileNode](/AgentDocs/editor/components/file-explorer/file-explorer.model.md)
    - [ContextMenuAction](/AgentDocs/editor/components/file-explorer/file-explorer.model.md)
    - [ContextMenuComponent](/AgentDocs/editor/components/context-menu/context-menu.component.md)
    - [ContextMenuState](/AgentDocs/editor/components/context-menu/context-menu.component.md)
- **External Packages**: None identified.