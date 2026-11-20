## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AssetCreateMenuComponent | [asset-create-menu](/editor/components/asset-explorer/components/asset-create-menu/asset-create-menu.md) |

This component is responsible for dynamically generating a menu structure that lists all available asset types within the project. It achieves this by introspecting the metadata provided by the `ObjectInstanciator` to discover all registered types, filtering out internal or unwanted types, and organizing the discovered assets into a hierarchical, tree-like structure suitable for display in a user interface.

Architecturally, this component acts as a presentation layer component that consumes metadata from the `ObjectInstanciator` and utilizes the `AssetsExplorerService` for potential asset-related operations. It transforms raw metadata into a structured `IAsset` tree, which is then exposed via the `create` output emitter to trigger asset creation actions elsewhere in the application.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| IMenuAction | Interface | Defines the structure for a menu item, including label, optional icon, action string, and nested children. |
| IAsset | Interface | Defines the structure for an asset node in the generated tree, including ID, name, type, and children. |
| AssetCreateMenuComponent | Class | The main component class responsible for building and managing the asset creation menu data. |
| create | Output | An output emitter that emits a string representing the action to be performed when a menu item is selected. |
| handleAction | Method | Handles mouse events on menu items, stopping propagation and emitting the associated action if provided. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by filtering all available object metadata from `ObjectInstanciator.getMetadata()` to exclude specific types. It then groups these items by their path into a map. The core logic resides in `buildAssetTree`, which recursively constructs a tree structure. It uses an `ensureFolder` helper to guarantee the existence of parent folders for every item's path, ensuring a complete hierarchy before populating the nodes. Finally, it performs a depth-first sort on the resulting tree to prioritize folders over files and maintain alphabetical order within groups.

- **Side Effects:** The component reads metadata from `ObjectInstanciator.getMetadata()`, which constitutes reading internal engine state. It also logs data to the console during initialization.

- **Error Handling:** The `ensureFolder` helper uses recursion and a `Map` (`nodeMap`) to prevent infinite loops and ensure that folder creation is idempotent, effectively handling path construction errors by relying on the map lookup.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [AssetsExplorerService](/editor/components/asset-explorer/assets-explorer.service.md)