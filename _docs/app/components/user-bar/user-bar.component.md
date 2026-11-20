## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| UserBarComponent | [user-bar](/app/components/user-bar/user-bar.component.md) |

This component is responsible for displaying the currently authenticated user's information within the application's user bar interface. Its primary function is to manage the user's session state, fetching user details upon initialization if the user is logged in, and providing a mechanism for the user to log out.

Architecturally, `UserBarComponent` acts as a presentation layer component that orchestrates interactions with core application services. It relies heavily on `AuthService` to check login status and manage session lifecycle, and `UserService` to retrieve specific user data via API calls. It integrates UI elements like `ThemeSelector` to provide configuration options to the user.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `user` | Property | Holds the `UserResponse` object for the currently logged-in user, or `undefined` if not logged in. |
| `isLoggedIn` | Method | Checks the authentication service to determine if a user is currently logged in. |
| `onLogout` | Method | Initiates the logout process via `AuthService`, clears the local user state, and redirects the user to the login page. |

## 3. Implementation Details & Side Effects
- **Core Logic:** Upon initialization (`ngOnInit`), the component checks the authentication status. If logged in, it calls `userService.getMe()` to fetch the user data and populates the `user` property. The `onLogout` method triggers the logout subscription, clears the user state, and programmatically navigates to `/login`.

- **Side Effects:** Interacts with the network via `AuthService` and `UserService` to check login status and fetch user data. It also mutates the component's internal state (`this.user`) and triggers navigation via `Router`.

- **Error Handling:** If `userService.getMe()` fails (e.g., due to an expired or invalid token), the component catches the error and automatically calls `authService.logout()` to invalidate the session.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [AuthService](/src/app/api/services/auth.service.md) [UserService](/src/app/api/services/user.service.md) [UserResponse](/src/app/api/models/omega-api.models.md) [Icon](/src/app/components/icon/icon.md) [ThemeSelector](/src/app/components/theme-selector/theme-selector.md)