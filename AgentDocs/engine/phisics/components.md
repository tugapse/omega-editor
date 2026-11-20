## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Rigidbody & Collider Components |
| Source file | components.ts |

The **components.ts** file serves as the foundational data definition layer for the physics engine within the Omega Editor. It defines the structural schemas for physical properties, providing the necessary interfaces and classes to represent rigid bodies, collision volumes, and physics-related transformations.

**Functional Mission**
The primary mission of this component is to provide a standardized, type-safe set of definitions for physical entities. By decoupling the data representation (the components) from the simulation logic (the physics world), it allows the engine to define how objects behave under gravity, friction, and collision without being tightly coupled to a specific physics backend.

**System Context & Integration**
This file acts as a data contract between the high-level scene entities and the low-level physics simulation. The definitions provided here are intended to be consumed by physics bridges, such as [rappier](/AgentDocs/engine/phisics/bridges/rappier.md) or [cannon-es](/AgentDocs/engine/phisics/bridges/cannon-es.md), which translate these high-level component states into backend-specific simulation objects. The `PhysicsTransform` interface specifically facilitates the synchronization of spatial data between the game engine's transform system and the physics engine's internal state.

- **INTERNAL REFERENCES**: 
    - [Physics World](/AgentDocs/engine/phisics/world.md)
    - [Physics Bridge](/AgentDocs/engine/phisics/bridge.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `RigidbodyType.Static` (Default: `0`)  Represents non-moving physical objects.
- `RigidbodyType.Dynamic` (Default: `1`)  Represents objects affected by forces and gravity.
- `RigidbodyType.Kinematic` (Default: `2`)  Represents objects moved via script that affect dynamic bodies.
- `ColliderShape.Box` (Default: `0`)  Default collision primitive.
- `RigidbodyComponent.mass` (Default: `1.0`)  Default mass for dynamic bodies.
- `RigidbodyComponent.linearDamping` (Default: `0.0`)  Default resistance to linear motion.
- `RigidbodyComponent.angularDamping` (Default: `0.0`)  Default resistance to rotational motion.
- `ColliderComponent.size` (Default: `Vector3(1, 1, 1)`)  Default dimensions for collision volumes.
- `ColliderComponent.friction` (Default: `0.5`)  Default surface friction coefficient.
- `ColliderComponent.restitution` (Default: `0.0`)  Default bounciness coefficient.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `RigidbodyType` | Enum | Categorizes the physical behavior mode of a body (Static, Dynamic, Kinematic). |
| `ColliderShape` | Enum | Defines the geometric primitive used for collision detection. |
| `PhysicsWorldSettings` | Interface | Configuration object for global physics parameters like gravity and time-stepping. |
| `RigidbodyComponent` | Class | Holds physical properties such as mass, damping, and backend references. |
| `ColliderComponent` | Class | Holds geometric and material properties for collision detection. |
| `PhysicsTransform` | Interface | Defines the spatial state (position, rotation) required for physics synchronization. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.