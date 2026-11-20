## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| RigidbodyComponent | engine/phisics/components |

This file defines the core data structures and components necessary for implementing a physics simulation within the engine. It establishes the fundamental building blockssuch as `RigidbodyComponent` and `ColliderComponent`that allow game objects to possess physical properties like mass, shape, and collision behavior. These components dictate how an object interacts with forces, other objects, and the simulated environment.

These definitions serve as the primary data model for the physics subsystem. They are used by the main physics world manager (implied by `PhysicsWorldSettings`) to calculate interactions, resolve collisions, and update object states over discrete time steps. They form the interface layer between the game object representation and the underlying physics solver.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| RigidbodyType | Enum | Defines the physical state of a rigid body: Static (immovable), Dynamic (affected by forces), or Kinematic (moved by external forces but ignores physics). |
| ColliderShape | Enum | Specifies the geometric primitive used for collision detection: Box, Sphere, Capsule, Plane, or Mesh. |
| PhysicsWorldSettings | Interface | Defines the global parameters for the physics simulation, including gravity vector and the fixed time step. |
| RigidbodyComponent | Class | Holds physical properties for an object, including its type, mass, and damping coefficients. |
| ColliderComponent | Class | Defines the physical shape and collision properties of an object, such as size, friction, and restitution. |
| PhysicsTransform | Interface | Represents the spatial state of an object in the world, containing its position and rotation quaternion. |

## 3. Implementation Details & Side Effects
- **Core Logic:** This file primarily serves as a container for data structures. The logic is declarative, defining the properties and constraints for physics entities rather than executing simulation steps. The `RigidbodyComponent` holds state variables that the external physics solver will manipulate.

- **Side Effects:** None. The file only defines data structures and enums.

- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`, `omega-game-engine`
- **Internal:** None