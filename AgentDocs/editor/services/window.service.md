## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | WindowService |
| Source file | window.service.ts |

The **WindowService** acts as the centralized state orchestrator for the multi-window management system within the editor. It is responsible for maintaining the lifecycle of all active UI windows, managing their stacking order via dynamic z-index assignment, and tracking which window currently holds user focus.

By utilizing reactive patterns, the service provides a single source of truth for the windowing environment. This allows decoupled UI components to reactively render window containers, handle focus transitions, and respond to window closures without direct inter-component dependency.

**Functional Mission**
The primary mission of **WindowService** is to manage the collection of `WindowConfig` objects and provide a predictable mechanism for opening, focusing, and closing windows. It solves the problem of complex UI layering and focus management in a multi-window workspace by automating z-index increments and ensuring a valid "active" window is always identified.

**System Context & Integration**
This service serves as a critical infrastructure layer for the editor's workspace. It integrates with [WindowConfig](/AgentDocs/editor/interfaces/window.md) to define the shape of window data. Downstream, components responsible for rendering the workspace or individual window frames subscribe to `windows$` and `activeWindowId$` to synchronize the visual state with the underlying service state. It acts as a bridge between user interaction (clicks/closes) and the global UI state.

- **INTERNAL REFERENCES**: [WindowConfig](/AgentDocs/editor/interfaces/window.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `zIndexCounter` (Default: `100`)  The base integer used to start the incremental z-index assignment for new or focused windows.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `windows$` | Observable | Provides a stream of the current array of all open `WindowConfig` objects. |
| `activeWindowId$` | Observable | Provides a stream of the unique ID of the currently focused window (or `null`). |
| `open(config)` | Method | Generates a unique ID and highest z-index for a new window, then adds it to the state and focuses it. |
| `focus(id)` | Method | Updates the z-index of a specific window to the highest current value and sets it as the active window. |
| `close(id)` | Method | Removes a window from the state and automatically shifts focus to the next highest z-index window. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Initializes `windowsSubject` with an empty array.
    - Initializes `activeWindowIdSubject` with `null`.
    - Sets `zIndexCounter` to `100`.
- **Data Path**:
    - **Open**: `Omit<WindowConfig, 'id' | 'zIndex'>` $\rightarrow$ `crypto.randomUUID()` + `++zIndexCounter` $\rightarrow$ `WindowConfig[]` (via `windowsSubject`).
    - **Focus**: `id` $\rightarrow$ Map existing array $\rightarrow$ Increment `zIndex` for target $\rightarrow$ Update `activeWindowIdSubject`.
    - **Close**: `id` $\rightarrow$ Filter array $\rightarrow$ If active window was closed, find `max(zIndex)` in remaining $\rightarrow$ Update subjects.
- **Conditional Branching**:
    - `focus(id)`: If the requested `id` is already the `activeWindowId`, the function returns early to prevent redundant state emissions.
    - `close(id)`: 
        - If the closed window was the active one and others remain, it performs a `reduce` operation to find the window with the highest `zIndex` to become the new active window.
        - If no windows remain after closure, `activeWindowIdSubject` is set to `null`.

## 5. Resource Dependencies
- **Standard Libraries**: `crypto` (for UUID generation)
- **Internal Modules**: 
    - [WindowConfig](/AgentDocs/editor/interfaces/window.md)
- **External Packages**: 
    - `@angular/core` (Injectable)
    - `rxjs` (BehaviorSubject, Observable)