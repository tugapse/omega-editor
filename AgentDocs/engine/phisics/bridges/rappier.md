## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | RapierPhysicsBridge |
| Source file | rappier.ts |

The **RapierPhysicsBridge** serves as a specialized implementation of the physics abstraction layer, specifically designed to interface the engine's high-level physics requirements with the Rapier3D WebAssembly physics engine. It acts as a translation layer that converts engine-agnostic component data into Rapier-specific descriptors and manages the lifecycle of rigid bodies and colliders within a Rapier `World`.

**Functional Mission**
The primary mission of **RapierPhysicsBridge** is to provide a concrete implementation of the [PhysicsEngineBridge](/AgentDocs/engine/phisics/bridge.md) interface. It solves the problem of decoupling the core engine logic from the specific complexities of the Rapier WASM API, allowing the engine to perform complex physical simulations (gravity, collisions, raycasting) while maintaining a clean, component-based interface for entity management.

**System Context & Integration**
This component sits within the physics subsystem, acting as the bridge between the [PhysicsWorld](/AgentDocs/engine/phisics/world.md) and the actual physics simulation. It consumes [PhysicsWorldSettings](/AgentDocs/engine/phisics/components.md), [RigidbodyComponent](/AgentDocs/engine/phisics/components.md), and [ColliderComponent](/AgentDocs/engine/phisics/components.md) to instantiate physical representations of entities. It is responsible for synchronizing spatial data between the engine's transform system and the physics world, and it provides raycasting capabilities that can be utilized by behaviors like [Raycast Behaviour](/AgentDocs/editor/behaviours/scene-editor/raycast.md).

- **INTERNAL REFERENCES**: [PhysicsEngineBridge](/AgentDocs/engine/phisics/bridge.md), [PhysicsWorldSettings](/AgentDocs/engine/phisics/components.md), [RigidbodyComponent](/AgentDocs/engine/phisics/components.md), [ColliderComponent](/AgentDocs/engine/phisics/components.md), [PhysicsTransform](/AgentDocs/engine/phisics/components.md), [RigidbodyType](/AgentDocs/engine/phisics/components.md), [ColliderShape](/AgentDocs/engine/phisics/components.md), [Vector3D](/AgentDocs/engine/phisics/components.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `RAPIER.init()`  Awaits the loading of the underlying WebAssembly binary required for the physics engine to function.

**Hardcoded Constants:**
- `0xffffffff`  Used as a bit-mask pattern in raycasting to ensure all collision layers are matched.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `initialize` | Method | Loads WASM and instantiates the `RAPIER.World` with gravity settings. |
| `registerEntity` | Method | Creates Rapier rigid bodies and colliders based on engine components. |
| `unregisterEntity` | Method | Removes a rigid body from the simulation and clears internal mapping. |
| `syncToPhysics` | Method | Manually updates a rigid body's position and rotation (teleportation). |
| `getTransformFromPhysics` | Method | Extracts position and rotation data from a Rapier body back to engine format. |
| `step` | Method | Advances the physics simulation by a specific delta time (`dt`). |
| `setGravity` | Method | Updates the global gravity vector of the physics world. |
| `raycast` | Method | Performs a ray intersection test within the physics world. |
| `dispose` | Method | Clears memory maps and explicitly frees the Rapier WASM heap. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Calls `RAPIER.init()` to ensure WASM is ready.
    2. Converts `settings.gravity` into a `RAPIER.Vector3`.
    3. Instantiates `this.world` with the gravity vector.
- **Data Path (Registration)**: 
    1. **Input**: `entityId`, `RigidbodyComponent`, `ColliderComponent`, `PhysicsTransform`.
    2. **Processing**: 
        - Maps `RigidbodyType` to `RAPIER.RigidBodyDesc` (Fixed, Kinematic, or Dynamic).
        - Applies `PhysicsTransform` to the descriptor.
        - Creates the `RAPIER.RigidBody` via `this.world.createRigidBody`.
        - If a collider is provided, maps `ColliderShape` to specific Rapier descriptors (Ball, Capsule, or Cuboid).
        - Applies friction, restitution, and sensor status.
    3. **Output**: A registered body in `this.world` and a mapping in `this.bodyMap`.
- **Conditional Branching**:
    - **Collider Shape Selection**: Uses a `switch` statement to determine whether to create a `ball`, `capsule`, or `cuboid` based on the `ColliderShape` enum.
    - **Raycast Hit Detection**: If `this.world.castRay` returns a hit, it calculates the `hitPoint` using `ray.pointAt(hit.toi)`; otherwise, it returns `null`.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [PhysicsEngineBridge](/AgentDocs/engine/phisics/bridge.md)
    - [PhysicsWorldSettings](/AgentDocs/engine/phisics/components.md)
    - [RigidbodyComponent](/AgentDocs/engine/phisics/components.md)
    - [ColliderComponent](/AgentDocs/engine/phisics/components.md)
    - [PhysicsTransform](/AgentDocs/engine/phisics/components.md)
    - [RigidbodyType](/AgentDocs/engine/phisics/components.md)
    - [ColliderShape](/AgentDocs/engine/phisics/components.md)
    - [Vector3D](/AgentDocs/engine/phisics/components.md)
- **External Packages**: `@dimforge/rapier3d` (Rapier Physics Engine)