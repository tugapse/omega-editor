## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| LoadingService | app/services/loading.service |

This service is responsible for managing a global, application-wide loading indicator. Its primary function is to provide a centralized mechanism to signal when the application is busy performing asynchronous operations, thereby preventing user interaction with potentially unstable states. It controls the visibility and displays a customizable message for this overlay.

This component functions as a core utility service within the application architecture. It encapsulates state management for the loading UI, allowing other parts of the applicationsuch as components or data fetching logicto trigger the display and subsequent hiding of the loading screen without needing direct knowledge of the UI implementation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| visible | Signal | A signal indicating the current visibility state of the loading screen (true if visible, false otherwise). |
| message | Signal | A signal holding the string message currently displayed on the loading screen. |
| show | Method | Activates the global loading screen, setting the message to the provided or default string. |
| hide | Method | Deactivates the loading screen, setting its visibility to false. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service uses Angular Signals (`visible` and `message`) to maintain reactive state. The `show` method updates both the visibility state and the associated message, while `hide` simply toggles the visibility state to false.
- **Side Effects:** Mutates global application state via the exposed signals, which are consumed by UI components.
- **Error Handling:** None explicitly implemented; relies on the caller to handle errors during asynchronous operations before calling `hide()`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** None