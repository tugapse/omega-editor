## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CookieService |
| Source file | cookie.service.ts |

The **CookieService** is a low-level utility service designed to provide a structured interface for interacting with the browser's `document.cookie` API. It abstracts the complexities of string parsing, expiration date calculation, and cookie deletion, offering a clean, imperative API for managing client-side persistence.

**Functional Mission**
The primary responsibility of the **CookieService** is to manage the lifecycle of HTTP cookies within the browser environment. It solves the problem of manual string manipulation required by the native `document.cookie` property, ensuring that cookies are set with correct paths, expiration dates, and formatted correctly for retrieval.

**System Context & Integration**
As a `providedIn: 'root'` service, this component acts as a singleton utility available throughout the entire application. It is typically utilized by higher-level services to persist user preferences, session tokens, or editor configurations. For instance, it may work in tandem with [editor.settings](/AgentDocs/editor/services/editor.settings.md) or [editor-state.service.md](/AgentDocs/editor/services/editor-state.service.md) to ensure that the user's workspace state survives page reloads.

- **INTERNAL REFERENCES**: [editor.settings](/AgentDocs/editor/services/editor.settings.md), [editor-state.service.md](/AgentDocs/editor/services/editor-state.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `path=/` (Default: `/`)  Ensures cookies are accessible across the entire domain.
- `Max-Age=-99999999` (Default: `-99999999`)  Used in `deleteCookie` to force immediate expiration.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `setCookie` | Func | Creates or updates a cookie with an optional expiration period in days. |
| `getCookie` | Func | Parses the `document.cookie` string to retrieve the value associated with a specific key. |
| `deleteCookie` | Func | Removes a cookie by setting its `Max-Age` to a negative value. |

## 4. Execution Logic & Flow
- **Initialization**: The service is instantiated as a singleton upon application bootstrap via Angular's dependency injection.
- **Data Path**:
    - **Set**: `name` + `value` + `days` $\rightarrow$ Calculate UTC expiration $\rightarrow$ Construct cookie string $\rightarrow$ Assign to `document.cookie`.
    - **Get**: `name` $\rightarrow$ Split `document.cookie` by `;` $\rightarrow$ Iterate and trim whitespace $\rightarrow$ Match `name=` prefix $\rightarrow$ Return substring value.
    - **Delete**: `name` $\rightarrow$ Construct string with `Max-Age=-99999999` $\rightarrow$ Assign to `document.cookie`.
- **Conditional Branching**:
    - In `setCookie`: If `days` is provided, an expiration timestamp is calculated; otherwise, the cookie is treated as a session cookie.
    - In `getCookie`: Iterates through the cookie array; if no match is found after the loop, returns `null`.

## 5. Resource Dependencies
- **Standard Libraries**: `Date` (via global scope)
- **Internal Modules**: 
    - No internal modules matched from MANIFEST.
- **External Packages**: `@angular/core`