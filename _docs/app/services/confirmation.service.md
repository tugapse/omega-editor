## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ConfirmationService | app/services/confirmation.service |

This service manages the lifecycle of user confirmation prompts within the application. Its primary responsibility is to provide a standardized, observable mechanism for displaying a modal-like confirmation dialog, allowing the calling component to await a definitive user response (confirm or cancel). It abstracts the presentation logic, focusing purely on the request and response flow.

This component functions as a centralized utility service, fitting into the application's service layer. It acts as a mediator between UI components that need to prompt the user and the mechanism that delivers the final boolean result. It relies on RxJS Subjects to manage asynchronous state changes and communication across the application boundary.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ConfirmationRequest | Interface | Defines the structure for a confirmation prompt, including title, message, and optional custom text for confirmation/cancellation. |
| confirmationRequest$ | Observable | An observable stream exposing all confirmation requests that have been initiated. |
| confirm | Method | Initiates a new confirmation prompt. It takes a `ConfirmationRequest` and returns an `Observable<boolean>` that resolves when the user responds. |
| respond | Method | Informs the service of the user's choice (true for confirm, false for cancel), completing the active confirmation observable stream. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service uses two RxJS Subjects: `confirmationRequestSubject` to broadcast all requests, and `currentResultSubject` to manage the state of the *currently active* prompt. When `confirm` is called, it sets up a new `currentResultSubject` and pushes the request. When `respond` is called, it pushes the result to that specific subject and completes it, effectively resolving the promise/observable returned by `confirm`.

- **Side Effects:** None. The service manages internal state via RxJS Subjects but does not interact with the network, filesystem, or external global state.

- **Error Handling:** The service relies on the completion of the `currentResultSubject` to signal the end of a prompt. If `respond` is called when no active subject exists, the call is silently ignored.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** RxJS
- **Internal:** None