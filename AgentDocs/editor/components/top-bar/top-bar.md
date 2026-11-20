## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | TopBar |
| Source file | top-bar.ts |

The **TopBar** component serves as the primary global navigation and control interface for the Omega Editor. It provides users with high-level access to essential editor functions, including scene playback controls (Play, Pause, Stop), view switching (Assets, Code Editor), and user session management (Profile, Logout).

**Functional Mission**
The primary responsibility of **TopBar** is to act as a command orchestration layer for the editor's top-level state. It abstracts complex service callssuch as scene manipulation via the `EditorService` or central view transitions via the `EditorStateService`into a simplified, user-facing toolbar.

**System Context & Integration**
**TopBar** sits at the highest level of the editor's UI hierarchy. It integrates deeply with the application's state management and authentication systems. It communicates playback commands to [EditorService](/AgentDocs/editor/services/editor.service.md), manages the visibility of central workspace modules through [EditorStateService](/AgentDocs/editor/services/editor-state.service.md), and facilitates entity inspection by triggering events in the [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md). Additionally, it handles user identity by interfacing with [AuthService](/AgentDocs/app/api/services/auth.service.md) and [UserService](/AgentDocs/app/api/services/user.service.md).

- **INTERNAL REFERENCES**: 
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)
    - [AuthService](/AgentDocs/app/api/services/auth.service.md)
    - [UserService](/AgentDocs/app/api/services/user.service.md)
    - [ThemeSelector](/AgentDocs/editor/components/theme-selector/theme-selector.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `this.isLoggedIn()` (via `authService.isLoggedIn`)  Determines if the user session is active to fetch profile data.
- `this.userService.getMe()` (via `userService.getMe`)  Retrieves the current authenticated user's profile information.

**Hardcoded Constants:**
- `assets` (via `setCentralView`)  String identifier for the assets view state.
- `code` (via `setCentralView`)  String identifier for the code editor view state.
- `/login` (via `router.navigate`)  Route path for the authentication redirect.
- `/home` (via `router.navigate`)  Route path for the home dashboard redirect.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `scene` | `@Input()` | The current active `Scene` instance being edited. |
| `isEditorPaused` | `@Input()` | Boolean flag indicating if the editor simulation is currently paused. |
| `toggleFullscreen` | `@Output()` | Event emitted to request a fullscreen toggle of the editor interface. |
| `showAssets()` | Method | Updates `EditorStateService` to display the assets view. |
| `isAssetsActive()` | Method | Returns true if the current central view is set to "assets". |
| `onPlay()` | Method | Requests the `EditorService` to start scene playback. |
| `onPause()` | Method | Requests the `EditorService` to pause scene playback. |
| `onStop()` | Method | Requests the `EditorService` to stop scene playback. |
| `onCodeEditor()` | Method | Updates `EditorStateService` to display the code editor view. |
| `isLoggedIn()` | Method | Checks authentication status via `AuthService`. |
| `onLogout()` | Method | Terminates user session and redirects to the login page. |
| `inspectCamera()` | Method | Selects the editor's camera entity within the `SceneTreeService`. |
| `goHome()` | Method | Navigates the user to the application home route. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Component initializes with `scene` and `isEditorPaused` inputs.
    2. `ngOnInit` checks `isLoggedIn()`.
    3. If authenticated, calls `userService.getMe()` and subscribes to populate the `user` property with `UserResponse` data.
- **Data Path**: 
    - **Input**: `Scene` object $\rightarrow$ **Processing**: `onPlay`/`onPause`/`onStop` $\rightarrow$ **Output**: `EditorService` command execution.
    - **Input**: `AuthStatus` $\rightarrow$ **Processing**: `userService.getMe()` $\rightarrow$ **Output**: `user` object population.
- **Conditional Branching**:
    - **Authentication Check**: If `isLoggedIn()` is true, proceed to fetch user data; otherwise, skip user fetching.
    - **Logout Flow**: Upon successful logout subscription, the `user` object is cleared and the router redirects to `/login`.

## 5. Resource Dependencies
- **Standard Libraries**: `@angular/core`, `@angular/common`, `@angular/router`
- **Internal Modules**: 
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [AuthService](/AgentDocs/app/api/services/auth.service.md)
    - [UserService](/AgentDocs/app/api/services/user.service.md)
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)
    - [ThemeSelector](/AgentDocs/editor/components/theme-selector/theme-selector.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
- **External Packages**: `omega-game-engine` (Scene types)