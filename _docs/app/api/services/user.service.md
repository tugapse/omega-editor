## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| UserService | app/api/services/user.service |

This service is responsible for encapsulating all business logic related to interacting with the authenticated user's profile and preferences via the backend API. Its primary responsibility is to abstract HTTP requests, providing clean, observable methods for retrieving and modifying user data without exposing the underlying HTTP implementation details to consuming components.

Architecturally, `UserService` functions as a dedicated data access layer or service layer within the application. It relies on the injected `HttpClient` to perform network operations and utilizes models defined in `../models/omega-api.models` for data structure consistency. It acts as the intermediary between the application logic and the external API endpoints defined by `API_URL`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| getMe | Method | Retrieves the authenticated user's profile by making a GET request to `/users/me`. Returns an Observable of `UserResponse`. |
| updateMe | Method | Partially updates the user's profile by sending a PATCH request to `/users/me`. Accepts an `UpdateUserRequest` payload and returns an Observable of `UserResponse`. |
| getPreferences | Method | Retrieves the user's current preferences by making a GET request to `/users/me/preferences`. Returns an Observable of `UserPreferences`. |
| updatePreferences | Method | Fully replaces the user's preferences by sending a PUT request to `/users/me/preferences`. Accepts a complete `UserPreferences` payload and returns an Observable of `UserPreferences`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service utilizes dependency injection to obtain `HttpClient` and the base `API_URL`. Each public method constructs the appropriate endpoint URL and delegates the request (GET, PATCH, PUT) to the injected `HttpClient`, returning the resulting `Observable`.
- **Side Effects:** Interacts with the network via `HttpClient` to communicate with the backend API.
- **Error Handling:** Relies on RxJS Observables; standard HTTP error handling (e.g., catching network failures or non-2xx responses) must be implemented by the consumer of the service methods.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- `API_URL`  The base URL for the backend API. It is injected via `inject(API_URL)` and is assumed to be configured elsewhere.

**Module Dependencies:**
- **Standard/External:** `HttpClient`, `Observable` (from `@angular/common/http` and `rxjs`).
- **Internal:** [omega-api.models](/src/app/models/omega-api.models.md)