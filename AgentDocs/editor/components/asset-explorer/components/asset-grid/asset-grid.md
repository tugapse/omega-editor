## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetGridComponent |
| Source file | asset-grid.ts |

The **AssetGridComponent** serves as a visual presentation layer for assets within the editor's asset explorer. It is responsible for rendering a collection of assets in a grid-based layout, providing a high-density overview of files and folders available in the current directory context.

**Functional Mission**
The primary mission of **AssetGridComponent** is to facilitate asset discovery and interaction through a graphical grid interface. It transforms raw asset data into interactive UI elements, enabling users to perform single clicks for selection, double clicks for execution (such as opening or applying an asset), and right-clicks to trigger context-specific actions.

**System Context & Integration**
This component acts as a consumer of asset state, receiving the current directory context via the `activeFolder` input. It functions as a downstream view within the [Assets Explorer](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md) module. When user interactions occur, the component emits events (`itemClick`, `itemDoubleClick`, `contextMenu`) that are typically handled by parent orchestrators to update the [Assets Manager](/AgentDocs/editor/core/assets-manager.md) or trigger specific asset-related services.

- **INTERNAL REFERENCES**: 
    - [AssetIcons](/AgentDocs/editor/components/asset-explorer/icons.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `icons` (Default: `AssetIcons`)  Provides the mapping of asset types to their respective visual representations.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `activeFolder` | input | Receives the current directory/folder object (`IAsset`) or `null` to define the grid's scope. |
| `selectedNodeId` | input | Receives the unique identifier of the currently highlighted asset. |
| `itemClick` | output | Emits the `IAsset` object when a single click event is detected on a grid item. |
| `itemDoubleClick` | output | Emits the `IAsset` object when a double click event is detected on a grid item. |
| `contextMenu` | output | Emits a payload containing the `MouseEvent` and the target `IAsset` for context menu triggering. |
| `icons` | property | Exposes the `AssetIcons` constant for template-based icon resolution. |

## 4. Execution Logic & Flow
- **Initialization**: The component initializes with `ChangeDetectionStrategy.OnPush` to optimize performance by only checking for changes when inputs or explicit signals change. It maps the `AssetIcons` constant to a local property for template access.
- **Data Path**: 
    1. **Input**: Receives `activeFolder` (the directory context) and `selectedNodeId` (the selection state).
    2. **Processing**: The template (not provided in source, but implied) iterates over the assets contained within the `activeFolder`.
    3. **Output**: User interactions on the rendered grid items trigger the `itemClick`, `itemDoubleClick`, or `contextMenu` outputs, passing the relevant `IAsset` data back to the parent.
- **Conditional Branching**: No internal logic branching is present in the TypeScript class; branching logic is delegated to the template based on the provided inputs.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)
    - [AssetIcons](/AgentDocs/editor/components/asset-explorer/icons.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
- **External Packages**: 
    - `@angular/core`