## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | OmegaEngineService |
| Source file | omega-engine.service.ts |

The **OmegaEngineService** acts as the dynamic runtime orchestrator for the game engine within the editor environment. Its primary purpose is to facilitate the hot-reloading and lifecycle management of the `Engine` instance by fetching compiled code bundles from a remote API and injecting them into the running application context.

**Functional Mission**
The mission of **OmegaEngineService** is to bridge the gap between the web-based editor and the compiled game logic. It solves the problem of runtime code injection, allowing developers to see changes in their game logic without a full browser refresh by dynamically importing JavaScript modules and managing the instantiation and destruction of the `Engine` lifecycle.

**System Context & Integration**
This service sits at a critical junction between the API layer and the core execution environment. It utilizes `API_URL` ([API_URL](/AgentDocs/app/api/api-url.token.md)) to locate project bundles and relies on local authentication tokens to authorize these requests. Once a bundle is fetched, it performs a "linker" operation to validate that the exported `Game` class conforms to the expected `Engine` interface. Upon successful loading, it manages the transition by destroying the previous `Engine` instance and initializing the new one, notifying the rest of the system via `engineReloaded` and `reloadEngineRequested` event emitters.

- **INTERNAL REFERENCES**: [API_URL](/AgentDocs/app/api/api-url.token.md), [Engine](/AgentDocs/engine/logger.md) (Note: Engine is an external dependency from `omega-game-engine`).

## 2. Environment & Configuration
**Environment Lookups:**
- `apiUrl` (via `inject(API_URL)`)  Provides the base gateway URL for API communication.
- `localStorage.getItem("omega-auth-token")`  Retrieves the bearer token required for bundle authorization.

**Hardcoded Constants:**
- `"/api"` (Default: `"/api"`)  Suffix used to normalize the base gateway URL if it does not already end with the API path.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `isReloadingEngine` | Getter (boolean) | Exposes the current loading state of the engine. |
| `currentEngine` | Getter (Engine \| null) | Exposes the currently active engine instance. |
| `reloadEngineRequested` | EventEmitter | Signals that a reload process has been initiated. |
| `engineReloaded` | EventEmitter\<boolean\> | Signals the completion of a reload, passing success/failure status. |
| `onReloadEngine` | Method (async) | The core orchestration logic for fetching, validating, and booting the engine. |

## 4. Execution Logic & Flow
- **Initialization**: Sets `_isReloadingEngine` to `false` and `_currentEngine` to `null`.
- **Data Path**: 
    1. **Input**: `projectId` (string).
    2. **Processing**: 
        - Normalizes `apiUrl` to include `/api`.
        - Constructs a `bundleUrl` containing the `projectId`, `authToken`, and a cache-busting timestamp (`t`).
        - Performs a dynamic `import()` of the remote module.
        - Validates the existence of a `Game` export.
        - Validates that `Game` is an instance of `Engine`.
        - Destroys the existing `_currentEngine` if present.
        - Instantiates the new `Game` and calls `registerDependencies()`.
    3. **Output**: Returns the new `Engine` instance or `null` on failure.
- **Conditional Branching**:
    - **Missing Project ID**: Throws error if `projectId` is falsy.
    - **Missing Auth Token**: Throws error if `localStorage` token is missing.
    - **Linker Error (Missing Export)**: If `gameModule.Game` is undefined, emits `false` and aborts.
    - **Linker Error (Type Mismatch)**: If `Game` is not an instance of `Engine`, emits `false` and aborts.
    - **Catch Block**: Captures runtime injection faults, logs a critical error, and emits `false`.

## 5. Resource Dependencies
- **Standard Libraries**: `Date` (for cache busting).
- **Internal Modules**: 
    - [API_URL](/AgentDocs/app/api/api-url.token.md)
- **External Packages**: 
    - `omega-game-engine` (Provides the `Engine` base class).
    - `@angular/core` (Provides `EventEmitter`, `inject`, `Injectable`).