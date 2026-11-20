## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetService |
| Source file | asset.service.ts |

The **AssetService** acts as the primary data orchestration layer for all asset-related operations within a project context. It serves as a specialized API client that abstracts the complexities of HTTP communication, multipart form data construction, and specialized content-type handling (text vs. binary) into a clean, observable-based interface for the rest of the application.

**Functional Mission**
The core mission of **AssetService** is to provide a unified gateway for managing the lifecycle of project assets. This includes retrieving asset indexes, uploading new files, updating metadata, deleting assets, and performing granular content updatesdistinguishing between raw binary data (for images/audio) and text-based data (for code or JSON scene definitions).

**System Context & Integration**
This service is a critical dependency for UI components that interact with the project's file structure. It is heavily utilized by the [Asset Explorer](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md) to populate file trees and grids, and by the [Asset Upload Trigger](/AgentDocs/editor/components/asset-explorer/assets-upload-triger.service.md) to facilitate file ingestion. It bridges the gap between the frontend state and the backend storage by transforming high-level requests (like saving a scene) into specific RESTful calls to the project API.

- **INTERNAL REFERENCES**: 
    - Uses [API_URL](/AgentDocs/app/api/api-url.token.md) for base endpoint resolution.
    - Returns models defined in [omega-api.models](/AgentDocs/app/api/models/omega-api.models.md).
    - Utilizes [EngineAssetType](/AgentDocs/editor/models/asset-types.md) for type-safe filtering.

## 2. Environment & Configuration
**Environment Lookups:**
- `apiUrl` (via `inject(API_URL)`)  The base URL for the backend API services.

**Hardcoded Constants:**
- `baseUrl` (Default: `${this.apiUrl}/projects`)  The root path for all project-scoped API requests.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `listAssets` | Method | Fetches a filtered index of assets within a project using `type` and `dir` parameters. |
| `uploadAsset` | Method | Performs a multipart/form-data POST to upload a new file with optional path/type overrides. |
| `updateAsset` | Method | Sends a PATCH request to modify asset metadata or relocation properties. |
| `deleteAsset` | Method | Executes a DELETE request to remove an asset from the system. |
| `getRawAssetContent` | Method | Retrieves the raw binary `Blob` of an asset. |
| `getTextAssetContent` | Method | Retrieves the string representation of a text-based asset. |
| `updateRawAssetContent` | Method | Performs a PUT request to update the text content of an asset. |
| `updateBinaryAssetContent` | Method | Performs a PUT request using `FormData` to replace binary file data. |
| `saveSceneAsset` | Method | A specialized wrapper that stringifies `SceneData` and updates it via the text endpoint. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Injects `HttpClient` and `API_URL`.
    - Constructs `baseUrl` by appending `/projects` to the injected API URL.
- **Data Path**:
    - **Asset Listing**: `projectId` + `filters` $\rightarrow$ `HttpParams` construction $\rightarrow$ `GET` request $\rightarrow$ `ProjectAssetIndexResponse`.
    - **Binary Upload**: `File` $\rightarrow$ `FormData` encapsulation $\rightarrow$ `POST` request $\rightarrow$ `AssetResponse`.
    - **Scene Saving**: `SceneData` (Object) $\rightarrow$ `JSON.stringify` $\rightarrow$ `UpdateAssetTextRequest` $\rightarrow$ `PUT` request $\rightarrow$ `AssetResponse`.
- **Conditional Branching**:
    - `listAssets`: Checks for existence of `type` and `dir` before appending to `HttpParams`.
    - `uploadAsset`: Checks for existence of `virtualPath` and `assetType` before appending to `FormData`.

## 5. Resource Dependencies
- **Standard Libraries**: `Observable` (rxjs)
- **Internal Modules**: 
    - [API_URL](/AgentDocs/app/api/api-url.token.md)
    - [AssetResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [MessageResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [ProjectAssetIndexResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [SceneData](/AgentDocs/app/api/models/omega-api.models.md)
    - [UpdateAssetRequest](/AgentDocs/app/api/models/omega-api.models.md)
    - [UpdateAssetTextRequest](/AgentDocs/app/api/models/omega-api.models.md)
    - [EngineAssetType](/AgentDocs/editor/models/asset-types.md)
- **External Packages**: `@angular/core`, `@angular/common/http`, `rxjs`