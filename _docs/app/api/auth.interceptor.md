## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AuthInterceptor | app/api/auth.interceptor |

This interceptor is responsible for automatically injecting the user's authentication token into every outgoing HTTP request made by the application. Its primary function is to ensure that API calls are properly authenticated by attaching the token in the `Authorization: Bearer <token>` header, thereby securing communication with backend services.

Architecturally, this component acts as a crucial middleware layer within the Angular HTTP client pipeline. It sits between the application services and the network layer, leveraging the `AuthService` to retrieve credentials and the `Router` to manage application flow upon authentication failure.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| AuthInterceptor | Class | Implements `HttpInterceptor`. Intercepts requests to add authorization headers and handles 401 errors by redirecting to the login page. |
| intercept | Method | Processes an outgoing HTTP request. It clones the request to inject the token and pipes the result through error handling logic. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The interceptor checks for an existing token via `authService.getToken()`. If found, it clones the incoming `HttpRequest` and sets the `Authorization` header. It then handles the response stream, specifically catching `HttpErrorResponse` with status 401. If a 401 is detected, it clears the local session via `authService.clearLocalSession()` and navigates the user to `/login` using `router.navigate(['/login'])`.

- **Side Effects:** Interacts heavily with the network (by intercepting HTTP requests), mutates external state (by calling `authService.clearLocalSession()`), and modifies the application state by triggering navigation via `router.navigate()`.

- **Error Handling:** It explicitly catches `HttpErrorResponse`. If the status is 401, it performs a session clear and redirection. In all other error cases, it passes the original error downstream using `throwError(() => error)`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/common/http`, `@angular/core`, `@angular/router`
- **Internal:** [AuthService](/app/api/services/auth.service.md)