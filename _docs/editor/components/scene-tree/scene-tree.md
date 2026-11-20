## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SceneTree | /editor/components/scene-tree/scene-tree.md |

This component is responsible for rendering and managing the hierarchical structure of entities within a game scene, known as the Scene Tree. Its primary responsibility is to translate the raw `Scene` data structure into a navigable, interactive tree view, allowing users to select, manipulate, and inspect entities within the editor environment.

Architecturally, `SceneTree` functions as a critical UI component that acts as a bridge between the core game engine data model (`omega-game-engine`) and the editor's user interface. It subscribes to state changes from `EditorService` and `SceneTreeService` to ensure the displayed tree remains synchronized with the active scene, handling complex operations like entity selection, hierarchy modification (drag-and-drop), and entity instantiation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `targetScene` | Input | Binds the component to a specific `Scene` instance, triggering tree preparation. |
| `toggleObj` | Method | Toggles the visibility (`show` property) of a given `SceneEntity`. |
| `entitySelected` | Method | Handles click events on entities within the tree, updating selection state and triggering canvas resize. |
| `refreshTree` | Method | Forces a complete recalculation and redraw of the scene tree structure. |
| `handleNodeDropped` | Method | Manages the logic for re-parenting or reordering nodes based on drag-and-drop events. |
| `onNodeDeleted` | Method | Initiates the deletion of an entity and all its descendants from the scene. |
| `onNodeSelected` | Method | Updates the internal selection state when a tree node is clicked, notifying external services. |
| `onSceneTreeAddNewRequested` | Method | Opens the context menu for adding new entities at the current location. |
| `onEntitySelected` | Method | Instantiates and adds a new entity to the scene based on provided metadata. |
| `inspectScene` | Method | Emits the entire scene object through the entity selection service for inspection. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component builds the tree structure by first mapping all scene objects by UUID. It then traverses the scene objects to determine the root entities (those without a grandparent) and recursively builds the `TreeNode` hierarchy using `createNodeListFromObjectArray`. State synchronization is managed via subscriptions to `EditorService` and `SceneTreeService`. Hierarchy manipulation (drag/drop) involves complex traversal (`findNodeAndParent`) and direct mutation of the `children` arrays within the `TreeNode` structure, followed by updating the underlying `SceneEntity` parent transforms.

- **Side Effects:** Mutates the state of the `Scene` object (adding/removing entities, changing entity visibility). Interacts heavily with external services (`EditorService`, `SceneTreeService`) to emit events, which can trigger canvas resizing and scene updates.

- **Error Handling:** Fallbacks are implemented in `findNodeAndParent` to return `{ node: null, parent: null }` if a name is not found. In `onNodeDeleted`, it checks if the entity exists in `treeNodeMap` before attempting deletion.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `CommonModule`, `Icon`
- **Internal:** [SceneTreeService](/editor/components/scene-tree/scene-tree.md), [EditorService](/editor/services/editor.service.md), [SceneEntity](/omega-game-engine/scene-entity.md), [EntityType](/omega-game-engine/entity-type.md), [Scene](/omega-game-engine/scene.md), [ObjectInstanciator](/omega-game-engine/object-instanciator.md), [ClassMetadata](/omega-game-engine/class-metadata.md), [ClassType](/omega-game-engine/class-type.md)