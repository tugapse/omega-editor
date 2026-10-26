## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetsExplorerComponent |
| Source file | assets-explorer.component.ts |

The **AssetsExplorerComponent** serves as the primary orchestration layer for the asset management interface within the Omega Editor. It acts as a high-level controller that integrates tree-based navigation, grid-based visualization, and contextual action menus to provide a unified user experience for browsing, creating, renaming, deleting, and uploading project assets.

**Functional Mission**
The primary responsibility of **AssetsExplorerComponent** is to manage the lifecycle of the asset exploration UI. It solves the problem of complex asset interaction by bridging the gap between low-level API services and high-level UI components, ensuring that the visual representation of the project's file structure remains synchronized with the underlying server-side state.

**System Context & Integration**
This component sits at the intersection of the editor's state management and the asset storage API. It listens to changes in the `EditorStateService` to trigger data refreshes and coordinates with the `AssetsExplorerService` to manage selection and folder activation states. It facilitates data flow from the `AssetService` (via upload and creation workflows) back into the UI by triggering tree refreshes upon successful operations. It also manages the visibility and positioning of contextual UI elements like the `AssetContextMenuComponent` and `AssetCreateMenuComponent`.

- **INTERNAL REFERENCES**: 
    - [AssetsExplorerService](/AgentDocs/editor/components/asset-explorer/assets-explorer.service.md)
    - [AssetTreeComponent](/AgentDocs/editor/components/asset-explorer/components/asset-tree/asset-tree.md)
    - [AssetGridComponent](/AgentDocs/editor/components/asset-explorer/components/asset-grid/asset-grid.md)
    - [AssetContextMenuComponent](/AgentDocs/editor/components/asset-explorer/components/asset-context-menu/asset-context-menu.md)
    - [AssetCreateMenuComponent](/AgentDocs/editor/components/asset-explorer/components/asset-create-menu/asset-create-menu.md)
    - [AssetsUploadTriggerService](/AgentDocs/editor/components/asset-explorer/assets-upload-triger.service.md)
    - [AssetService](/AgentDocs/app/api/services/asset.service.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [LoadingService](/AgentDocs/app/services/loading.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `projectId` (via `@Input`)  The unique identifier for the active project context.

**Hardcoded Constants:**
- `menuWidth` (Default: `150`)  Width used for calculating context menu boundary constraints.
- `menuHeight` (Default: `80`)  Height used for calculating context menu boundary constraints.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `projectId` | Input | Receives the project ID to scope asset loading. |
| `explorerState` | Property | Exposes `AssetsExplorerService` for template binding to signals. |
| `createMenuOpen` | Signal | Tracks the visibility state of the asset creation menu. |
| `contextMenu` | Signal | Stores visibility, coordinates, and the target `IAsset` for the context menu. |
| `refreshTree()` | Method | Triggers a reload of the asset tree based on the current project ID. |
| `handleNodeSelection(node)` | Method | Updates the explorer state with the selected asset node. |
| `handleFolderActivation(node)` | Method | Updates the explorer state to set the active folder context. |
| `openContextMenu(event)` | Method | Calculates screen coordinates and opens the context menu for a specific node. |
| `toggleCreateMenu(event)` | Method | Orchestrates the multi-file upload process via `AssetsUploadTriggerService`. |
| `handleCreateAsset(actionType)` | Method | Prompts user for a name and executes asset creation via `explorerState`. |
| `handleRenameAsset(newName)` | Method | Executes the rename operation for the node targeted by the context menu. |
| `handleDeleteAsset(node)` | Method | Executes the deletion of the specified asset node. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The component initializes by injecting core services.
    - An `effect` is established to monitor `_projectId`; whenever the active project changes, `refreshTree()` is invoked.
    - `ngAfterViewInit` performs an initial `refreshTree()` to populate the UI.
- **Data Path**: 
    - **Upload Flow**: `toggleCreateMenu` $\rightarrow$ `assetsUploadTrigger.openUploadDialog` $\rightarrow$ `apiAssetService.uploadAsset` (mapped via `combineLatest`) $\rightarrow$ `loadingService.hide()` $\rightarrow$ `refreshTree()`.
    - **Creation Flow**: `handleCreateAsset` $\rightarrow$ `prompt()` $\rightarrow$ `explorerState.createAsset()` $\rightarrow$ `refreshTree()`.
- **Conditional Branching**:
    - **Menu Positioning**: In `openContextMenu`, the logic checks if the calculated `x` or `y` coordinates exceed the `containerRect` boundaries; if so, it clamps the menu to the viewport edges.
    - **Document Click**: `onDocumentClick` acts as a global listener to close both the context menu and the creation menu if a click occurs outside their bounds.
    - **Validation**: `handleRenameAsset` and `handleDeleteAsset` perform null checks on the `contextMenu` target and the `project` state before proceeding with API calls.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs` (combineLatest)
- **Internal Modules**: 
    - [AssetsExplorerService](/AgentDocs/editor/components/asset-explorer/assets-explorer.service.md)
    - [AssetTreeComponent](/AgentDocs/editor/components/asset-explorer/components/asset-tree/asset-tree.md)
    - [AssetGridComponent](/AgentDocs/editor/components/asset-explorer/components/asset-grid/asset-grid.md)
    - [AssetContextMenuComponent](/AgentDocs/editor/components/asset-explorer/components/asset-context-menu/asset-context-menu.md)
    - [AssetCreateMenuComponent](/AgentDocs/editor/components/asset-explorer/components/asset-create-menu/asset-create-menu.md)
    - [AssetsUploadTriggerService](/AgentDocs/editor/components/asset-explorer/assets-upload-triger.service.md)
    - [AssetService](/AgentDocs/app/api/services/asset.service.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [LoadingService](/AgentDocs/app/services/loading.service.md)
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)
- **External Packages**: `@angular/core`