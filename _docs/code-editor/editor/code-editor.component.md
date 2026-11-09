## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CodeWorkspaceComponent | [code-editor/editor/code-editor.component](/code-editor/editor/code-editor.component.md) |

This component is the primary view responsible for managing the entire code editing environment, including the display of files, the active editor instance, and the overall workspace state. Its core responsibility is to orchestrate the loading, display, and persistence of project files, handling user interactions such as opening, closing, and modifying tabs within the editor interface.

Architecturally, `CodeWorkspaceComponent` acts as a high-level controller for the editor view. It integrates services like [AssetCodeService](/asset-code/asset-code.service.md) to fetch file content and workspace structure, [MonacoService](/monaco/monaco.service.md) to manage the editor instances, and [EditorStateService](/editor/services/editor-state.service.md) to react to global project changes. It manages the UI state for tabs, saving, and compilation status.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EditorTab | Interface | Defines the structure for a single tab, including file metadata, dirty status, and the associated Monaco model. |
| ToastMessage | Interface | Defines the structure for transient notification messages displayed to the user. |
| CodeWorkspaceComponent | Class | Manages the lifecycle and state of the code editing workspace. |
| onGlobalContextMenu | Method | Handles the global context menu event, preventing default browser behavior. |
| closeContextMenu | Method | Hides the context menu when the user clicks anywhere on the document. |
| unloadNotification | Method | Intercepts the browser's beforeunload event to prompt the user about unsaved changes. |
| loadIntelliSenseDefinitions | Method | Fetches and applies type definitions for both the engine and user project scopes to the Monaco editor. |
| loadWorkspaceTree | Method | Fetches the directory structure of the current project and populates the workspace tree. |
| handleNodeClick | Method | Handles clicks on nodes in the workspace tree, either selecting an existing tab or loading a new file. |
| createNewTab | Method | Instantiates a new `EditorTab` and initializes the corresponding Monaco model for a given file result. |
| selectTab | Method | Sets the active tab and ensures the Monaco editor displays the content of that tab. |
| closeTab | Method | Initiates the process of closing a specific tab, prompting for confirmation if changes are unsaved. |
| forceCloseTab | Method | Programmatically closes a tab, disposing of its associated model and listener. |
| closeAllTabsWithoutCheck | Method | Clears all open tabs and disposes of all associated editor resources. |
| hasUnsavedChanges | Method | Checks if any open tabs have been modified since the last save. |
| triggerGoBack | Method | Navigates the user back to the main canvas view, prompting if unsaved changes exist. |
| openContextMenu | Method | Displays the context menu at the specified coordinates for a given workspace node. |
| triggerCreateFileAtRoot | Method | Prompts the user to create a new file directly at the root of the current project. |
| triggerCreateFileInFolder | Method | Prompts the user to create a new file within a selected folder node. |
| triggerDeleteNode | Method | Deletes a specified file or folder node from the workspace, after user confirmation. |
| triggerDeleteNodeFromMenu | Method | Triggers the deletion of the currently selected context menu node. |
| saveCurrentChanges | Method | Persists the content of the active editor tab to the backend service, triggering a compilation check upon success. |
| executeWorkspaceCompilation | Method | Triggers a full workspace compilation process, updating the UI with success/error markers. |
| calculatePadding | Method | Calculates an estimated padding value based on the depth of a file path. |
| findFirstFile | Method | Recursively searches a directory node to find the first file within it. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component operates around a reactive lifecycle driven by `effect` tied to `EditorStateService.activeProject()`. When a project is active, it loads the workspace tree and initializes Monaco. File content changes trigger a dirty flag update, which, upon saving, initiates a full workspace compilation via `AssetCodeService`. The compilation step uses Monaco's marker system to visually represent compiler errors and warnings.
- **Side Effects:** The component heavily interacts with external systems: it makes numerous network calls via `AssetCodeService` (e.g., `getWorkspaceTree`, `getFileContent`, `updateFileContent`, `compileWorkspace`). It also interacts with the browser environment via `HostListener` events (`contextmenu`, `beforeunload`) and uses `prompt()` for user input.
- **Error Handling:** Network failures during file loading or saving result in `showToast` notifications and the hiding of the loading backdrop. Compilation errors are caught, and specific error markers are applied to the Monaco editor using `monacoService.setModelMarkers`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `rxjs`, `@angular/core`
- **Internal:** [AssetCodeService](/asset-code/asset-code.service.md), [EditorStateService](/editor/services/editor-state.service.md), [LoadingService](/app/services/loading.service.md), [MonacoService](/monaco/monaco.service.md), [Router](/angular/router.md)