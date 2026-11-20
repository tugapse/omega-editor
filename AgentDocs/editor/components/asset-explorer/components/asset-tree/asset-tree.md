## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetTreeComponent |
| Source file | asset-tree.ts |

The **AssetTreeComponent** serves as a hierarchical visualization layer within the asset management subsystem. Its primary purpose is to render a nested, navigable structure of assets, allowing users to browse through folders and files in a tree-like format. It acts as a specialized view component that translates raw asset data into an interactive UI element.

**Functional Mission**
The mission of **AssetTreeComponent** is to provide a structured, interactive interface for asset exploration. It solves the problem of navigating complex, deeply nested asset directories by providing visual cues for expansion/collapse states and facilitating direct interaction with specific assets through selection and context menu triggers.

**System Context & Integration**
This component is a critical part of the asset explorer ecosystem. It receives its data structure from parent components (likely within the `assets-explorer` module) and communicates user intentionssuch as selecting an asset or opening a context menuback up the component hierarchy via outputs. It relies on the `IAsset` interface for data integrity and uses `AssetIcons` to provide visual context for different asset types.

- **INTERNAL REFERENCES**: 
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)
    - [AssetIcons](/AgentDocs/editor/components/asset-explorer/icons.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `treeData` | input | Receives the hierarchical `IAsset` data structure or `null`. |
| `expandedNodes` | input | A `Set<string>` containing the IDs/names of currently expanded nodes. |
| `selectedNodeId` | input | The unique identifier of the currently active/selected asset. |
| `nodeClick` | output | Emits the `IAsset` object when a node is clicked. |
| `contextMenu` | output | Emits the `MouseEvent` and the target `IAsset` for context menu triggering. |
| `isExpanded` | Func | Determines if a specific node should be rendered in an expanded state based on the `expandedNodes` input. |

## 4. Execution Logic & Flow
- **Initialization**: The component initializes with reactive inputs (`treeData`, `expandedNodes`, `selectedNodeId`). It utilizes `ChangeDetectionStrategy.OnPush` to optimize performance, only re-rendering when input references change.
- **Data Path**: 
    1. **Input**: Receives `IAsset` tree structure and a `Set` of expanded node identifiers.
    2. **Processing**: The `isExpanded` method performs a lookup in the `expandedNodes` set using the node's `id` or `name` as the key.
    3. **Output**: User interactions (clicks/right-clicks) trigger `nodeClick` or `contextMenu` events, passing the relevant asset data to the parent controller.
- **Conditional Branching**: 
    - The `isExpanded` logic branches based on whether the node's identifier exists within the `expandedNodes` set, determining the visibility of child nodes in the template.

## 5. Resource Dependencies
- **Standard Libraries**: `@angular/common`
- **Internal Modules**: 
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [AssetIcons](/AgentDocs/editor/components/asset-explorer/icons.md)
- **External Packages**: `@angular/core`