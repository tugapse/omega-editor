## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ApiUrlToken | /app/api/api-url.token.md |

This file defines an Angular `InjectionToken` specifically designed to hold and provide the base URL for the Omega API. Its primary responsibility is to decouple the API endpoint configuration from the service logic, allowing the application to easily switch between different backend environments (e.g., staging, production) without code changes.

This token serves as a configuration mechanism within the application's dependency injection system. It is intended to be consumed by services that require network access, such as those interacting with the API, ensuring that the correct base URL is injected at runtime.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| API_URL | InjectionToken | An injection token used to provide the string value representing the application's API base URL. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The file initializes a new `InjectionToken` instance, setting its key to `'app.api.url'` and specifying that it expects a `string` value.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** None