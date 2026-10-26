## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ConfirmationService |
| Source file | confirmation.service.ts |

The **ConfirmationService** acts as a centralized orchestration layer for managing asynchronous user confirmation workflows within the application. It provides a decoupled mechanism for triggering modal-based decision points, allowing various parts of the system to request user validation without being tightly coupled to specific UI implementations or modal components.

**Functional Mission**
The primary responsibility of the **ConfirmationService** is to manage the lifecycle of a confirmation request. It solves the problem of "callback hell" and tight coupling in UI interactions by providing an `Observable`-based API. When a component needs user confirmation, it calls `confirm()`, receives an observable, and waits for a boolean response, effectively turning a UI interaction into a manageable stream of data.

**System Context & Integration**
This service serves as a bridge between business logic (which requires a decision) and the UI layer (which presents the decision). It is designed to be consumed by components such as [ConfirmationModal](/AgentDocs/app/components/confirmation-modal/confirmation-modal.component.md), which subscribe to the `confirmationRequest$` stream to display the appropriate dialog. Once the user interacts with the UI, the modal or the calling component invokes `respond()`, which pushes the result back through the service to the original requester.

- **INTERNAL REFERENCES**: [ConfirmationModal](/AgentDocs/app/components/confirmation-modal/confirmation-modal.component.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `confirmText` (Default: `'Confirm'`)  Fallback text for the confirmation button.
- `cancelText` (Default: `'Cancel'`)  Fallback text for the cancellation button.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ConfirmationRequest` | Interface | Defines the data structure for a request, including `title`, `message`, and optional button labels. |
| `ConfirmationService` | Class | The core service managing the request/response lifecycle via RxJS Subjects. |
| `confirmationRequest$` | Observable | A stream that emits `ConfirmationRequest` objects to be consumed by UI components. |
| `confirm(request: ConfirmationRequest)` | Method | Initiates a new confirmation flow and returns an `Observable<boolean>` representing the user's choice. |
| `respond(result: boolean)` | Method | Completes the current pending request by emitting the user's decision. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Initializes `confirmationRequestSubject` as a `Subject` to broadcast requests.
    - Initializes `currentResultSubject` as `null` to indicate no active pending confirmation.
- **Data Path**:
    1. **Request Phase**: A caller invokes `confirm(request)`.
    2. **Cleanup**: If a previous `currentResultSubject` exists, it is completed to prevent memory leaks/stale subscriptions.
    3. **Setup**: A new `Subject<boolean>` is instantiated as `currentResultSubject`.
    4. **Emission**: The `confirmationRequestSubject` emits the `ConfirmationRequest` payload (with default text applied if necessary).
    5. **Subscription**: The caller receives the `currentResultSubject.asObservable()`.
    6. **Resolution Phase**: A UI component calls `respond(true|false)`.
    7. **Completion**: `currentResultSubject` emits the value, completes, and is reset to `null`.
- **Conditional Branching**:
    - **Text Defaults**: If `request.confirmText` or `request.cancelText` are undefined, the service injects `'Confirm'` and `'Cancel'` respectively.
    - **Active Request Check**: In `respond()`, the logic only executes if `currentResultSubject` is not `null`.

## 5. Resource Dependencies
- **Standard Libraries**: (None)
- **Internal Modules**: 
    - No internal modules identified from the provided MANIFEST.
- **External Packages**: 
    - `@angular/core` (Dependency Injection)
    - `rxjs` (Reactive programming primitives: `Observable`, `Subject`)