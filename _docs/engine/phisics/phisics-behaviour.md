## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PhysicsBehavior | engine/phisics/phisics-behaviour.md |

This component encapsulates the necessary logic and interfaces to manage the physical properties and interactions of an entity within the simulation. Its primary responsibility is to provide a high-level, scriptable wrapper around the low-level physics engine components, allowing developers to easily configure an entity's mass, shape, and movement dynamics.

It serves as a controller or service layer within the application architecture. It aggregates the `RigidbodyComponent` and `ColliderComponent` to expose controlled methods for manipulating physics state, acting as the bridge between the game logic and the core physics simulation managed by the [PhysicsWorld](/engine/phisics/world.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `makeDynamic` | Method | Configures the rigidbody to be dynamic, setting a specified mass. |
| `makeStatic` | Method | Configures the rigidbody to be static, setting mass to zero. |
| `addBoxCollider` | Method | Attaches a box-shaped collider to the entity, taking width, height, and depth as inputs. |
| `enableSimulation` | Method | Registers the entity's physics components into the active simulation world. |
| `applyForce` | Method | Applies an external force vector to the entity's underlying physics body. |
| `setLinearVelocity` | Method | Directly sets the linear velocity of the entity's underlying physics body. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class initializes with a `PhysicsWorld` instance. Configuration methods (`makeDynamic`, `makeStatic`, `addBoxCollider`) modify the internal state of the `RigidbodyComponent` and `ColliderComponent`. Runtime methods (`applyForce`, `setLinearVelocity`) access the internal reference (`internalBodyRef`) of the rigidbody to directly manipulate the underlying physics engine body's state.
- **Side Effects:** Mutates the state of the internal `RigidbodyComponent` and `ColliderComponent`. The `enableSimulation` method is designed to interact with the external `PhysicsWorld` to register the entity, which constitutes a side effect on the global simulation state.
- **Error Handling:** The `applyForce` and `setLinearVelocity` methods include checks (`if (rawBody)`) to prevent runtime errors if the underlying physics body reference (`internalBodyRef`) has not been initialized or is null.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `omega-game-engine/dist/core/vector`
- **Internal:** [RigidbodyComponent](/engine/phisics/components.md), [ColliderComponent](/engine/phisics/components.md), [PhysicsWorld](/engine/phisics/world.md)