## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EditorStateService | [editor/services/editor-state.service](/editor/services/editor-state.service.md) |

This service is responsible for maintaining the global, reactive state of the editor application. It centralizes critical data points such as the currently active project, the user's selected asset, the list of files currently open in the editor, and the overall dirty status of the workspace. Its primary responsibility is to provide a single source of truth for the editor's operational context.

Architecturally, `EditorStateService` functions as a core state management service within the application layer. It utilizes Angular's `signal` primitive to expose state variables that can be observed by various UI components. It interacts with interfaces like [project.interface](/interfaces/project.interface.md) and [asset.interface](/interfaces/asset.interface.md) to ensure type safety across the application.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `activeProject` | Signal<IProject \| null> | The currently loaded project instance. |
| `selectedAsset` | Signal<IAsset \| null> | The asset currently selected by the user in the editor view. |
| `openedFiles` | Signal<IAsset[]> | An array containing all assets currently open in the editor tabs. |
| `isDirty` | Signal<boolean> | A boolean flag indicating if any unsaved changes exist in the current state. |
| `centralView` | Signal<'canvas' \| 'assets' \| 'code'> | Determines which primary view is currently displayed in the main editor panel. |
| `setCentralView(view: 'canvas' \| 'assets' \| 'code')` | Method | Updates the primary view mode of the editor. |
| `setActiveProject(project: IProject \| null)` | Method | Sets or clears the currently active project context. |
| `setSelectedAsset(asset: IAsset \| null)` | Method | Sets the currently selected asset, triggering potential side effects like updating the central view. |
| `setOpenedFiles(files: IAsset[])` | Method | Replaces the entire list of currently opened files. |
| `addOpenedFile(file: IAsset)` | Method | Adds a new asset to the list of opened files, provided it is not a folder. |
| `removeOpenedFile(file: IAsset)` | Method | Removes a specified asset from the opened files list and updates the selection if necessary. |
| `setDirty(isDirty: boolean)` | Method | Updates the global dirty state flag. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service manages state transitions through setter methods. For instance, `setSelectedAsset` conditionally updates the central view based on the asset type, and `removeOpenedFile` ensures that if the removed file was the selected one, the selection is gracefully reset to the next available file.
- **Side Effects:** Mutates internal state signals, which triggers reactive updates across the application.
- **Error Handling:** No explicit exception handling is implemented; state updates rely on the integrity of the input types (`IProject`, `IAsset`).

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** Angular core libraries (`@angular/core`).
- **Internal:** [project.interface](/interfaces/project.interface.md), [asset.interface](/interfaces/asset.interface.md).