## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetIcons |
| Source file | icons.ts |

The **AssetIcons** component serves as a centralized configuration registry for mapping asset types to their corresponding visual representations within the user interface. It provides a standardized dictionary of FontAwesome icon class strings, ensuring visual consistency across all modules that render asset metadata.

**Functional Mission**
The primary responsibility of **AssetIcons** is to act as a single source of truth for asset iconography. By decoupling the logical asset type (e.g., `material`, `audio`) from its specific UI implementation (the FontAwesome string), it allows for global updates to the visual language of the editor without requiring changes to the underlying business logic or component templates.

**System Context & Integration**
This component is a low-level utility used primarily by UI components responsible for displaying asset hierarchies or grids. It is heavily utilized by the [Asset Explorer](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md) and its sub-components, such as the [Asset Grid](/AgentDocs/editor/components/asset-explorer/components/asset-grid/asset-grid.md) and [Asset Tree](/AgentDocs/editor/components/asset-explorer/components/asset-tree/asset-tree.md), to determine which icon to render based on the asset's type defined in [Asset Interface](/AgentDocs/editor/interfaces/asset.interface.md).

- **INTERNAL REFERENCES**: [Asset Explorer](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md), [Asset Grid](/AgentDocs/editor/components/asset-explorer/components/asset-grid/asset-grid.md), [Asset Tree](/AgentDocs/editor/components/asset-explorer/components/asset-tree/asset-tree.md), [Asset Interface](/AgentDocs/editor/interfaces/asset.interface.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `AssetIcons` (Default: `{ file: 'fa-file', folder: 'fa-folder', material: 'fa-cube', image: 'fa-image', audio: 'fa-headphones', meshdata: 'fa-cube', scene: 'fa-film' }`)  A mapping object linking asset type keys to FontAwesome icon class names.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `AssetIcons` | Constant (Object) | Provides a lookup table for retrieving icon class strings based on asset type keys. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - None identified.
- **External Packages**: None identified.