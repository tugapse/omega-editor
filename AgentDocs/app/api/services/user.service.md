## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | UserService |
| Source file | user.service.ts |

The **UserService** acts as the dedicated data access layer for managing the identity and personalization settings of the currently authenticated user. It abstracts the complexities of HTTP communication with the backend API, providing a clean, observable-based interface for the rest of the application to interact with user-specific resources.

**Functional Mission**
The primary responsibility of **UserService** is to facilitate the retrieval and modification of the authenticated user's profile data and preference configurations. It solves the problem of centralized user state management by providing standardized methods to fetch the "me" resource and update both profile fields and preference objects via RESTful patterns.

**System Context & Integration**
This service sits within the API service layer, acting as a bridge between the frontend components and the remote backend. It relies on the `API_URL` token for endpoint resolution and assumes that security concerns (such as attaching JWT tokens) are handled by an external interceptor, specifically `[AuthInterceptor](/AgentDocs/app/api/auth.interceptor.md)`. Downstream, components like `[UserBar](/AgentDocs/app/components/user-bar/user-bar.component.md)` or profile management screens consume these Observables to drive the UI state.

- **INTERNAL REFERENCES**: `[AuthInterceptor](/AgentDocs/app/api/auth.interceptor.md)`, `[API_URL](/AgentDocs/app/api/api-url.token.md)`, `[UpdateUserRequest](/AgentDocs/app/api/models/omega-api.models.md)`, `[UserPreferences](/AgentDocs/app/api/models/omega-api.models.md)`, `[UserResponse](/AgentDocs/app/api/models/omega-api.models.md)`.

## 2. Environment & Configuration
**Environment Lookups:**
- `apiUrl` (via `inject(API_URL)`)  Provides the base URL for all API communications.

**Hardcoded Constants:**
- `userUrl` (Default: `${this.apiUrl}/users/me`)  The base endpoint for the authenticated user resource.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `getMe` | Method | Returns an `Observable<UserResponse>` containing the current user's profile data via `GET`. |
| `updateMe` | Method | Sends a `PATCH` request with `UpdateUserRequest` to partially update user profile fields. |
| `getPreferences` | Method | Returns an `Observable<UserPreferences>` via `GET` for the user's specific settings. |
| `updatePreferences` | Method | Sends a `PUT` request with a full `UserPreferences` object to replace existing settings. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Injects `HttpClient` for network requests.
    - Injects `API_URL` to establish the base routing context.
    - Constructs the `userUrl` string by appending `/users/me` to the base API URL.
- **Data Path**:
    - **Profile Retrieval**: `getMe()` $\rightarrow$ `http.get(userUrl)` $\rightarrow$ `UserResponse`.
    - **Profile Update**: `updateMe(payload)` $\rightarrow$ `http.patch(userUrl, payload)` $\rightarrow$ `UserResponse`.
    - **Preference Retrieval**: `getPreferences()` $\rightarrow$ `http.get(userUrl + '/preferences')` $\rightarrow$ `UserPreferences`.
    - **Preference Update**: `updatePreferences(payload)` $\rightarrow$ `http.put(userUrl + '/preferences', payload)` $\rightarrow$ `UserPreferences`.
- **Conditional Branching**: No internal conditional branching logic; error handling is delegated to the caller or the global `HttpInterceptor`.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs` (Observable)
- **Internal Modules**: 
    - `[UpdateUserRequest](/AgentDocs/app/api/models/omega-api.models.md)`
    - `[UserPreferences](/AgentDocs/app/api/models/omega-api.models.md)`
    - `[UserResponse](/AgentDocs/app/api/models/omega-api.models.md)`
    - `[API_URL](/AgentDocs/app/api/api-url.token.md)`
- **External Packages**: `@angular/core`, `@angular/common/http`