## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AssetTreeComponent | [asset-tree](/editor/components/asset-explorer/components/asset-tree/asset-tree.md) |

This component is responsible for rendering a hierarchical, navigable tree structure representing assets within the editor environment. Its primary function is to visualize the asset data provided via its `treeData` input, allowing users to interact with the structure by expanding nodes or selecting specific assets.

Architecturally, `AssetTreeComponent` functions as a presentation layer UI component. It consumes state and configuration (like expanded nodes and selected IDs) via Angular inputs and emits events (`nodeClick`, `contextMenu`) to notify parent components about user interactions, integrating it into the broader asset management workflow.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `treeData()` | Input | Required input providing the root asset structure (`IAsset`). |
| `expandedNodes()` | Input | Required input providing a `Set` of IDs representing currently expanded nodes. |
| `selectedNodeId()` | Input | Optional input providing the ID of the currently selected node. |
| `nodeClick()` | Output | Emits the `IAsset` object when a node is clicked. |
| `contextMenu()` | Output | Emits an object containing the mouse event and the associated `IAsset` when the context menu is triggered. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component uses the `isExpanded` method to determine the visibility state of any given node by checking if its ID is present in the `expandedNodes` input set. It relies on Angular's change detection strategy (`OnPush`) to efficiently re-render only when inputs change.
- **Side Effects:** None. The component is purely declarative, receiving data via inputs and emitting events via outputs.
- **Error Handling:** None explicitly implemented; relies on Angular's input validation for required properties.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [CommonModule](/editor/components/asset-explorer/components/asset-tree/asset-tree.md) [Icon](/src/app/components/icon/icon.md)