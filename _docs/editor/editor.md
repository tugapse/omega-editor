## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Editor | /editor/editor.md |

This component serves as the primary container and orchestrator for the entire editor application interface. Its main responsibility is to manage the lifecycle of the editing environment, including initializing the game engine, loading scenes from assets or storage, and coordinating the various UI panels and behaviors required for interactive scene manipulation.

Architecturally, the `Editor` component acts as a high-level controller, integrating numerous specialized services and sub-components. It relies heavily on [EditorService](/editor/editor.md) for core engine operations, [EditorSettingsService](/editor/editor.md) for configuration management, and manages the state flow between the [SceneTree](/editor/scene-tree/scene-tree.md), [Canvas](/editor/components/canvas/canvas.md), and various behavioral systems like [GizmosBoxBehaviour](/editor/behaviours/scene-editor/gizmos-behaviour.md).

## 2. Public API & Interfaces
This file contains no public exports.

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by subscribing to various state change events from services like [SceneTreeService](/editor/services/scene-tree.service.md) and [EditorService](/editor/services/editor.service.md). Scene loading is triggered via route parameters, fetching serialized data from [AssetService](/editor/api/services/asset.service.md). Once loaded, it initializes editor behaviors (Grid, Gizmos, Picker) and manages the rendering loop via event subscriptions. State persistence is handled by saving the scene object to `sessionStorage` on Ctrl+S.

- **Side Effects:** Interacts heavily with the network via [AssetService](/editor/api/services/asset.service.md) for loading and saving scene assets. It reads and writes to `sessionStorage` for local scene persistence. It mutates the global state via `(window as any)["omegaEditor"] = this;` and interacts with the underlying WebGL context.

- **Error Handling:** Catches errors during scene JSON parsing and asset loading, logging them via [EngineLogger](/src/engine/logger.md) and hiding the loading indicator. It also handles navigation to an invalid project route if parameters are missing during initialization.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `rxjs`, `angular/core`, `angular/router`.
- **Internal:** [EditorService](/editor/services/editor.service.md), [SceneTreeService](/editor/services/scene-tree.service.md), [EditorSettingsService](/editor/services/editor.settings.md), [EditorStateService](/editor/services/editor-state.service.md), [WindowService](/editor/services/window.service.md), [AssetService](/editor/api/services/asset.service.md), [LoadingService](/src/app/services/loading.service.md), [EditorGridBehaviour](/editor/behaviours/scene-editor/grid-behaviour.md), [GizmosBoxBehaviour](/editor/behaviours/scene-editor/gizmos-behaviour.md), [EditorEntityPicker](/editor/behaviours/scene-editor/entitypick.behaviour.md), [Scene](/omega-game-engine/scene.md), [SceneEntity](/omega-game-engine/scene-entity.md), [JsonSerializedData](/omega-game-engine/json-serialized-data.md), [SceneManager](/omega-game-engine/scene-manager.md), [Colors](/omega-game-engine/colors.md), [Engine](/omega-game-engine/engine.md), [EngineStats](/editor/components/canvas/canvas.md), [EditorSettings](/editor/interfaces/editor-settings.md).