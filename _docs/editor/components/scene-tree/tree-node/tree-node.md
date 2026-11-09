## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TreeNodeComponent | editor/components/scene-tree/tree-node/tree-node.md |

This component is responsible for rendering a single node within the scene tree visualization. Its primary function is to display the node's data, handle user interactions such as selection, deletion, and drag-and-drop operations, and manage the visual state related to potential drop zones (above, below, inside).

Architecturally, `TreeNodeComponent` acts as a presentation layer UI component. It consumes node data via the `@Input()` property `node` and communicates user actionslike selection changes or structural modificationsupwards to its parent components via `@Output()` events, such as `nodeSelected` or `nodeDropped`. It relies on `TreeNode` for its data structure and `Icon` for visual representation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `nodeDropped` | EventEmitter | Emitted when a node is successfully dropped onto this node, providing the dragged node, target node, and drop position. |
| `visibilityChange` | EventEmitter | Emitted when the visibility state of the node changes. |
| `nodeSelected` | EventEmitter | Emitted when the node is clicked and selected, provided the selected node object. |
| `nodeDeleted` | EventEmitter | Emitted when the node is deleted, providing the deleted node object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component implements complex drag-and-drop logic. `onDragOver` calculates the vertical position of the mouse relative to the node's bounding box to determine if the drop intent is 'above', 'below', or 'inside'. `onDrop` then parses the JSON data of the dragged node and emits the `nodeDropped` event with the determined drop position. Selection is managed by comparing the clicked node's ID against the `selectedNodeId` input.

- **Side Effects:** The component emits events (`nodeDropped`, `nodeSelected`, `nodeDeleted`) which trigger state changes in parent components, effectively mutating the application's global state (the scene tree structure). It also uses `console.debug` for logging.

- **Error Handling:** The `onDrop` method includes a check to ensure the `draggedNode` exists and that it is not the same as the `this.node` to prevent self-dropping errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `DragEvent`, `MouseEvent` (Browser APIs)
- **Internal:** [Icon](/editor/components/icon/icon.md), [TreeNode](/editor/components/scene-tree/tree-node/tree-node.md)