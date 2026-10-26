## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ToastService |
| Source file | toastr.service.ts |

The **ToastService** is a centralized notification management utility designed to provide non-intrusive, transient feedback to the user within the Omega Editor interface. It leverages Angular Signals to maintain a reactive state of active notifications, allowing UI components to subscribe to and render toast messages dynamically as they are triggered.

**Functional Mission**
The primary responsibility of the **ToastService** is to manage the lifecycle of ephemeral UI alerts. It solves the problem of asynchronous user feedback by providing a standardized way to queue, display, and automatically expire "success", "error", and "info" messages, ensuring that the application can communicate state changes or errors without interrupting the user's workflow.

**System Context & Integration**
This service acts as a global provider within the application's dependency injection tree. It serves as a bridge between business logic (which triggers notifications) and the presentation layer (which renders them). While it maintains the state of active toasts via a signal, it is designed to be consumed by UI components that listen to the `toasts` signal to update the DOM. It operates independently of other core services but provides critical UX feedback that complements services like [Asset Explorer Service](/AgentDocs/editor/components/asset-explorer/assets-explorer.service.md) or [Auth Service](/AgentDocs/app/api/services/auth.service.md) when operations succeed or fail.

- **INTERNAL REFERENCES**: [ToastService](/AgentDocs/editor/services/toastr.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `duration` (Default: `4000`)  The default time in milliseconds a standard toast remains visible.
- `error duration` (Default: `6000`)  The specific duration applied to error-type messages to allow more time for user reading.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ToastMessage` | Interface | Defines the structure of a toast object: `id` (number), `message` (string), and `type` ('success' \| 'error' \| 'info'). |
| `toasts` | Signal | A reactive signal containing the current array of active `ToastMessage` objects. |
| `show` | Method | The core engine that generates a unique ID, updates the signal state, and schedules the removal of the toast. |
| `success` | Method | Convenience wrapper for `show` using the 'success' type. |
| `error` | Method | Convenience wrapper for `show` using the 'error' type with an extended 6000ms duration. |
| `info` | Method | Convenience wrapper for `show` using the 'info' type. |

## 4. Execution Logic & Flow
- **Initialization**: The service initializes `toasts` as an empty signal array and sets `nextId` to `0` to ensure unique identification for every message.
- **Data Path**: 
    1. **Input**: A message string, a type, and an optional duration are passed to `show()`.
    2. **Processing**: 
        - A unique `id` is incremented from `nextId`.
        - The `toasts` signal is updated using the spread operator to append the new `ToastMessage`.
        - A `setTimeout` is initialized using the provided `duration`.
    3. **Output**: The `toasts` signal emits a new array containing the added toast, triggering UI updates.
- **Conditional Branching**: 
    - The `error` method overrides the default `duration` parameter to `6000`ms.
    - The `setTimeout` callback executes a filter operation on the `toasts` signal to remove the specific toast by its `id` once the timer expires.

## 5. Resource Dependencies
- **Standard Libraries**: `setTimeout` (Web API)
- **Internal Modules**: 
    - None identified.
- **External Packages**: 
    - `@angular/core` (Injectable, signal)