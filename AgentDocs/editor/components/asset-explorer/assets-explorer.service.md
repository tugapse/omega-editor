## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetsExplorerService |
| Source file | assets-explorer.service.ts |

The **AssetsExplorerService** serves as the central state management and orchestration layer for the asset hierarchy within the editor. It is responsible for transforming flat API responses into a navigable tree structure, managing the visual expansion state of nodes, and tracking the currently active folder or selected asset.

**Functional Mission**
The primary mission of **AssetsExplorerService** is to provide a reactive, hierarchical representation of the project's file system. It solves the problem of managing complex nested asset relationships by maintaining local signals for tree data, selection, and folder navigation, while also acting as a factory for generating default file contents (scenes, code, materials, etc.) during the asset creation process.

**System Context & Integration**
This service acts as a bridge between the raw data provided by [AssetService](/AgentDocs/app/api/services/asset.service.md) and the UI components responsible for rendering the file tree and grid. It synchronizes the editor's focus by updating [EditorStateService](/AgentDocs/editor/services/editor-state.service.md) when a specific asset is selected. It also facilitates asset lifecycle operationscreation, renaming, and deletionby coordinating with the backend via the API layer and subsequently updating the local reactive state to ensure UI consistency.

- **INTERNAL REFERENCES**: 
    - [AssetService](/AgentDocs/app/api/services/asset.service.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `projectName` (Default: 'Project Root')  Fallback name for the root node of the asset tree.
- `mimeType` (Default: 'text/plain')  Default MIME type for newly created assets.
- `assetType` (Default: 'raw')  Default classification for newly created assets.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `treeData` | Signal | Holds the root `IAsset` node representing the entire project hierarchy. |
| `selectedNodeId` | Signal | Tracks the unique identifier of the currently selected asset. |
| `expandedNodes` | Signal | A `Set` containing the IDs of nodes currently expanded in the UI. |
| `activeFolder` | Signal | Tracks the currently active directory/folder context for operations. |
| `loadProjectAssets` | Method | Fetches assets from the API and builds the hierarchical tree structure. |
| `selectNode` | Method | Handles user selection; toggles expansion for folders or sets active asset for files. |
| `activateFolder` | Method | Sets the current navigation context to a specific folder/project. |
| `toggleExpand` | Method | Adds or removes a node ID from the `expandedNodes` set. |
| `createAsset` | Method | Generates file content templates and triggers the upload process. |
| `renameAsset` | Method | Updates the virtual path of an existing asset via the API. |
| `deleteAsset` | Method | Removes an asset and cleans up the local state/selection. |

## 4. Execution Logic & Flow
- **Initialization**: The service initializes with null/empty signals for `treeData`, `selectedNodeId`, `expandedNodes` (empty Set), and `activeFolder`.
- **Data Path (Tree Construction)**: 
    1. `loadProjectAssets` calls `assetService.listAssets`.
    2. The resulting array is passed to `buildAssetTree`.
    3. `buildAssetTree` sorts assets by path depth.
    4. It iterates through path segments, creating `folder` nodes in a `nodeMap` if they don't exist.
    5. It attaches file nodes to their respective parent folders.
    6. A recursive `sortChildren` function is applied to ensure folders appear above files and names are alphabetized.
    7. The resulting `IAsset` tree is set to the `treeData` signal.
- **Conditional Branching (Asset Creation)**:
    - `createAsset` uses a `switch` statement on `actionType`.
    - **'scene'**: Generates JSON with empty entities.
    - **'code'**: Generates a TypeScript class template extending `EngineBehavior`.
    - **'material/*'**: Generates JSON based on the specific shader type (color, unlit, standard).
    - **'texture/*'**: Generates JSON with texture configuration (filter/wrap modes).
    - **'entity/*'**: Generates JSON with component lists (Transform, SkyboxRenderer, etc.).
    - **'folder'**: Logs a requirement for backend support and returns `null`.

## 5. Resource Dependencies
- **Standard Libraries**: `inject`, `signal` (Angular), `map`, `tap` (RxJS)
- **Internal Modules**: 
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)
    - [AssetService](/AgentDocs/app/api/services/asset.service.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [AssetResponse](/AgentDocs/app/api/models/omega-api.models.md)
- **External Packages**: `@angular/core`, `rxjs`