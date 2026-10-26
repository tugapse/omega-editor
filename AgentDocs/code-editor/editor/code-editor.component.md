## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CodeWorkspaceComponent |
| Source file | code-editor.component.ts |

The **CodeWorkspaceComponent** serves as the primary orchestration layer for the integrated development environment (IDE) within the Omega Editor. It manages the lifecycle of code editing sessions, including the initialization of the Monaco Editor instance, the management of multiple file tabs, and the synchronization of local file changes with the remote asset service.

**Functional Mission**
The primary responsibility of **CodeWorkspaceComponent** is to provide a robust, multi-tabbed code editing interface that supports real-time file manipulation, workspace tree navigation, and automated compilation feedback. It acts as the bridge between the user's code modifications and the backend engine, ensuring that IntelliSense definitions are kept up-to-date and that compilation errors are surfaced directly within the editor UI.

**System Context & Integration**
This component sits at the intersection of the workspace management and the code execution layers. It consumes project state from [EditorStateService](/AgentDocs/editor/services/editor-state.service.md) to determine which project context to load. It utilizes [AssetCodeService](/AgentDocs/code-editor/asset-code.service.md) for all I/O operations (reading, writing, creating, and deleting files) and [MonacoService](/AgentDocs/code-editor/monaco.service.md) to interface with the underlying Monaco Editor engine. When changes are saved, it triggers a workspace compilation via the code service, which subsequently updates the editor's marker state to reflect syntax or logic errors.

- **INTERNAL REFERENCES**: 
    - [AssetCodeService](/AgentDocs/code-editor/asset-code.service.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [MonacoService](/AgentDocs/code-editor/monaco.service.md)
    - [LoadingService](/AgentDocs/app/services/loading.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `this.editorState.activeProject()`  Retrieves the currently active project context to drive workspace loading.

**Hardcoded Constants:**
- `userUuid` (Default: `"test-user-uuid"`)  Mock user identifier for session context.
- `nextToastId` (Default: `0`)  Incremental counter for unique toast notification identification.
- `toastTimeout` (Default: `4000` or `6000`)  Duration in milliseconds for toast visibility based on severity.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `CodeWorkspaceComponent` | Class | Main controller for the code editor workspace. |
| `EditorTab` | Interface | Defines the structure of a file tab (file data, dirty state, Monaco model, and change listener). |
| `ToastMessage` | Interface | Defines the structure for UI notifications. |
| `handleNodeClick` | Func | Navigates the workspace tree and opens a file in a new tab. |
| `saveCurrentChanges` | Func | Flushes the current active tab's content to the backend via `AssetCodeService`. |
| `executeWorkspaceCompilation` | Func | Triggers a headless compilation and maps resulting errors to Monaco markers. |
| `closeTab` | Func | Handles user-initiated tab closure with unsaved change verification. |
| `triggerCreateFileAtRoot` | Func | Prompts user for a filename to create a new file at the workspace root. |
| `triggerDeleteNode` | Func | Deletes a file or folder and refreshes the workspace tree. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. `ngOnInit` triggers the `LoadingService` to show a backdrop.
    2. `ngAfterViewInit` invokes `monacoService.loadDependencies`.
    3. Once dependencies are ready, `initMonacoInstance` is called to set up the editor and load the workspace tree/IntelliSense.
    4. An `effect` monitors `editorState.activeProject()`; if the project changes, it clears existing tabs and reloads the workspace.
- **Data Path (File Loading)**: 
    `WorkspaceNode` (Click) $\rightarrow$ `codeService.getFileContent` $\rightarrow$ `FileContentResult` $\rightarrow$ `monacoService.createOrGetModel` $\rightarrow$ `EditorTab` (Added to `tabs` array).
- **Data Path (Saving & Compiling)**: 
    `Monaco Model Change` $\rightarrow$ `isDirty = true` $\rightarrow$ `saveCurrentChanges()` $\rightarrow$ `codeService.updateFileContent` $\rightarrow$ `codeService.compileWorkspace` $\rightarrow$ `monacoService.setModelMarkers` (Error Display).
- **Conditional Branching**:
    - **Unsaved Changes**: Before closing a tab or navigating away (`unloadNotification`), the component checks `hasUnsavedChanges()` and prompts the user via `confirm()`.
    - **Empty Workspace**: If `loadWorkspaceTree` finds no files, it immediately hides the loading backdrop.
    - **Compilation Result**: If `compileWorkspace` returns `success: false`, the component parses error text using regex to extract line/column numbers for Monaco markers.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs` (Subscription management), `@angular/core` (Lifecycle and DI).
- **Internal Modules**: 
    - [AssetCodeService](/AgentDocs/code-editor/asset-code.service.md)
    - [MonacoService](/AgentDocs/code-editor/monaco.service.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [LoadingService](/AgentDocs/app/services/loading.service.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
- **External Packages**: `monaco-editor` (via `MonacoService`)