## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| OmegaEngineService | app/services/omega-engine.service.md |

This service is responsible for managing the lifecycle of the game engine instance within the application. Its primary responsibility is to dynamically load, initialize, and manage the execution of game modules fetched from a remote backend endpoint. It handles the complex process of fetching a bundled game module based on a provided project ID and instantiating the `Engine` class from that module.

Architecturally, this component functions as a core service layer responsible for runtime dependency injection and dynamic module loading. It acts as the bridge between the application's core logic and the external, dynamically loaded game code. It relies on configuration from [api-url](/app/api/api-url.md) and communicates state changes via its public `EventEmitter`s, such as [reloadEngineRequested](/app/services/omega-engine.service.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| isReloadingEngine | Getter | Returns a boolean indicating if an engine reload process is currently active. |
| currentEngine | Getter | Returns the currently active `Engine` instance, or `null` if none is loaded. |
| reloadEngineRequested | EventEmitter | Emits an event signal when a reload of the engine is requested. |
| engineReloaded | EventEmitter | Emits an event with a boolean indicating the success or failure of the last engine reload attempt. |
| onReloadEngine | Method | Initiates the asynchronous process to fetch and load a new engine instance for a specified project ID. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `onReloadEngine` method first emits a request signal and sets an internal reloading flag. It constructs a dynamic URL to fetch a bundled JavaScript module containing the game logic. It then uses dynamic `import()` to load this module. Upon successful loading, it checks for the exported `Game` class, destroys any existing engine instance, instantiates the new engine, and registers its dependencies before emitting a success event.
- **Side Effects:** Interacts heavily with the network via dynamic `import()` calls to fetch remote bundles. It also reads from `localStorage` to retrieve the authentication token and mutates internal state (`_isReloadingEngine`, `_currentEngine`).
- **Error Handling:** It employs a comprehensive `try...catch` block to handle network failures or module loading errors. Specific checks are in place to validate the presence of a `projectId` and an authentication token. If loading fails at any stage, it logs a critical error, emits `engineReloaded(false)`, and resets the reloading state.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`, `omega-game-engine`
- **Internal:** [api-url](/app/api/api-url.md)