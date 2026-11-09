## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| authGuard | guards/auth.guard.md |

This guard is responsible for enforcing authentication checks on specific routes within the application. Its primary function is to determine, before a route is activated, whether the currently logged-in user possesses the necessary credentials to view the requested page. If the user is not authenticated, the guard prevents navigation to the protected route.

Architecturally, this component acts as a routing middleware or gatekeeper. It leverages the `AuthService` to query the current authentication state and utilizes the `Router` service to programmatically redirect the user to the `/login` page if the authentication check fails.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| authGuard | CanActivateFn | A function that checks the user's login status via `AuthService.isLoggedIn()`. Returns `true` if authenticated, or a `UrlTree` redirecting to `/login` otherwise. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The guard injects `AuthService` and `Router`. It executes `authService.isLoggedIn()`. If this returns true, the guard allows navigation by returning `true`. If false, it returns a `UrlTree` object instructing the router to navigate to the `/login` path.

- **Side Effects:** Interacts with the application state by calling methods on `AuthService` and triggers navigation via the `Router` service.

- **Error Handling:** No explicit error handling is implemented; the guard relies on the underlying services to manage authentication state and routing errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [AuthService](/app/api/services/auth.service.md)