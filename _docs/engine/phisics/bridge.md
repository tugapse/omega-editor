## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PhysicsEngineBridge | /engine/phisics/bridge.md |

This abstract class defines the contract for bridging the application's internal simulation logic with an external physics engine implementation. Its primary responsibility is to abstract away the specific details of the underlying physics library, providing a standardized interface for managing entities, applying forces, and querying physical states within the game world.

This component acts as a crucial service layer within the application architecture. It sits between the core game logic and the specialized physics simulation, allowing the rest of the system to interact with physics concepts (like gravity or raycasting) without needing to know if the backend is using Box2D, PhysX, or a custom implementation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| PhysicsEngineBridge | Class | Abstract base class defining the required interface for any physics engine implementation. |
| initialize | Method | Sets up the physics world using the provided settings. |
| step | Method | Advances the physics simulation by a given time delta. |
| destroy | Method | Cleans up all resources associated with the physics engine. |
| registerEntity | Method | Adds a new entity to the physics simulation, associating it with its components. |
| unregisterEntity | Method | Removes an entity from the physics simulation. |
| syncToPhysics | Method | Pushes the current transform of an entity from the application state into the physics simulation. |
| getTransformFromPhysics | Method | Retrieves the calculated physical transform of an entity from the simulation. |
| setGravity | Method | Modifies the global gravitational force applied across the physics world. |
| raycast | Method | Performs a ray intersection test against colliders in the physics world. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class itself contains no core logic; it is a pure interface definition. Concrete implementations must manage the lifecycle of the external physics engine, handling initialization, iterative stepping, and state synchronization between the application's data structures and the engine's internal state.

- **Side Effects:** Concrete implementations will inherently interact with external state (the physics engine instance) and potentially mutate global state (e.g., setting gravity).

- **Error Handling:** The `initialize` method returns a `Promise<void>`, indicating that initialization might involve asynchronous setup and could reject upon failure.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `omega-game-engine`
- **Internal:** [PhysicsWorldSettings](/engine/phisics/components.md), [RigidbodyComponent](/engine/phisics/components.md), [ColliderComponent](/engine/phisics/components.md), [PhysicsTransform](/engine/phisics/components.md)