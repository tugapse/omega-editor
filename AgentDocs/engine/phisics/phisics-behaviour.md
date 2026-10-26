## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | PhysicsBehavior |
| Source file | phisics-behaviour.ts |

The **PhysicsBehavior** class serves as a high-level orchestration layer between the engine's entity component system and the underlying physics simulation engine. It acts as a bridge, encapsulating the complexity of managing rigid bodies and colliders into a simplified, developer-friendly API.

Its primary mission is to provide a unified interface for configuring physical properties (such as mass and body type) and triggering runtime physical interactions (such as applying forces or setting velocities). By abstracting the raw physics engine references, it ensures that gameplay logic remains decoupled from the specific implementation details of the physics backend.

**Functional Mission**
The **PhysicsBehavior** component is responsible for managing the lifecycle and state of physical properties attached to an entity. It solves the problem of manual, low-level manipulation of physics bodies by providing semantic methods like `makeDynamic` or `addBoxCollider`, which streamline the setup of complex physical entities.

**System Context & Integration**
This component integrates deeply with the physics subsystem. It holds references to [RigidbodyComponent](/AgentDocs/engine/phisics/components.md) and [ColliderComponent](/AgentDocs/engine/phisics/components.md) to store physical state. It relies on a [PhysicsWorld](/AgentDocs/engine/phisics/world.md) instance to facilitate the registration of entities into the active simulation. During runtime, it acts as a proxy, passing commands from the scripting environment through to the internal physics body references managed by the engine's bridges.

- **INTERNAL REFERENCES**: [RigidbodyComponent](/AgentDocs/engine/phisics/components.md), [ColliderComponent](/AgentDocs/engine/phisics/components.md), [RigidbodyType](/AgentDocs/engine/phisics/components.md), [ColliderShape](/AgentDocs/engine/phisics/components.md), [PhysicsWorld](/AgentDocs/engine/phisics/world.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `mass` (Default: `1.0`)  Default mass assigned when making a body dynamic.
- `mass` (Default: `0`)  Mass assigned to static bodies to ensure they remain immovable.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `PhysicsBehavior` | Class | Main controller for entity physics properties and interactions. |
| `rigidbody` | Property | Accessor for the entity's [RigidbodyComponent](/AgentDocs/engine/phisics/components.md). |
| `collider` | Property | Accessor for the entity's [ColliderComponent](/AgentDocs/engine/phisics/components.md). |
| `makeDynamic` | Method | Configures the rigidbody as a dynamic type with a specified mass. |
| `makeStatic` | Method | Configures the rigidbody as a static type with zero mass. |
| `addBoxCollider` | Method | Instantiates a box-shaped [ColliderComponent](/AgentDocs/engine/phisics/components.md) with specified dimensions. |
| `enableSimulation` | Method | Placeholder for registering the entity with the [PhysicsWorld](/AgentDocs/engine/phisics/world.md). |
| `applyForce` | Method | Applies a directional force to the internal physics body. |
| `setLinearVelocity` | Method | Directly modifies the linear velocity of the internal physics body. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives a `PhysicsWorld` instance via constructor.
    2. Instantiates a new `RigidbodyComponent` and assigns it to `this.rigidbody`.
- **Data Path (Configuration)**: 
    - `makeDynamic(mass)` $\rightarrow$ Updates `rigidbody.type` to `Dynamic` $\rightarrow$ Updates `rigidbody.mass`.
    - `addBoxCollider(w, h, d)` $\rightarrow$ Creates `ColliderComponent` $\rightarrow$ Sets shape to `Box` $\rightarrow$ Calculates half-extents (size / 2) $\rightarrow$ Assigns to `this.collider`.
- **Data Path (Runtime Interaction)**:
    - `applyForce(force)` $\rightarrow$ Checks for `internalBodyRef` $\rightarrow$ If exists, calls `applyForce` on the raw engine body.
    - `setLinearVelocity(velocity)` $\rightarrow$ Checks for `internalBodyRef` $\rightarrow$ If exists, maps `Vector3` components (x, y, z) to the raw body's velocity property.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [RigidbodyComponent](/AgentDocs/engine/phisics/components.md)
    - [ColliderComponent](/AgentDocs/engine/phisics/components.md)
    - [RigidbodyType](/AgentDocs/engine/phisics/components.md)
    - [ColliderShape](/AgentDocs/engine/phisics/components.md)
    - [PhysicsWorld](/AgentDocs/engine/phisics/world.md)
- **External Packages**: 
    - `omega-game-engine/dist/core/vector` (Vector3 math)