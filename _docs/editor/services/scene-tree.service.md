## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SceneTreeService | editor/services/scene-tree.service |

This service is responsible for managing the scene hierarchy and providing mechanisms for interaction with entities within the game scene. Its primary function is to act as a centralized event broadcaster for scene-related events, specifically notifying subscribers when a particular entity is selected within the scene view.

Architecturally, `SceneTreeService` functions as a core application service, leveraging Angular's dependency injection system. It encapsulates the logic for entity selection events, allowing other parts of the application, such as UI controllers or rendering systems, to subscribe to changes in the active scene entity without needing direct knowledge of the scene graph implementation itself.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| onEntitySelected | EventEmitter | An event emitter that broadcasts the `SceneEntity` whenever an entity is selected in the scene. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service initializes an `EventEmitter` named `onEntitySelected` to facilitate decoupled communication between components interested in entity selection events.
- **Side Effects:** Mutates external state by emitting events to subscribers.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** [SceneEntity](/omega-game-engine/scene-entity.md), [Scene](/omega-game-engine/scene.md)