## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | PhysicsEngineBridge |
| Source file | bridge.ts |

The **PhysicsEngineBridge** serves as an abstract interface layer designed to decouple the core engine logic from specific third-party physics simulation implementations. By defining a standardized contract for lifecycle management, entity registration, and spatial queries, it allows the engine to remain agnostic of the underlying physics solver (e.g., Rapier or Cannon-es).

**Functional Mission**
The primary responsibility of **PhysicsEngineBridge** is to provide a unified API for synchronizing the game engine's transform state with a physics simulation and retrieving updated physical states back into the engine. It solves the problem of vendor lock-in by ensuring that any physics engine implementation adheres to a predictable set of methods for entity management, gravity control, and raycasting.

**System Context & Integration**
This component acts as the central mediator between the high-level engine systems and the low-level physics simulation. It facilitates the bidirectional flow of data: pushing engine transforms to the simulation via `syncToPhysics` and pulling simulated transforms back via `getTransformFromPhysics`. It is a critical dependency for the physics simulation loop, ensuring that `RigidbodyComponent`, `ColliderComponent`, and `PhysicsTransform` data are correctly mapped to the physical world.

- **INTERNAL REFERENCES**: 
    - [PhysicsWorldSettings](/AgentDocs/engine/phisics/components.md)
    - [RigidbodyComponent](/AgentDocs/engine/phisics/components.md)
    - [ColliderComponent](/AgentDocs/engine/phisics/components.md)
    - [PhysicsTransform](/AgentDocs/engine/phisics/components.md)
    - [Vector3](omega-game-engine)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `initialize` | abstract method | Asynchronously sets up the physics world using provided `PhysicsWorldSettings`. |
| `step` | abstract method | Advances the physics simulation by a specific delta time (`dt`). |
| `destroy` | abstract method | Performs cleanup and releases resources used by the physics engine. |
| `registerEntity` | abstract method | Maps an engine entity (with its rigidbody, collider, and transform) into the physics simulation. |
| `unregisterEntity` | abstract method | Removes an entity from the physics simulation tracking. |
| `syncToPhysics` | abstract method | Updates the physics engine with the current transform of an engine entity. |
| `getTransformFromPhysics` | abstract method | Retrieves the updated transform calculated by the physics engine for a specific entity. |
| `setGravity` | abstract method | Modifies the global gravitational force vector. |
| `raycast` | abstract method | Performs a spatial query to detect intersections along a vector. |

## 4. Execution Logic & Flow
- **Initialization**: The implementation must await the `initialize` method, passing in `PhysicsWorldSettings` to configure the simulation environment (e.g., gravity, solver iterations).
- **Data Path**: 
    1. **Engine $\rightarrow$ Physics**: `syncToPhysics` is called to push manual transform changes (like teleportation) to the simulation.
    2. **Simulation $\rightarrow$ Engine**: During the `step` cycle, the physics engine calculates new positions; `getTransformFromPhysics` is then used to pull these results back to update the engine's visual/logic transforms.
- **Conditional Branching**: 
    - `raycast` returns a structured object containing hit data if an intersection occurs, or `null` if the ray misses all colliders.
    - `getTransformFromPhysics` returns `null` if the requested `entityId` is not currently tracked by the simulation.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [PhysicsWorldSettings](/AgentDocs/engine/phisics/components.md)
    - [RigidbodyComponent](/AgentDocs/engine/phisics/components.md)
    - [ColliderComponent](/AgentDocs/engine/phisics/components.md)
    - [PhysicsTransform](/AgentDocs/engine/phisics/components.md)
- **External Packages**: 
    - `omega-game-engine` (for `Vector3`)