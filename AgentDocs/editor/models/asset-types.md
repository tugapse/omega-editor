## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EngineAssetType |
| Source file | asset-types.ts |

The **EngineAssetType** enum serves as the foundational type definition for categorizing various digital resources within the Omega Editor ecosystem. It provides a strictly typed set of identifiers that allow the system to distinguish between different classes of assets, such as visual, auditory, or structural data.

**Functional Mission**
The primary responsibility of **EngineAssetType** is to provide a centralized, immutable schema for asset classification. By defining a single source of truth for what constitutes an asset type, it prevents string-based errors and ensures type safety across the entire asset management pipeline, from ingestion to rendering.

**System Context & Integration**
This component acts as a critical metadata layer used by high-level management services and low-level inspectors. It is consumed by [Assets Manager](/AgentDocs/editor/core/assets-manager.md) to determine how to load and process files, and by [Asset Explorer](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md) to facilitate filtering and organization. Furthermore, it informs the [Inspector Services](/AgentDocs/editor/services/inspector.service.md) which specialized UI components (e.g., [Texture Inspector](/AgentDocs/editor/inspectors/texture-inspector/texture-inspector.md) vs [Shader Inspector](/AgentDocs/editor/inspectors/shader-inspector/shader-inspector.md)) should be instantiated when a user selects a specific resource.

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
- `EngineAssetType.Texture` (Default: `'texture'`)  Identifier for image-based textures.
- `EngineAssetType.Material` (Default: `'material'`)  Identifier for surface property definitions.
- `EngineAssetType.Audio` (Default: `'audio'`)  Identifier for sound files.
- `EngineAssetType.Scene` (Default: `'scene'`)  Identifier for hierarchical scene configurations.
- `EngineAssetType.MeshData` (Default: `'meshdata'`)  Identifier for geometric vertex/index data.
- `EngineAssetType.Font` (Default: `'font'`)  Identifier for typography resources.
- `EngineAssetType.Shader` (Default: `'shader'`)  Identifier for GPU program source code.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `EngineAssetType` | Enum | Provides a set of constant string values representing valid asset categories. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: None identified.
- **External Packages**: None identified.