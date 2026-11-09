## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AssetsExplorerComponent | [assets-explorer](/editor/components/asset-explorer/assets-explorer.component.md) |

This component serves as the primary interface for browsing, managing, and interacting with digital assets within the editor environment. Its core responsibility is to display the asset structure, allowing users to navigate folders, select specific assets, and trigger actions like renaming, deleting, or creating new assets. It manages the UI state related to context menus and asset creation prompts.

Architecturally, this component acts as a high-level UI controller for asset management. It heavily relies on the state management provided by [EditorStateService](/editor/services/editor-state.service.md) to synchronize the view with the application's current project state. It delegates specific tasks like asset loading and manipulation to [AssetsExplorerService](/editor/components/asset-explorer/assets-explorer.service.md) and interacts with external APIs via [AssetService](/src/app/api/services/asset.service.md) for persistence.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `projectId` | Input | Optional string representing the ID of the project to load assets for. |
| `explorerState` | Signal | Publicly exposed service instance allowing template binding to asset state signals. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by subscribing to changes in the active project ID via `EditorStateService`. When the project ID changes, it triggers a tree refresh. It handles user interactions like clicking on nodes (selection/activation) and context menu events (opening/closing). Asset creation involves triggering an upload dialog via `AssetsUploadTriggerService` and then iterating over the results to upload each file individually using `AssetService`.
- **Side Effects:** Interacts heavily with the network via `AssetService` for loading, creating, renaming, and deleting assets. It mutates external state managed by `EditorStateService` and displays loading indicators via `LoadingService`.
- **Error Handling:** Catches errors during asset creation (`handleCreateAsset`) and logs them, displaying a generic alert to the user.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `rxjs`
- **Internal:** [EditorStateService](/editor/services/editor-state.service.md), [IAsset](/editor/interfaces/asset.interface.md), [AssetsExplorerService](/editor/components/asset-explorer/assets-explorer.service.md), [AssetContextMenuComponent](/editor/components/asset-explorer/components/asset-context-menu/asset-context-menu.md), [AssetCreateMenuComponent](/editor/components/asset-explorer/components/asset-create-menu/asset-create-menu.md), [AssetGridComponent](/editor/components/asset-explorer/components/asset-grid/asset-grid.md), [AssetTreeComponent](/editor/components/asset-explorer/components/asset-tree/asset-tree.md), [AssetsUploadTriggerService](/editor/components/asset-explorer/assets-upload-triger.service.md), [LoadingService](/src/app/services/loading.service.md), [AssetService](/src/app/api/services/asset.service.md)