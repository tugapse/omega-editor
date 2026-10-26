## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AuthService |
| Source file | auth.service.ts |

The **AuthService** acts as the centralized gateway for managing user identity and session lifecycle within the application. It encapsulates all HTTP communication related to authentication processes, including user registration, credential verification (login), and session termination (logout).

**Functional Mission**
The primary mission of **AuthService** is to abstract the complexities of authentication API interactions and provide a unified interface for managing the user's security state. It ensures that authentication tokens are correctly persisted in local storage upon successful login and purged upon logout or unauthorized access, maintaining a consistent security posture across the client application.

**System Context & Integration**
This service serves as a critical dependency for several security-related modules. It provides the necessary token retrieval logic for the [AuthInterceptor](/AgentDocs/app/api/auth.interceptor.md) to inject credentials into outgoing requests. Furthermore, it supplies the state-checking mechanism used by the [AuthGuard](/AgentDocs/guards/auth.guard.md) to protect sensitive routes. By managing the `omega-auth-token` in `localStorage`, it facilitates the transition between unauthenticated and authenticated application states.

- **INTERNAL REFERENCES**: [AuthInterceptor](/AgentDocs/app/api/auth.interceptor.md), [AuthGuard](/AgentDocs/guards/auth.guard.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `API_URL` (via `inject(API_URL)`)  Provides the base URL for the API, used to construct the authentication endpoint path.

**Hardcoded Constants:**
- `authUrl` (Default: `${this.apiUrl}/auth`)  The specific endpoint prefix for authentication operations.
- `TOKEN_KEY` (Default: `'omega-auth-token'`)  The key used for storing and retrieving the JWT in `localStorage`.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `register` | Method | Sends a POST request with registration data to create a new user account. |
| `login` | Method | Authenticates credentials and persists the returned `accessToken` to local storage. |
| `logout` | Method | Notifies the server of session termination and clears local authentication data. |
| `getToken` | Method | Retrieves the current authentication token from `localStorage`. |
| `isLoggedIn` | Method | Returns a boolean indicating if a valid token is currently present in the session. |
| `clearLocalSession` | Method | Removes the authentication token from `localStorage`. |

## 4. Execution Logic & Flow
- **Initialization**: The service is instantiated as a singleton (`providedIn: 'root'`). It injects `HttpClient` and the `API_URL` token to establish the base `authUrl`.
- **Data Path**:
    - **Registration**: `AuthRegisterRequest` $\rightarrow$ `POST /auth/register` $\rightarrow$ `UserResponse`.
    - **Login**: `AuthLoginRequest` $\rightarrow$ `POST /auth/login` $\rightarrow$ `tap(store token)` $\rightarrow$ `LoginResponse`.
    - **Logout**: `AuthLogoutRequest` $\rightarrow$ `POST /auth/logout` $\rightarrow$ `tap(clear session)` $\rightarrow$ `MessageResponse`.
- **Conditional Branching**:
    - **Token Storage**: During `login`, the `tap` operator checks if `response.accessToken` exists and if `localStorage` is defined before attempting to persist the token.
    - **Environment Safety**: `getToken` and `clearLocalSession` perform checks for `typeof localStorage !== 'undefined'` to prevent errors in non-browser environments (e.g., SSR).
    - **Authentication Check**: `isLoggedIn` uses double negation (`!!`) to convert the presence of a token string into a strict boolean.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs`, `rxjs/operators`
- **Internal Modules**: 
    - [AuthLoginRequest](/AgentDocs/app/api/models/omega-api.models.md)
    - [AuthLogoutRequest](/AgentDocs/app/api/models/omega-api.models.md)
    - [AuthRegisterRequest](/AgentDocs/app/api/models/omega-api.models.md)
    - [LoginResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [MessageResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [UserResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [API_URL](/AgentDocs/app/api/api-url.token.md)
- **External Packages**: `@angular/core`, `@angular/common/http`