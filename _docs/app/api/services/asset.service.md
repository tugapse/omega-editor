## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AssetService | [asset.service](/app/api/services/asset.service.md) |

This service is responsible for encapsulating all client-side logic required to interact with the backend API endpoints related to project assets. Its primary responsibility is to abstract the HTTP communication layer, providing strongly-typed methods for CRUD operations (Create, Read, Update, Delete) on assets, including handling both metadata updates and raw binary/text content streaming.

Architecturally, `AssetService` functions as a dedicated service layer within the application. It consumes the `HttpClient` and configuration constants like `API_URL` to construct and execute requests against the project asset endpoints. It relies on models defined in [omega-api.models](/src/models/omega-api.models.md) for request and response structuring.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| listAssets | Method | Retrieves an index of assets for a given project, optionally filtered by type or directory. Returns `ProjectAssetIndexResponse`. |
| uploadAsset | Method | Uploads a new file to a project, allowing specification of a virtual path and asset type. Returns `AssetResponse`. |
| updateAsset | Method | Modifies metadata or relocates an existing asset using a PATCH request. Returns `AssetResponse`. |
| deleteAsset | Method | Permanently removes an asset from the project's database and storage. Returns `MessageResponse`. |
| getRawAssetContent | Method | Streams the raw binary content of an asset as a `Blob`. |
| getTextAssetContent | Method | Streams the raw text content of an asset. |
| updateRawAssetContent | Method | Replaces the text/code content of an asset via a PUT request. Returns `AssetResponse`. |
| updateBinaryAssetContent | Method | Replaces the binary content of an existing asset (e.g., images) via a PUT request using FormData. Returns `AssetResponse`. |
| saveSceneAsset | Method | Specifically updates the text content of an asset with structured scene data, serializing the data to JSON. Returns `AssetResponse`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service utilizes `HttpParams` to construct query parameters for listing assets. For uploads and content updates, it correctly constructs `FormData` objects when necessary (for binary uploads) or serializes payloads (for text/scene updates). It manages different HTTP verbs (GET, POST, PATCH, DELETE, PUT) to map to specific backend operations.
- **Side Effects:** Interacts heavily with the network via `HttpClient` to perform all API calls.
- **Error Handling:** Relies on the underlying `HttpClient` mechanism for error handling; no explicit try/catch blocks are present in the service methods shown.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- `API_URL`  The base URL for the API service.

**Module Dependencies:**
- **Standard/External:** `HttpClient`, `HttpParams`, `Observable`, `FormData` (Browser API).
- **Internal:** [omega-api.models](/src/models/omega-api.models.md), [EngineAssetType](/@editor/models/asset-types.md).