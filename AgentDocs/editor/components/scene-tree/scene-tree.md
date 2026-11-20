## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SceneTree |
| Source file | scene-tree.ts |

The **SceneTree** component serves as the primary hierarchical visualization and management interface for the active scene within the editor. It provides users with a structured, tree-based representation of all `SceneEntity` objects, allowing for intuitive navigation, selection, and structural manipulation of the scene graph.

**Functional Mission**
The core mission of **SceneTree** is to synchronize the visual hierarchy of the editor with the underlying engine's scene state. It solves the problem of complex spatial relationships by translating a flat or nested array of engine entities into a navigable UI structure, enabling operations such as entity selection, visibility toggling, drag-and-drop re-parenting, and entity deletion.

**System Context & Integration**
This component acts as a bridge between the `Scene` data model and the user interface. It listens to updates from the [EditorService](/AgentDocs/editor/services/editor.service.md) to refresh its internal state whenever the scene changes. It communicates user intentions (like selecting an entity or adding a new one) back to the system via the [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md). Downstream, selection events trigger updates in the inspector and canvas resizing logic to ensure the editor's viewport and property panels remain synchronized with the active entity.

- **INTERNAL REFERENCES**: 
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [TreeNodeComponent](/AgentDocs/editor/components/scene-tree/tree-node/tree-node.md)
    - [AddBehaviourMenuComponent](/AgentDocs/editor/components/add-behaviour-menu/add-behaviour-menu.md)
    - [TreeNode](/AgentDocs/editor/components/scene-tree/scene-node.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `targetScene` (via `@Input`)  The current active `Scene` object being visualized.

**Hardcoded Constants:**
- `iconNames` (Default: `{ [EntityType.STATIC]: 'fa-object-group', ... }`)  Maps `EntityType` values to FontAwesome icon identifiers for visual representation in the tree.
- `hiddenentities` (Default: `['SceneEntity', 'Scene']`)  Filter list used to prevent non-instantiable metadata from appearing in the "Add Entity" menu.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `targetScene` | Input (Setter) | Triggers `prepareObjects()` to rebuild the tree when the scene is assigned or changed. |
| `toggleObj` | Method | Flips the `show` visibility property of a `SceneEntity`. |
| `entitySelected` | Method | Handles direct selection via DOM interaction, triggering canvas resizing. |
| `refreshTree` | Method | Manually forces a rebuild of the tree structure. |
| `handleNodeDropped` | Method | Executes complex drag-and-drop logic to re-parent entities in the engine and update the UI tree. |
| `onNodeDeleted` | Method | Recursively removes an entity and all its children from the scene. |
| `onNodeSelected` | Method | Updates the `selectedUuid` and notifies the system of the new selection. |
| `onSceneTreeAddNewRequested` | Method | Calculates menu positioning and populates available entity types for instantiation. |
| `onEntitySelected` | Method | Instantiates a new object from metadata and adds it to the active scene. |
| `inspectScene` | Method | Emits the scene itself as a selectable entity for inspection purposes. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Subscribes to `editorService.onSceneUpdated` and `editorService.onSceneLoaded` to maintain scene synchronization.
    - Subscribes to `sceneTreeService.onEntitySelected` to track the currently active `selectedUuid`.
- **Data Path (Tree Construction)**: 
    1. `targetScene` is received.
    2. `prepareObjects()` is called.
    3. `treeNodeMap` is built by reducing `scene.objects` into a UUID-keyed dictionary.
    4. `rootObjects` are identified (entities without a parent).
    5. `childObjects` map is constructed by grouping entities by their parent's UUID.
    6. `createNodeListFromObjectArray` recursively traverses the hierarchy to build `sceneTreeNodes`.
- **Conditional Branching (Drag & Drop)**:
    - **Inside**: If `dropPosition` is `inside`, the dragged node is appended to the target node's children, and `childEntity.transform.setParent()` is called.
    - **Above/Below**: If `dropPosition` is `above` or `below`, the node is spliced into the target's parent's children array at the calculated index.
    - **Root Level**: If the target has no parent, the node is spliced directly into the `sceneTreeNodes` array.

## 5. Resource Dependencies
- **Standard Libraries**: `CommonModule` (Angular)
- **Internal Modules**: 
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [TreeNodeComponent](/AgentDocs/editor/components/scene-tree/tree-node/tree-node.md)
    - [AddBehaviourMenuComponent](/AgentDocs/editor/components/add-behaviour-menu/add-behaviour-menu.md)
- **External Packages**: `@angular/core`, `@angular/common`, `omega-game-engine`