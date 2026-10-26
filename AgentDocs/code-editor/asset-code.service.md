## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetCodeService |
| Source file | asset-code.service.ts |

The **AssetCodeService** serves as the primary data orchestration layer for code-related operations within the editor. It acts as a specialized API gateway that abstracts the complexities of HTTP communication between the frontend application and the backend project services, specifically targeting file system manipulation, workspace structure retrieval, and code compilation.

**Functional Mission**
The primary responsibility of **AssetCodeService** is to manage the lifecycle of source code files within a project. It provides a standardized interface for retrieving workspace trees, reading/writing file contents, creating or deleting files, and triggering workspace compilation. By encapsulating the URL construction logic and request formatting, it ensures that the rest of the application interacts with a clean, domain-specific API rather than raw HTTP endpoints.

**System Context & Integration**
This service is a critical dependency for the code editing subsystem. It provides the necessary data streams for components that visualize the file hierarchy and for the editor itself to load and save code. It integrates with the broader project management flow by utilizing the `API_URL` token to resolve correct backend endpoints. Downstream, it supports the compilation pipeline, allowing the system to transition from raw source code to executable or validated workspace states.

- **INTERNAL REFERENCES**: It relies on [AssetCode Models](/AgentDocs/code-editor/asset-code.models.md) for type safety and [API URL Token](/AgentDocs/app/api/api-url.token.md) for environment-aware routing.

## 2. Environment & Configuration
**Environment Lookups:**
- `apiUrl` (via `inject(API_URL)`)  Resolves the base endpoint for the backend API, used to construct project-specific paths.

**Hardcoded Constants:**
- `baseUrl` (Dynamic)  A computed property that ensures the API path correctly appends `/projects` if the provided `apiUrl` does not already include the `/api` suffix.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `getWorkspaceTree` | Method | Fetches the hierarchical structure of the code workspace for a given `projectId`. |
| `getFileContent` | Method | Retrieves the raw or structured content of a specific file via its path. |
| `createFile` | Method | Sends a request to instantiate a new file within the project workspace. |
| `updateFileContent` | Method | Persists changes to an existing file's content. |
| `deleteFile` | Method | Removes a file from the project workspace using its path. |
| `getEngineTypings` | Method | Fetches engine-specific TypeScript definition strings. |
| `getWorkspaceTypings` | Method | Fetches workspace-specific TypeScript definition strings. |
| `compileWorkspace` | Method | Triggers the backend compilation process for the current project. |

## 4. Execution Logic & Flow
- **Initialization**: The service is instantiated as a singleton (`providedIn: 'root'`) and injects `HttpClient` and the `API_URL` token.
- **Data Path**: 
    1. **Input**: Receives `projectId` and specific payload/path parameters.
    2. **Processing**: The `baseUrl` getter evaluates the `apiUrl` to determine the correct routing prefix (handling the presence or absence of `/api`). Parameters like `path` are processed via `encodeURIComponent` to ensure URL safety.
    3. **Output**: Returns an `Observable` containing the requested data (e.g., `WorkspaceNode`, `FileContentResult`, or `CompileResult`) or a completion signal for void operations.
- **Conditional Branching**: The `baseUrl` getter contains logic to branch the base path construction depending on whether the injected `apiUrl` ends with `/api`.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs` (Observables)
- **Internal Modules**: 
    - [AssetCode Models](/AgentDocs/code-editor/asset-code.models.md)
    - [API URL Token](/AgentDocs/app/api/api-url.token.md)
- **External Packages**: `@angular/core`, `@angular/common/http`