## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ToastService | editor/services/toastr.service |

This service is responsible for managing and displaying transient notification messages (toasts) within the application interface. It provides a centralized mechanism for components to request visual feedback to the user, such as success confirmations, error alerts, or general information updates.

As a core utility service, `ToastService` acts as a state manager for UI feedback. It maintains an internal array of active toasts, allowing other parts of the application to trigger notifications without needing direct knowledge of the UI rendering mechanism. It integrates with Angular's dependency injection system to be globally accessible.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ToastMessage | Interface | Defines the structure for a single toast notification, including its unique ID, message content, and type. |
| ToastService | Class | Manages the lifecycle and display of toast notifications. |
| show | Method | Displays a new toast message with customizable type and duration. |
| success | Method | Shortcut method to display a success toast message. |
| error | Method | Shortcut method to display an error toast message, defaulting to a longer display time. |
| info | Method | Shortcut method to display an informational toast message. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service uses an internal `signal` to hold the array of active `ToastMessage` objects. When `show` is called, a new toast is added to this signal. A `setTimeout` is then scheduled to automatically remove the toast from the signal after the specified duration, ensuring toasts are ephemeral.
- **Side Effects:** Mutates the internal state (`this.toasts`) which is observable by consuming components. It uses `setTimeout` to schedule asynchronous state updates.
- **Error Handling:** No explicit error handling is implemented within the service methods; failures in the underlying `setTimeout` or signal updates are not caught or managed by this service.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** None