## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | TreeNodeComponent |
| Source file | tree-node.ts |

The **TreeNodeComponent** serves as the fundamental recursive building block for the hierarchical scene representation within the editor. It is responsible for rendering individual entities within the scene tree, providing the visual interface for selection, visibility toggling, and deletion of nodes.

Beyond simple representation, the component implements complex drag-and-drop logic to facilitate scene restructuring. It calculates spatial drop zones (above, below, or inside) to allow users to reorder or reparent entities, effectively acting as the primary interaction layer for managing the spatial and logical hierarchy of the `SceneEntity` tree.

**Functional Mission**
The primary responsibility of **TreeNodeComponent** is to manage the lifecycle of a single node's interaction within a tree structure. It solves the problem of hierarchical data manipulation by translating low-level DOM drag-and-drop events into high-level semantic actions (reparenting, reordering, or deleting) that the scene management system can process.

**System Context & Integration**
This component is a child element within the [SceneTree](/AgentDocs/editor/components/scene-tree/scene-tree.md) architecture. It receives data via the `TreeNode` model and communicates state changes back to parent controllers through various `EventEmitter` outputs. When a drag-and-drop operation is completed, it emits structured data that allows the [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md) or the parent component to update the underlying engine state. It also integrates with the [Icon](/AgentDocs/app/components/icon/icon.md) component for visual representation of node states.

- **INTERNAL REFERENCES**: [TreeNode](/AgentDocs/editor/components/scene-tree/scene-node.md), [Icon](/AgentDocs/app/components/icon/icon.md), [SceneTree](/AgentDocs/editor/components/scene-tree/scene-tree.md), [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `application/json` (Default: `'application/json'`)  Used as the MIME type for transferring serialized node data during drag operations.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `node` | `@Input()` | The data model representing the current node in the hierarchy. |
| `selectedNodeId` | `@Input()` | The ID of the currently active node used to determine visual selection state. |
| `nodeDropped` | `@Output()` | Emits the result of a drag-and-drop operation including the dragged node, target, and position. |
| `visibilityChange` | `@Output()` | Emits when the visibility toggle of a node is triggered. |
| `nodeSelected` | `@Output()` | Emits when a user clicks/selects a node. |
| `nodeDeleted` | `@Output()` | Emits when a deletion request is triggered for the node. |
| `onDeleteClick` | Method | Handles the deletion event, preventing event bubbling to parent nodes. |
| `onDragStart` | Method | Initializes the drag operation by serializing the node data. |
| `onDragOver` | Method | Calculates the vertical position of the cursor to determine if the drop target is 'above', 'below', or 'inside'. |
| `onDrop` | Method | Finalizes the drag operation and emits the `nodeDropped` event. |
| `onNodeClick` | Method | Handles selection logic, ensuring the same node isn't re-selected. |

## 4. Execution Logic & Flow
- **Initialization**: The component receives a `TreeNode<T>` object and a `selectedNodeId` string via inputs. It initializes three boolean flags (`isDropAbove`, `isDropBelow`, `isDropInside`) to `false` to manage drag-over visual states.
- **Data Path**: 
    1. **Input**: `TreeNode` data is received.
    2. **Processing (Drag)**: `onDragStart` serializes the node to JSON $\rightarrow$ `onDragOver` calculates the $Y$ coordinate relative to the element height $\rightarrow$ `onDrop` parses the JSON back into an object.
    3. **Output**: The processed `draggedNode` and calculated `dropPosition` are emitted via `nodeDropped`.
- **Conditional Branching**:
    - **Drop Position Logic**: In `onDragOver`, the component divides the element height into thirds:
        - $Y < 1/3$ height $\rightarrow$ `isDropAbove = true`.
        - $Y > 2/3$ height $\rightarrow$ `isDropBelow = true`.
        - Otherwise $\rightarrow$ `isDropInside = true`.
    - **Selection Guard**: In `onNodeClick`, the emission only occurs if the clicked node's ID is different from the current `selectedNodeId`.
    - **Self-Drop Guard**: In `onDrop`, the operation is ignored if the `draggedNode.name` matches the current `node.name`.

## 5. Resource Dependencies
- **Standard Libraries**: `JSON` (via `JSON.parse`/`JSON.stringify`)
- **Internal Modules**: 
    - [TreeNode](/AgentDocs/editor/components/scene-tree/scene-node.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
- **External Packages**: `@angular/core` (Component, EventEmitter, Input, Output)