## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| HealthService | app/api/services/health.service |

This service is responsible for encapsulating the logic required to perform system health checks against the backend API. Its primary responsibility is to communicate with a dedicated `/health` endpoint to verify the operational status of the server and its dependencies.

This component functions as a dedicated service layer within the application architecture. It utilizes the injected `HttpClient` to make network requests and relies on configuration derived from `API_URL` (from `/app/api/services/api-url.token.md`) to correctly construct the base URL for the health check. It returns an observable stream containing the structured health status response defined in `HealthStatusResponse` (from `/app/models/omega-api.models.md`).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| checkHealth | Method | Performs a health check against the server by making a GET request to the derived `/health` endpoint. Returns an Observable of `HealthStatusResponse`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service initializes by deriving a base URL from the full API URL, stripping the `/api/v1` prefix. The `checkHealth` method then constructs the full URL by appending `/health` to this derived base URL and executes an HTTP GET request.

- **Side Effects:** Interacts with the network via `HttpClient` to make external API calls.

- **Error Handling:** No explicit error handling (like `catchError`) is implemented in the provided code; errors from the HTTP request will propagate through the returned Observable.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `HttpClient`, `Observable`
- **Internal:** [API_URL](/app/api/services/api-url.token.md), [HealthStatusResponse](/app/models/omega-api.models.md)