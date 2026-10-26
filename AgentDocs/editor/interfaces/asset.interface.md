## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | IAsset |
| Source file | asset.interface.ts |

The **IAsset** interface serves as the fundamental structural definition for all resource entities within the Omega Editor ecosystem. It provides a standardized schema that allows the system to treat diverse data typesranging from individual files to complex directory structuresas uniform objects within the application state.

**Functional Mission**
The primary responsibility of **IAsset** is to enforce type safety and structural consistency for asset management operations. By defining a common shape for assets, it enables downstream services and components to interact with the file system abstraction without needing to know the specific underlying implementation of each resource.

**System Context & Integration**
This interface acts as the data contract between the core asset management logic and the UI presentation layers. It is heavily utilized by [Assets Manager](/AgentDocs/editor/core/assets-manager.md) to manage the lifecycle of resources and is the primary data model consumed by the [Asset Explorer](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md) for rendering file trees and grids. Furthermore, it provides the necessary metadata for [Asset Service](/AgentDocs/app/api/services/asset.service.md) to facilitate API communications regarding project resources.

- **INTERNAL REFERENCES**: [Assets Manager](/AgentDocs/editor/core/assets-manager.md), [Asset Explorer](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md), [Asset Service](/AgentDocs/app/api/services/asset.service.md).

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `IAsset` | Interface | Defines the shape of an asset entity including identity, pathing, type, and hierarchy. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.