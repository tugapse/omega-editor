## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PhysicsWorld | engine/phisics/world.md |

This component serves as the primary interface and orchestrator for the entire physics simulation within the application. Its core responsibility is to manage the lifecycle of the physics world, abstracting the complex, low-level interactions with the actual physics engine backend. It handles the registration, updating, and deregistration of physical entities, ensuring they are correctly synchronized between the application's state and the simulation's state.

Architecturally, `PhysicsWorld` acts as a high-level service layer or controller. It sits between the application's core logic (which holds entity data) and the concrete physics implementation provided by `PhysicsEngineBridge`. It relies on `PhysicsWorldSettings` for configuration and interacts with components like `RigidbodyComponent` and `ColliderComponent` to define the physical properties of entities.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| PhysicsWorld | Class | Manages the physics simulation lifecycle, including initialization, entity registration, and simulation stepping. |
| initialize | Method | Sets up the active engine backend bridge using provided settings. |
| registerEntity | Method | Registers or updates an entity within the physics simulation space, providing its physical components. |
| unregisterEntity | Method | Removes an entity completely from the physics simulation loop. |
| update | Method | The main ticker function that steps the simulation forward, synchronizing data both to and from the physics engine. |
| setGravity | Method | Applies global gravity settings to the active physics backend. |
| destroy | Method | Cleans up all resources associated with the physics world and the backend bridge. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `update` method implements a three-stage synchronization loop: first, it pushes any externally modified entity transforms to the physics engine (`syncToPhysics`); second, it advances the simulation time step (`step(dt)`); and third, it pulls the resulting transforms from the physics engine back into the application state (`getTransformFromPhysics`). Entity management relies on an internal `Set` (`registeredEntities`) to track active simulation participants.

- **Side Effects:** Mutates external state by calling methods on the injected `PhysicsEngineBridge` instance, which represents the external physics engine. It also logs initialization status to the console.

- **Error Handling:** The component uses null checks (`if (!this.activeBridge) return;`) extensively to prevent runtime errors if initialization has not occurred or if the world has been destroyed.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [PhysicsEngineBridge](/engine/phisics/bridge.md), [PhysicsWorldSettings](/engine/phisics/components.md), [RigidbodyComponent](/engine/phisics/components.md), [ColliderComponent](/engine/phisics/components.md)