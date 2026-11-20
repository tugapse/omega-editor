## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AuthService | app/api/services/auth.service |

This service is responsible for encapsulating all business logic related to user authentication within the application. Its primary responsibility is to manage the lifecycle of user sessions, including registration, secure login, and logout operations by communicating with the backend API. It handles the persistence of the authentication token locally to maintain the user's logged-in state across sessions.

Architecturally, `AuthService` functions as a dedicated service layer component. It acts as the intermediary between the application's business logic and the external authentication endpoints, utilizing the `HttpClient` to make network requests. It relies on models defined in [omega-api.models](/src/app/models/omega-api.models.md) and interacts with the application's token configuration via [API_URL](/src/api-url.token.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| register | Method | Registers a new user by sending registration data to the API. Returns an Observable of `UserResponse`. |
| login | Method | Authenticates an existing user. Upon success, it stores the returned `accessToken` in `localStorage`. Returns an Observable of `LoginResponse`. |
| logout | Method | Initiates the logout process by calling the API and subsequently clearing the local session token. Returns an Observable of `MessageResponse`. |
| getToken | Method | Retrieves the stored authentication token from `localStorage`. Returns the token string or `null`. |
| isLoggedIn | Method | Checks the current authentication status by verifying the presence of a token in `localStorage`. Returns a boolean. |
| clearLocalSession | Method | Removes the authentication token from `localStorage`, effectively logging the user out client-side. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service uses RxJS `tap` operators to execute side effects (like token storage or session clearing) immediately after a successful HTTP response is received. Token retrieval and session management rely on checking the existence of `localStorage` to ensure compatibility across different environments.
- **Side Effects:** Interacts heavily with the network via `HttpClient` for all API calls. It also mutates global state by reading from and writing to `localStorage` to persist the authentication token.
- **Error Handling:** The service relies on the underlying `HttpClient` and RxJS stream error handling. Specific API errors (like 401 Unauthorized) are expected to be handled by an external `AuthInterceptor`, which triggers the `clearLocalSession` mechanism.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `HttpClient`, `Observable`, `tap` (from RxJS).
- **Internal:** [omega-api.models](/src/app/models/omega-api.models.md), [API_URL](/src/api-url.token.md).