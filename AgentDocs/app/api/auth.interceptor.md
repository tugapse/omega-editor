## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AuthInterceptor |
| Source file | auth.interceptor.ts |

The **AuthInterceptor** serves as a centralized middleware component within the Angular HTTP pipeline. Its primary purpose is to automate the injection of security credentials into outgoing requests and to provide a unified mechanism for handling authentication failures across the entire application.

**Functional Mission**
The mission of the **AuthInterceptor** is to ensure that every outgoing HTTP request is properly authenticated by attaching a Bearer token if one exists, and to act as a global error handler for `401 Unauthorized` responses. By intercepting these errors, it can trigger session cleanup and redirect the user to the login interface, preventing unauthorized access attempts from leaving the application in an inconsistent state.

**System Context & Integration**
This component sits between the application's data services and the backend API. It intercepts all `HttpRequest` objects before they reach the `HttpHandler`. It relies heavily on [AuthService](/AgentDocs/app/api/services/auth.service.md) to retrieve the current session token and to perform local session clearing. When a `401` error is detected, it interacts with the [Router](/AgentDocs/app/app.md) to manage the user's navigation state, effectively transitioning the application from a protected workspace to the [Login Component](/AgentDocs/app/components/login/login.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `401` (Default: `401`)  HTTP status code representing an unauthorized request.
- `Bearer ` (Default: `Bearer `)  String prefix for the Authorization header value.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `AuthInterceptor` | Class | Implements `HttpInterceptor` to manage request decoration and error interception. |
| `intercept` | Method | The core logic loop that clones requests to add headers and pipes error handling logic. |

## 4. Execution Logic & Flow
- **Initialization**: The interceptor is instantiated with injected instances of [AuthService](/AgentDocs/app/api/services/auth.service.md) and the Angular `Router`.
- **Data Path**: 
    1. **Input**: Receives an `HttpRequest`.
    2. **Token Retrieval**: Calls `authService.getToken()`.
    3. **Request Transformation**: If a token is present, the request is cloned to include the `Authorization: Bearer <token>` header.
    4. **Execution**: Passes the (potentially modified) request to the `next` handler.
    5. **Output**: Returns an `Observable<HttpEvent<unknown>>`.
- **Conditional Branching**:
    - **Token Check**: If `token` is truthy, headers are added; otherwise, the original request proceeds.
    - **Error Catching**: If the response stream emits an error:
        - If `error.status === 401`:
            - Calls `authService.clearLocalSession()`.
            - Triggers `router.navigate(['/login'])`.
        - Regardless of status, the error is re-thrown via `throwError` to ensure the calling service can handle specific business logic errors.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs`, `@angular/common/http`, `@angular/router`
- **Internal Modules**: 
    - [AuthService](/AgentDocs/app/api/services/auth.service.md)
- **External Packages**: `rxjs`