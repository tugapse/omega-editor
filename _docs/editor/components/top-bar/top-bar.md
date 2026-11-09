## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TopBar | editor/components/top-bar/top-bar.md |

This component serves as the primary control panel interface located at the top of the editor view. Its main responsibility is to provide users with immediate access to core editor functionalities such as scene playback controls (Play, Pause, Stop), switching the central view between assets and code, and managing user session state (login/logout).

Architecturally, `TopBar` functions as a high-level UI component that orchestrates interactions between several core services. It consumes state from [EditorStateService](/editor/services/editor-state.service.md) and communicates commands to [EditorService](/editor/services/editor.service.md) based on user input. It also manages user authentication status via [AuthService](/app/api/services/auth.service.md) and displays user information retrieved from [UserService](/app/api/services/user.service.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `scene` | Input | The active `Scene` object being edited. |
| `isEditorPaused` | Input | Boolean indicating if the editor is currently paused. |
| `toggleFullscreen` | Output | Event emitter triggered when the user requests fullscreen mode. |
| `user` | Property | Holds the authenticated `UserResponse` object for the current user. |
| `showAssets()` | Method | Sets the central view state to "assets" using `EditorStateService`. |
| `isAssetsActive()` | Method | Checks if the current central view is set to "assets". |
| `onPlay()` | Method | Requests the scene to begin playing via `EditorService`. |
| `onPause()` | Method | Requests the scene to pause via `EditorService`. |
| `onStop()` | Method | Requests the scene to stop via `EditorService`. |
| `onCodeEditor()` | Method | Sets the central view state to "code" using `EditorStateService`. |
| `isLoggedIn()` | Method | Checks the authentication status using `AuthService`. |
| `onLogout()` | Method | Executes the logout process via `AuthService` and redirects the user. |
| `inspectCamera()` | Method | Emits the editor's camera entity to the scene tree selection mechanism. |
| `goHome()` | Method | Navigates the user to the application home route. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by checking the user's login status. If logged in, it asynchronously fetches the user's profile data. It manages state transitions by calling methods on `EditorService` and `EditorStateService` when playback controls are used.
- **Side Effects:** Interacts with the network via `AuthService` (for login status and logout) and `UserService` (to fetch user details). It mutates the application state managed by `EditorStateService` and triggers navigation via `Router`.
- **Error Handling:** The `onLogout` method handles the asynchronous logout process; if successful, it updates the local `user` state and navigates away.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`, `@angular/common`, `@angular/router`
- **Internal:** [EditorService](/editor/services/editor.service.md), [Scene](/omega-game-engine.md), [Icon](/app/components/icon/icon.md), [EditorStateService](/editor/services/editor-state.service.md), [AuthService](/app/api/services/auth.service.md), [UserService](/app/api/services/user.service.md), [UserResponse](/app/api/models/omega-api.models.md), [SceneTreeService](/editor/services/scene-tree.service.md), [ThemeSelector](/theme-selector/theme-selector.md)