## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| FileExplorerComponent | [file-explorer](/editor/components/file-explorer/file-explorer.component.md) |

This component is responsible for rendering and managing the hierarchical view of the file system within the editor interface. It provides users with the ability to navigate directories, select files, and interact with nodes via context menus. Its primary responsibility is to translate file system state changes into a navigable UI representation.

Architecturally, this component acts as a primary UI controller for file browsing. It consumes the current directory state from the [file-system.service](/editor/components/file-explorer/file-system.service.md) and emits events when a file is selected, allowing parent components to request the actual content. It utilizes the [context-menu.component](/editor/components/context-menu/context-menu.component.md) for user actions.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| fileContentRequested | EventEmitter | Emits an Observable<string> when a file node is clicked, signaling that its content should be loaded. |
| activeFile | FileNode \| null | Holds the currently selected file node within the explorer. |
| contextMenuState | signal<ContextMenuState> | Manages the visibility, position, and available actions for the context menu. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component subscribes to the `currentDirectory$` observable from `fileSystemService` to maintain the directory listing. User interactions (click/double-click) trigger state changes: file clicks set `activeFile` and emit content requests, while directory double-clicks trigger navigation via `fileSystemService.navigateToDirectory`. Context menu handling updates the `contextMenuState` signal based on mouse events.

- **Side Effects:** Reads from the filesystem via `fileSystemService.currentDirectory$` and `fileSystemService.getFileContent()`. It also mutates the internal state via `contextMenuState.update()`.

- **Error Handling:** No explicit error handling (try/catch blocks) is present in the provided code; reliance is placed on the underlying services to manage observable errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** rxjs
- **Internal:** [file-system.service](/editor/components/file-explorer/file-system.service.md), [file-explorer.model](/editor/components/file-explorer/file-explorer.model.md), [context-menu.component](/editor/components/context-menu/context-menu.component.md)