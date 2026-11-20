## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ProjectService | /app/api/services/project.service.md |

This service is responsible for encapsulating all business logic related to project management within the application. Its primary responsibility is to act as a dedicated interface layer, abstracting the complexities of HTTP communication when interacting with the backend API endpoints concerning projects. It handles the CRUD operations (Create, Read, Update, Delete) for project entities.

Architecturally, `ProjectService` functions as a dedicated service layer component. It utilizes Angular's `HttpClient` to perform network requests, relying on models defined in `/app/models/omega-api.models.md` for request and response serialization. It coordinates data flow between the application logic and the external RESTful API.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| createProject | Method | Creates a new project by sending a POST request to the `/projects` endpoint. Takes a `CreateProjectRequest` payload and returns an observable of the resulting `ProjectResponse`. |
| listProjects | Method | Retrieves a list of all projects accessible to the user by sending a GET request to the `/projects` endpoint. Returns an observable array of `ProjectResponse`. |
| getProjectById | Method | Fetches a single project using its unique ID by sending a GET request to `/projects/{project_id}`. Returns an observable of the `ProjectResponse`. |
| getProjectAssets | Method | Retrieves the asset index associated with a specific project by sending a GET request to `/projects/{project_id}/assets`. Returns an observable of `ProjectAssetIndexResponse`. |
| updateProject | Method | Partially updates the metadata of an existing project using a PATCH request to `/projects/{project_id}`. Takes the project ID and an `UpdateProjectRequest` payload. |
| deleteProject | Method | Permanently removes a project and all its associated assets by sending a DELETE request to `/projects/{project_id}`. Returns an observable containing the API's success message (`MessageResponse`). |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service methods construct specific HTTP requests (POST, GET, PATCH, DELETE) targeting the base project URL (`/projects`). It uses dependency injection to obtain the `HttpClient` and the base API URL (`API_URL`) to ensure all requests are correctly routed and typed according to the defined models.
- **Side Effects:** The code explicitly interacts with the network via `HttpClient` to communicate with the external API.
- **Error Handling:** Standard RxJS observable patterns are used; specific error handling (like `catchError`) is not implemented within this service layer, meaning network or API errors will propagate downstream to the calling component.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- `API_URL`  The base URL for the backend API. It is injected via dependency injection from `/app/api-url.token.md`.

**Module Dependencies:**
- **Standard/External:** `HttpClient`, `Observable`
- **Internal:** [omega-api.models](/app/models/omega-api.models.md)