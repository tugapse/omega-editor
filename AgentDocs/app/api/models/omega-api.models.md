## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | omega-api.models.ts |
| Source file | omega-api.models.ts |

The **omega-api.models.ts** file serves as the central type definition authority for all network communication between the Omega Editor frontend and its backend API. It provides a strictly typed contract that ensures data integrity during serialization and deserialization processes, preventing runtime errors caused by mismatched payload structures.

**Functional Mission**
The primary responsibility of **omega-api.models.ts** is to define the Request and Response schemas used by the application's API services. By centralizing these interfaces, it provides a single source of truth for the shape of data used in authentication, project management, asset manipulation, and user profile updates.

**System Context & Integration**
This component acts as the data blueprint for the service layer. It is consumed by various API services to ensure that outgoing requests (e.g., `AuthRegisterRequest`) and incoming responses (e.g., `ProjectResponse`) adhere to the expected backend structure. It facilitates the transition of raw JSON data into typed TypeScript objects, which are then utilized by the UI components and state management systems. It is a foundational dependency for services such as [Auth Service](/AgentDocs/app/api/services/auth.service.md), [Project Service](/AgentDocs/app/api/services/project.service.md), and [Asset Service](/AgentDocs/app/api/services/asset.service.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `UserPreferences` | Interface | Defines user-specific UI and editor settings. |
| `AuthRegisterRequest` | Interface | Payload for creating a new user account. |
| `AuthLoginRequest` | Interface | Payload for authenticating an existing user. |
| `AuthLogoutRequest` | Interface | Payload for terminating a user session. |
| `UpdateUserRequest` | Interface | Payload for modifying user profile details. |
| `CreateProjectRequest` | Interface | Payload for initializing a new project with settings. |
| `UpdateProjectRequest` | Interface | Payload for modifying existing project metadata. |
| `UpdateAssetRequest` | Interface | Payload for updating asset metadata (path/type). |
| `UpdateAssetTextRequest` | Interface | Payload for updating the raw text content of an asset. |
| `SceneData` | Interface | A typed wrapper for arbitrary JSON scene structures. |
| `UserResponse` | Interface | The complete user profile object returned by the server. |
| `ProjectResponse` | Interface | Metadata and configuration for a project. |
| `AssetResponse` | Interface | Detailed metadata for a specific project asset. |
| `ProjectAssetIndexResponse` | Interface | Aggregated list and statistics of all assets in a project. |
| `LoginResponse` | Interface | Authentication tokens and type returned upon successful login. |
| `HealthStatusResponse` | Interface | System availability status. |
| `MessageResponse` | Interface | Generic success/info message container. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - None identified.
- **External Packages**: None identified.