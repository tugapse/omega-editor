## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EditorStateService |
| Source file | editor-state.service.ts |

The **EditorStateService** serves as the centralized reactive state management hub for the Omega Editor application. By utilizing Angular Signals, it provides a single source of truth for the current operational context of the editor, including the active project, selected assets, and the user's current workspace view.

**Functional Mission**
The primary responsibility of the **EditorStateService** is to maintain and synchronize the global UI and application state. It solves the problem of state fragmentation by providing a unified, observable interface that allows disparate componentssuch as the file explorer, the canvas, and the code editorto react to changes in selection, project context, and navigation without complex event bubbling.

**System Context & Integration**
This service acts as the connective tissue between the core editor logic and the UI components. It manages the lifecycle of the "active" environment; for instance, when a user selects an asset, this service updates the `selectedAsset` signal, which downstream components like [Asset Explorer](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md) or [Inspector](/AgentDocs/editor/inspectors/inpector-window/inpector.md) consume to update their displays. It also controls the high-level layout via the `centralView` signal, facilitating transitions between the [Canvas](/AgentDocs/editor/components/canvas/canvas.md), [Assets](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md), and [Code Editor](/AgentDocs/code-editor/editor/code-editor.component.md) views.

- **INTERNAL REFERENCES**: 
    - [IProject](/AgentDocs/editor/interfaces/project.interface.md)
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `centralView` default: `'canvas'`  The initial view mode of the editor.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `activeProject` | Signal | Holds the currently loaded [IProject](/AgentDocs/editor/interfaces/project.interface.md) or `null`. |
| `selectedAsset` | Signal | Holds the currently focused [IAsset](/AgentDocs/editor/interfaces/asset.interface.md) or `null`. |
| `openedFiles` | Signal | A collection of [IAsset](/AgentDocs/editor/interfaces/asset.interface.md) objects representing open tabs/files. |
| `isDirty` | Signal | Boolean flag indicating unsaved changes in the current context. |
| `centralView` | Signal | Tracks the active primary workspace mode (`'canvas' \| 'assets' \| 'code'`). |
| `setCentralView` | Method | Updates the `centralView` signal. |
| `setActiveProject` | Method | Updates the `activeProject` signal. |
| `setSelectedAsset` | Method | Updates the `selectedAsset` signal (logic for auto-opening files is currently commented out). |
| `setOpenedFiles` | Method | Replaces the entire `openedFiles` array. |
| `addOpenedFile` | Method | Appends a non-folder [IAsset](/AgentDocs/editor/interfaces/asset.interface.md) to the `openedFiles` list. |
| `removeOpenedFile` | Method | Removes an asset from `openedFiles` and adjusts `selectedAsset` if the removed file was active. |
| `setDirty` | Method | Updates the `isDirty` state. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - `activeProject` is initialized to `null`.
    - `selectedAsset` is initialized to `null`.
    - `openedFiles` is initialized as an empty array `[]`.
    - `isDirty` is initialized to `false`.
    - `centralView` is initialized to `'canvas'`.
- **Data Path (File Management)**:
    - **Input**: `IAsset` object via `addOpenedFile`.
    - **Processing**: Checks if `file.type === 'folder'`. If not, uses `update` to spread existing files and append the new one.
    - **Output**: Updated `openedFiles` signal.
- **Conditional Branching (File Removal)**:
    - **Step 1**: Filter `openedFiles` to remove the target ID.
    - **Step 2**: Check if the `selectedAsset` ID matches the removed file's ID.
    - **Step 3**: If a match is found, attempt to set `selectedAsset` to the first remaining file in the array; otherwise, set to `null`.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [IProject](/AgentDocs/editor/interfaces/project.interface.md)
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)
- **External Packages**: 
    - `@angular/core` (Signals and Injectable)