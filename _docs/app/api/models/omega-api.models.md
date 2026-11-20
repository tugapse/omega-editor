## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| OmegaApiModels | /app/api/models/omega-api.models.md |

This component serves as the centralized definition repository for all data structures, schemas, and interfaces used across the Omega API. Its primary responsibility is to enforce strict type contracts for data flowing into and out of the various API endpoints, ensuring data integrity throughout the application lifecycle. It defines the shape of requests (e.g., `AuthRegisterRequest`) and the structure of responses (e.g., `UserResponse`).

Architecturally, this file functions as the core data model layer. It dictates the contracts that the service layer and controller layers must adhere to when handling HTTP requests and serializing/deserializing data. By centralizing these types, it provides a single source of truth for data representation across the entire backend system, linking request payloads to their corresponding response structures.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| UserPreferences | Interface | Defines user-configurable settings like theme and notification status. |
| AuthRegisterRequest | Interface | Payload structure for user registration requests. |
| AuthLoginRequest | Interface | Payload structure for user login requests. |
| AuthLogoutRequest | Interface | Payload structure for user logout requests. |
| UpdateUserRequest | Interface | Payload structure for updating a user's profile information. |
| CreateProjectRequest | Interface | Payload structure for initiating a new project creation. |
| UpdateProjectRequest | Interface | Payload structure for modifying an existing project's metadata. |
| UpdateAssetRequest | Interface | Payload structure for modifying an asset's metadata properties. |
| UpdateAssetTextRequest | Interface | Payload structure containing the text content for an asset update. |
| SceneData | Interface | A flexible type representing structured JSON data for a scene asset. |
| UserResponse | Interface | The complete data structure returned when retrieving a user profile. |
| ProjectResponse | Interface | The complete data structure representing a project's metadata and settings. |
| AssetResponse | Interface | The complete data structure representing a single asset within a project. |
| ProjectAssetIndexResponse | Interface | Aggregated response containing a list and summary of all assets for a project. |
| LoginResponse | Interface | The response object containing authentication tokens upon successful login. |
| HealthStatusResponse | Interface | Simple response object indicating the operational status of the service. |
| MessageResponse | Interface | A generic structure used for returning success or informational messages. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None