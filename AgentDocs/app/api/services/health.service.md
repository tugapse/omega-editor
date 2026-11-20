## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | HealthService |
| Source file | health.service.ts |

The **HealthService** is a specialized infrastructure utility designed to monitor the operational status of the backend API. It serves as a diagnostic bridge between the client-side application and the server environment, ensuring that the core communication channel is active and responsive.

**Functional Mission**
The primary responsibility of the **HealthService** is to execute system health checks. It solves the problem of silent connectivity failures by providing a dedicated mechanism to verify server availability, specifically targeting endpoints that reside outside the standard versioned API routing structure.

**System Context & Integration**
This service operates within the API communication layer. It utilizes the `API_URL` token to resolve the server's location and performs a specialized string manipulation to bypass the `/api/v1` prefix, which is required for the `/health` endpoint. It acts as a foundational service that can be consumed by application guards, initialization logic, or monitoring components to determine if the application should proceed with high-level operations or enter a degraded/offline state.

- **INTERNAL REFERENCES**: [API_URL](/AgentDocs/app/api/api-url.token.md), [HealthStatusResponse](/AgentDocs/app/api/models/omega-api.models.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `API_URL` (via `inject(API_URL)`)  Provides the base endpoint for all API communications.

**Hardcoded Constants:**
- `/api/v1` (String literal)  Used to strip the versioned prefix from the base URL to reach the root health endpoint.
- `/health` (String literal)  The specific endpoint path for system diagnostics.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `HealthService` | Class | Manages health check requests and URL derivation. |
| `checkHealth()` | Method | Returns an `Observable<HealthStatusResponse>` representing the server's current status. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Injects `HttpClient` and `API_URL`.
    2. Derives `baseUrl` by taking the injected `apiUrl` and removing the `/api/v1` substring. This ensures the service can target the root-level `/health` endpoint regardless of the versioned API path.
- **Data Path**: 
    1. **Input**: Triggered via `checkHealth()` call.
    2. **Processing**: Constructs a full URL by appending `/health` to the derived `baseUrl`.
    3. **Output**: Executes an HTTP GET request and returns an `Observable` containing the `HealthStatusResponse`.
- **Conditional Branching**: No explicit conditional branching logic is present within the service methods; error handling is deferred to the RxJS stream consumer.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs`
- **Internal Modules**: 
    - [API_URL](/AgentDocs/app/api/api-url.token.md)
    - [HealthStatusResponse](/AgentDocs/app/api/models/omega-api.models.md)
- **External Packages**: `@angular/core`, `@angular/common/http`