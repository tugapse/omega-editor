## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| WindowService | editor/services/window.service |

This service is responsible for managing the state and lifecycle of multiple editor windows within the application. Its primary responsibility is to maintain a collection of active window configurations, track which window is currently focused, and manage the visual stacking order (z-index) of these windows as user interactions occur.

Architecturally, `WindowService` functions as a central state management utility. It holds the canonical list of windows via `windows$` and the currently active window ID via `activeWindowId$`. It interacts with the application state by providing methods like `open`, `focus`, and `close`, which modify the internal state and notify subscribers of changes, fitting the role of a core application service.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| WindowService | Class | Manages the collection, focus, and stacking order of editor windows. |
| windows$ | Observable | Stream emitting the current array of all active `WindowConfig` objects. |
| activeWindowId$ | Observable | Stream emitting the ID of the currently focused window, or `null`. |
| open | Method | Creates a new window instance, assigns it a unique ID and the highest available z-index, and adds it to the active list, automatically focusing it. |
| focus | Method | Sets a specific window as the active window, ensuring it receives the highest possible z-index to bring it to the front. |
| close | Method | Removes a window from the active list. If the closed window was active, it automatically focuses the next highest-stacked window or sets the active ID to `null`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service maintains two primary state streams: one for the list of all windows and one for the active window ID. When a window is opened, it receives a unique ID and the next sequential z-index. Focusing a window involves iterating over all windows and updating the target window's z-index to the current maximum. Closing a window triggers logic to determine the next active window based on the remaining windows' z-indices.

- **Side Effects:** Mutates internal state managed via RxJS `BehaviorSubject`s, which propagates changes to subscribers.

- **Error Handling:** The `close` method includes logic to handle the edge case where the last window is closed, correctly setting `activeWindowIdSubject` to `null`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `rxjs`
- **Internal:** [WindowConfig](/editor/interfaces/window.md)