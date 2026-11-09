## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AssetsExplorerService | [editor/components/asset-explorer/assets-explorer.service](/editor/components/asset-explorer/assets-explorer.service.md) |

This service is responsible for managing the entire asset browsing experience within the editor. Its primary responsibility is to fetch, structure, and maintain the state of all project assets, presenting them in a navigable tree structure that users can interact with. It handles the logic for creating, renaming, and deleting assets based on user actions.

Architecturally, this service acts as a centralized state manager and API client for asset operations. It consumes data from the [AssetService](/app/api/services/asset.service.md) and interacts with the [EditorStateService](/editor/components/asset-explorer/editor-state.service.md) to synchronize selections and folder activations across the application.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| loadProjectAssets | Method | Fetches all assets for a given project ID and builds the internal asset tree structure. |
| selectNode | Method | Handles user selection on an asset node, either toggling expansion for folders or setting the selected asset for files. |
| activateFolder | Method | Sets a specific folder or project as the currently active context for asset operations. |
| toggleExpand | Method | Toggles the expanded/collapsed state of a given asset node. |
| createAsset | Method | Creates a new asset (file or folder) based on a specified action type and name, uploading it via the API. |
| renameAsset | Method | Updates the virtual path (name) of an existing asset within the project. |
| deleteAsset | Method | Removes an asset from the project, updating the local state upon successful deletion. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service maintains state using Angular Signals (`treeData`, `selectedNodeId`, `expandedNodes`, `activeFolder`). Asset tree construction (`buildAssetTree`) recursively maps flat asset responses into a hierarchical structure based on `virtualPath`. Asset creation (`createAsset`) uses a switch statement to determine file content, MIME type, and extension based on the requested action type.
- **Side Effects:** Interacts heavily with the network via `AssetService` methods (`listAssets`, `uploadAsset`, `updateAsset`, `deleteAsset`). It also mutates the external state managed by `EditorStateService`.
- **Error Handling:** `createAsset` returns `null` if the action type is unknown or if the action is 'folder' (which requires backend support). `deleteAsset` handles state cleanup if the deleted node was the active folder or the currently selected asset.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `rxjs`
- **Internal:** [AssetService](/app/api/services/asset.service.md), [EditorStateService](/editor/components/asset-explorer/editor-state.service.md)