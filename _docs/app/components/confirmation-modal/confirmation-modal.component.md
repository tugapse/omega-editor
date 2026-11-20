## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ConfirmationModalComponent | [confirmation-modal](/app/components/confirmation-modal/confirmation-modal.component.md) |

This component is responsible for displaying a user confirmation prompt, allowing the user to decide whether to proceed with an action or cancel it. It manages the lifecycle of this modal, subscribing to a global request stream to display the correct prompt when needed.

Architecturally, this component functions as a presentation layer UI component. It relies heavily on the [ConfirmationService](/app/services/confirmation.service.md) to manage the state of the confirmation request and to relay the user's final decision back to the application logic.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `confirm()` | Method | Triggers the confirmation action by calling `confirmationService.respond(true)` and then closes the modal. |
| `cancel()` | Method | Triggers the cancellation action by calling `confirmationService.respond(false)` and then closes the modal. |
| `close()` | Method | Resets the internal state by setting `request` to null, effectively hiding the modal. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by subscribing to `confirmationService.confirmationRequest$`. When a request is received, the `request` property is updated. The `confirm` and `cancel` methods call the service's `respond` method with a boolean value before calling `close()` to clear the UI state.
- **Side Effects:** Interacts with external/global state by subscribing to and calling methods on the `ConfirmationService`, which manages the application's confirmation state.
- **Error Handling:** No explicit error handling (try/catch blocks) is implemented for subscription errors; standard RxJS error propagation is assumed.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** RxJS (Subscription)
- **Internal:** [ConfirmationService](/app/services/confirmation.service.md)