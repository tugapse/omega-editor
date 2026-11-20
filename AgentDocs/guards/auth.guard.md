## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | authGuard |
| Source file | auth.guard.ts |

The **authGuard** is a functional route guard implemented within the Angular framework to enforce security constraints on specific application routes. Its primary purpose is to intercept navigation attempts and verify the authentication status of the user before allowing access to protected resources.

**Functional Mission**
The primary responsibility of **authGuard** is to act as a gatekeeper for the application's routing system. It solves the problem of unauthorized access to sensitive views by evaluating the current session state via the `AuthService`. If a user is not authenticated, the guard prevents the requested navigation and instead redirects the user to the login interface.

**System Context & Integration**
This component sits within the routing middleware layer of the application. It integrates closely with the `AuthService` to query the user's authentication state and utilizes the `Router` to manage navigation redirects. It serves as a critical security checkpoint that ensures downstream components and views are only rendered for valid, authenticated sessions, thereby maintaining the integrity of the application's security model.

- **INTERNAL REFERENCES**: [AuthService](/AgentDocs/app/api/services/auth.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `/login` (Default: `'/login'`)  The URL path used for redirection when authentication fails.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `authGuard` | CanActivateFn | Evaluates route access permissions based on authentication status. |

## 4. Execution Logic & Flow
- **Initialization**: The guard is invoked by the Angular Router during a navigation event. It uses `inject()` to retrieve instances of `AuthService` and `Router` from the dependency injection container.
- **Data Path**: 
    1. **Input**: Receives `route` (ActivatedRouteSnapshot) and `state` (RouterStateSnapshot).
    2. **Processing**: Calls `authService.isLoggedIn()` to check the current authentication state.
    3. **Output**: Returns `true` (boolean) to permit navigation, or a `UrlTree` to trigger a redirect.
- **Conditional Branching**:
    - **IF** `authService.isLoggedIn()` returns `true`: The guard returns `true`, allowing the user to proceed to the requested route.
    - **ELSE**: The guard executes `router.parseUrl('/login')`, returning a `UrlTree` that forces the router to redirect the user to the login page.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [AuthService](/AgentDocs/app/api/services/auth.service.md)
- **External Packages**: 
    - `@angular/core`
    - `@angular/router`