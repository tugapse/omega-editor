## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CookieService | editor/services/cookie.service |

This component provides a dedicated service layer for managing HTTP cookies within the application environment. Its primary responsibility is to encapsulate the logic for setting, retrieving, and deleting cookies, abstracting the direct manipulation of `document.cookie` from the rest of the application logic.

As a service, `CookieService` acts as a utility layer, providing persistence mechanisms for client-side state that needs to survive page reloads. It is designed to be injected throughout the application, allowing other components to interact with cookie management without needing direct knowledge of browser APIs.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| setCookie | Method | Sets a cookie with a specified name, value, and optional expiration in days. |
| getCookie | Method | Retrieves the value of a cookie by its name. Returns null if the cookie is not found. |
| deleteCookie | Method | Deletes a cookie by setting its expiration to a past date. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `setCookie` method constructs the cookie string, calculating an expiration date if `days` is provided. `getCookie` iterates through the semicolon-separated cookie string to find a match. `deleteCookie` forces deletion by setting a negative `Max-Age`.
- **Side Effects:** Mutates the global `document.cookie` state, which is a direct interaction with the browser's global state.
- **Error Handling:** The methods rely on standard JavaScript behavior; no explicit try/catch blocks are implemented for cookie manipulation errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None