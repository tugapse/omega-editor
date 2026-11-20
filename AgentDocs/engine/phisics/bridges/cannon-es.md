## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CannonPhysicsBridge |
| Source file | cannon-es.ts |

The **CannonPhysicsBridge** serves as a concrete implementation of the physics abstraction layer, specifically utilizing the `cannon-es` library to handle rigid body dynamics, collision detection, and physical simulations. It acts as a translation layer between the engine's high-level component definitions and the low-level mathematical operations performed by the Cannon engine.

**Functional Mission**
The primary mission of **CannonPhysicsBridge** is to manage the lifecycle and synchronization of a `CANNON.World`. It is responsible for converting engine-agnostic physics componentssuch as `RigidbodyComponent` and `ColliderComponent`into engine-specific `CANNON.Body` and `CANNON.Shape` objects, ensuring that the physical simulation remains consistent with the game state.

**System Context & Integration**
This component implements the [PhysicsEngineBridge](/AgentDocs/engine/phisics/bridge.md) interface, allowing the engine to swap physics backends (e.g., switching to Rapier) without altering the core simulation logic. It integrates deeply with [Physics Components](/AgentDocs/engine/phisics/components.md) to register entities into the physics world. During the engine update loop, it processes the `step` function to advance the simulation and provides mechanisms to `syncToPhysics` when transform data is modified by the editor or other systems.

- **INTERNAL REFERENCES**: [PhysicsEngineBridge](/AgentDocs/engine/phisics/bridge.md), [RigidbodyComponent](/AgentDocs/engine/phisics/components.md), [ColliderComponent](/AgentDocs/engine/phisics/components.md), [PhysicsTransform](/AgentDocs/engine/phisics/components.md), [PhysicsWorldSettings](/AgentDocs/engine/phisics/components.md), [ColliderShape](/AgentDocs/engine/phisics/components.md), [RigidbodyType](/AgentDocs/engine/phisics/components.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `Math.PI / 2` (Used in `ColliderShape.Plane` logic)  Rotation constant to align Cannon's Z-up plane to a Y-up standard floor.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `initialize` | Method | Sets up the `CANNON.World` and applies global gravity settings. |
| `registerEntity` | Method | Creates `CANNON.Body` and `CANNON.Shape` from engine components and adds them to the world. |
| `unregisterEntity` | Method | Removes a specific body from the simulation and clears its mapping. |
| `syncToPhysics` | Method | Manually updates a body's position, rotation, and resets velocities (used for editor manipulation). |
| `step` | Method | Advances the physics simulation by a delta time (`dt`). |
| `setGravity` | Method | Updates the global gravity vector of the physics world. |
| `destroy` | Method | Performs cleanup by removing all bodies from the world and clearing the internal map. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Instantiates a new `CANNON.World`.
    2. Applies gravity coordinates from `PhysicsWorldSettings` to the world's gravity vector.
- **Data Path (Registration)**: 
    1. **Input**: `entityId`, `RigidbodyComponent`, `ColliderComponent`, `PhysicsTransform`.
    2. **Processing**: 
        - Determines `CANNON.BodyType` based on `RigidbodyType`.
        - Constructs `CANNON.Body` with mass and damping.
        - Applies initial `PhysicsTransform` (position/quaternion).
        - Evaluates `ColliderShape` via a switch statement to create specific `CANNON.Shape` (Sphere, Cylinder/Capsule, Plane, Trimesh, or Box).
        - Special handling for `Plane` to rotate the shape to Y-up.
        - Attaches material properties (friction/restitution).
    3. **Output**: The body is added to `this.world` and stored in `this.bodyMap`.
- **Conditional Branching**:
    - **Shape Selection**: Uses a `switch` on `col.shape` to determine the geometric primitive.
    - **Mesh Fallback**: If `ColliderShape.Mesh` is requested without vertex/index data, it defaults to a `CANNON.Box`.
    - **Plane Exception**: If the shape is a `Plane`, the rotation is applied to the body itself rather than adding a shape to a rotated body, preventing redundant shape additions.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [PhysicsEngineBridge](/AgentDocs/engine/phisics/bridge.md)
    - [RigidbodyComponent](/AgentDocs/engine/phisics/components.md)
    - [ColliderComponent](/AgentDocs/engine/phisics/components.md)
    - [PhysicsTransform](/AgentDocs/engine/phisics/components.md)
    - [PhysicsWorldSettings](/AgentDocs/engine/phisics/components.md)
    - [RigidbodyType](/AgentDocs/engine/phisics/components.md)
    - [ColliderShape](/AgentDocs/engine/phisics/components.md)
- **External Packages**: 
    - `cannon-es` (Physics engine)
    - `omega-game-engine` (Vector math utilities)