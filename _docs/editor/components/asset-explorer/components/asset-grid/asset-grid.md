## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AssetGridComponent | [asset-grid](/editor/components/asset-explorer/components/asset-grid/asset-grid.md) |

This component is responsible for rendering a grid view of assets within the editor interface. Its primary function is to display a collection of assets, allowing users to interact with them via clicks or double-clicks, and providing context menu functionality for advanced operations. It manages the display state based on the currently active folder and the ID of any selected asset node.

Architecturally, `AssetGridComponent` serves as a presentation layer UI component. It consumes required inputs like `activeFolder` and optional inputs like `selectedNodeId` to drive its rendering logic. It communicates user interactionssuch as selection or context menu requestsupwards to parent components via its defined outputs, such as `itemClick` and `contextMenu`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| activeFolder | Input | Required input defining the root asset folder currently being displayed. |
| selectedNodeId | Input | Optional input providing the unique ID of the asset node currently selected. |
| itemClick | Output | Emitted when an asset item is clicked by the user, providing the selected `IAsset`. |
| itemDoubleClick | Output | Emitted when an asset item is double-clicked by the user, providing the selected `IAsset`. |
| contextMenu | Output | Emitted when the context menu is requested over an asset, providing the mouse event and the associated `IAsset`. |
| icons | Property | A reference to the `AssetIcons` object used for rendering asset-specific icons. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component utilizes Angular's `input` and `output` mechanisms to reactively manage its state based on external data streams (`activeFolder`, `selectedNodeId`). It delegates the rendering of individual assets to its template, relying on the provided `icons` map for visual representation.
- **Side Effects:** None. The component is purely declarative, handling UI events and emitting them without performing direct I/O or state mutation outside of its own component lifecycle.
- **Error Handling:** None explicitly implemented; relies on Angular's change detection and input validation for required properties.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** [IAsset](/editor/interfaces/asset.interface.md), [AssetIcons](/editor/components/asset-explorer/components/asset-grid/asset-grid.md), [Icon](/src/app/components/icon/icon.md)