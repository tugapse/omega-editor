## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CannonPhysicsBridge | engine/phisics/bridges/cannon-es.md |

This component serves as a dedicated bridge layer, abstracting the complex physics simulation provided by the `cannon-es` library into the engine's internal component-based system. Its primary responsibility is to manage the lifecycle of physics bodies, translating engine-specific components like `RigidbodyComponent` and `ColliderComponent` into corresponding `CANNON.Body` and `CANNON.Shape` objects within the physics world.

Architecturally, `CannonPhysicsBridge` acts as a specialized service layer within the physics subsystem. It interfaces between the high-level game state (represented by entities and their components) and the low-level physics simulation engine. It relies on `PhysicsWorldSettings` for initialization parameters and manages the mapping between entity IDs and their corresponding physics bodies via `bodyMap`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `initialize(settings: PhysicsWorldSettings): Promise<void>` | Method | Initializes the underlying `CANNON.World` with specified gravity settings. |
| `registerEntity(entityId: string, rb: RigidbodyComponent, col?: ColliderComponent, transform?: PhysicsTransform): void` | Method | Creates and adds a new physics body to the world, linking it to the provided entity components. |
| `unregisterEntity(entityId: string): void` | Method | Removes a physics body associated with a given entity ID from the simulation world. |
| `syncToPhysics(entityId: string, transform: PhysicsTransform): void` | Method | Updates the position and rotation of an existing physics body to match the provided engine transform, resetting velocities. |
| `step(dt: number): void` | Method | Advances the physics simulation by the given time step `dt`. |
| `setGravity(x: number, y: number, z: number): void` | Method | Modifies the global gravity vector applied to the physics world. |
| `destroy(): void` | Method | Cleans up all registered physics bodies and resets the internal state of the bridge. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `registerEntity` method dynamically constructs `CANNON.Body` based on `RigidbodyType` and attaches appropriate `CANNON.Shape` (Sphere, Box, Capsule, Plane, Trimesh) based on `ColliderShape`. It handles specific transformations, such as rotating the Plane shape to align with a standard Y-up coordinate system. The `step` method executes the fixed-step simulation update of the `CANNON.World`.
- **Side Effects:** Mutates the internal state of the `CANNON.World` by adding, removing, and stepping bodies. It also mutates the state of the `RigidbodyComponent` via `rb.internalBodyRef`.
- **Error Handling:** It includes a fallback mechanism in `registerEntity` for `ColliderShape.Mesh`, warning the user and defaulting to a `CANNON.Box` if vertex or index data is missing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `cannon-es`, `omega-game-engine`
- **Internal:** [PhysicsEngineBridge](/engine/phisics/bridges/bridge.md), [ColliderComponent](/engine/phisics/components/collider-component.md), [ColliderShape](/engine/phisics/components/collider-shape.md), [PhysicsTransform](/engine/phisics/components/physics-transform.md), [PhysicsWorldSettings](/engine/phisics/components/physics-world-settings.md), [RigidbodyComponent](/engine/phisics/components/rigidbody-component.md), [RigidbodyType](/engine/phisics/components/rigidbody-type.md)