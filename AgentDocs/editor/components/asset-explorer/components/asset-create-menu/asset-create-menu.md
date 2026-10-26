## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetCreateMenuComponent |
| Source file | asset-create-menu.ts |

The **AssetCreateMenuComponent** serves as a dynamic UI controller responsible for generating a hierarchical menu of available asset types that a user can instantiate within the editor. It acts as a bridge between the engine's metadata registry and the editor's user interface, transforming flat technical metadata into a structured, navigable tree format.

**Functional Mission**
The primary mission of **AssetCreateMenuComponent** is to provide a filtered and organized selection interface for asset creation. It solves the problem of presenting a vast array of engine-available types (from `ObjectInstanciator`) in a way that is human-readable and contextually relevant, specifically by grouping them into a virtual folder structure and filtering out non-instantiable or internal types.

**System Context & Integration**
This component is a sub-module of the asset explorer ecosystem. It consumes metadata from the `ObjectInstanciator` (part of the `omega-game-engine`) and utilizes the [AssetsExplorerService](/AgentDocs/editor/components/asset-explorer/assets-explorer.service.md) to manage asset-related operations. When a user selects an action, the component emits a string identifier via an `output`, which is typically handled by a parent component to trigger the actual creation logic through the engine or API. It relies on the [IAsset](/AgentDocs/editor/interfaces/asset.interface.md) interface to maintain structural consistency with the rest of the editor's tree-based navigation systems.

- **INTERNAL REFERENCES**: 
    - [AssetsExplorerService](/AgentDocs/editor/components/asset-explorer/assets-explorer.service.md)
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `hiddenTypes` (Default: `['EntityBehaviour', 'RenderBehaviour', 'Transform', 'Light']`)  A list of engine types excluded from the creation menu to prevent users from manually instantiating internal or component-only logic.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `create` | `output<string>` | Emits the unique identifier/action string of the selected asset type to the parent component. |
| `assetsService` | `AssetsExplorerService` | Injected service for managing asset explorer state and operations. |
| `menuData` | `IAsset` | Holds the processed, hierarchical tree structure used for rendering the menu. |
| `ngAfterViewInit` | `void` | Lifecycle hook that triggers the metadata retrieval, filtering, and tree construction logic. |
| `handleAction` | `(event: MouseEvent, action?: string) => void` | Intercepts user clicks, prevents event bubbling, and emits the selected action. |
| `buildAssetTree` | `(data: Record<string, any[]>, project: { id: string; name: string }) => IAsset` | Recursive engine that transforms flat path-mapped data into a nested `IAsset` hierarchy. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The component initializes with an empty `menuData`.
    - Upon view initialization (`ngAfterViewInit`), it accesses the `ObjectInstanciator` metadata.
- **Data Path**:
    1. **Extraction**: Retrieves all metadata items from `ObjectInstanciator.getMetadata()`.
    2. **Filtering**: Removes items whose `type` matches the `hiddenTypes` constant.
    3. **Mapping**: Iterates through the filtered list to create a `pathMapped` object, where keys are file paths and values are arrays of items belonging to that path. It also injects a `virtualPath` property into each item.
    4. **Tree Construction**: Passes the `pathMapped` object to `buildAssetTree`.
    5. **Hierarchy Building**: 
        - `ensureFolder` recursively creates parent nodes in a `nodeMap` to ensure a valid path hierarchy.
        - Items are attached to their respective parent folders.
    6. **Sorting**: A deep sort is applied where folders/projects are prioritized at the top of any list, followed by alphabetical sorting of names.
    7. **Output**: The final `IAsset` tree is assigned to `this.menuData`.
- **Conditional Branching**:
    - **Action Check**: In `handleAction`, the `action` string is checked; if present, the `create` output is emitted.
    - **Folder Check**: In `ensureFolder`, the logic checks if a path already exists in the `nodeMap` to prevent duplicate node creation during recursion.

## 5. Resource Dependencies
- **Standard Libraries**: `NgTemplateOutlet` (Angular Common)
- **Internal Modules**: 
    - [AssetsExplorerService](/AgentDocs/editor/components/asset-explorer/assets-explorer.service.md)
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)
- **External Packages**: 
    - `omega-game-engine` (specifically `ObjectInstanciator`)
    - `@angular/core`
    - `@angular/common`