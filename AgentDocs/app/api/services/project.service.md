## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ProjectService |
| Source file | project.service.ts |

The **ProjectService** acts as the primary data orchestration layer for project-related operations within the application. It serves as a specialized API client that abstracts the complexities of HTTP communication, providing a clean, observable-based interface for managing the lifecycle of a project.

**Functional Mission**
The core mission of **ProjectService** is to facilitate seamless CRUD (Create, Read, Update, Delete) operations and asset indexing for projects. It solves the problem of decoupling the UI components from the specific implementation details of the RESTful API, ensuring that any component requiring project data can do so through a type-safe, predictable service.

**System Context & Integration**
This service sits within the API service layer, acting as a bridge between the backend REST endpoints and the frontend application logic. It consumes the `API_URL` token to construct valid endpoints and utilizes models defined in [omega-api.models.md](/AgentDocs/app/api/models/omega-api.models.md) to ensure data integrity. Downstream, components such as [project-details.md](/AgentDocs/app/components/project-details/project-details.md) or dashboard views rely on this service to populate their state and trigger updates to the remote project repository.

- **INTERNAL REFERENCES**: 
    - [API_URL](/AgentDocs/app/api/api-url.token.md)
    - [CreateProjectRequest](/AgentDocs/app/api/models/omega-api.models.md)
    - [MessageResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [ProjectAssetIndexResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [ProjectResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [UpdateProjectRequest](/AgentDocs/app/api/models/omega-api.models.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `apiUrl` (via `inject(API_URL)`)  The base URL for all API communications.

**Hardcoded Constants:**
- `projectsUrl` (Default: `${this.apiUrl}/projects`)  The base endpoint path for project resources.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `createProject` | Method | Sends a POST request with a payload to instantiate a new project. |
| `listProjects` | Method | Performs a GET request to retrieve an array of all user-owned projects. |
| `getProjectById` | Method | Performs a GET request to fetch detailed data for a specific project UUID. |
| `getProjectAssets` | Method | Fetches the asset index associated with a specific project ID. |
| `updateProject` | Method | Sends a PATCH request to partially modify existing project metadata. |
| `deleteProject` | Method | Sends a DELETE request to remove a project and its associated assets. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Injects `HttpClient` for network requests.
    - Injects `API_URL` to establish the base environment path.
    - Constructs the `projectsUrl` string by appending `/projects` to the base API URL.
- **Data Path**: 
    - **Input**: Receives specific request payloads (e.g., `CreateProjectRequest`, `UpdateProjectRequest`) or identifiers (`projectId`).
    - **Processing**: Maps the method call to the appropriate HTTP verb (POST, GET, PATCH, DELETE) and constructs the specific resource URL.
    - **Output**: Returns an `Observable` containing the typed response from the server (e.g., `ProjectResponse`, `MessageResponse`).
- **Conditional Branching**: No explicit conditional branching logic is present within the service; it relies on the underlying `HttpClient` and RxJS stream handling for error propagation.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs`
- **Internal Modules**: 
    - [API_URL](/AgentDocs/app/api/api-url.token.md)
    - [omega-api.models.md](/AgentDocs/app/api/models/omega-api.models.md)
- **External Packages**: `@angular/core`, `@angular/common/http`