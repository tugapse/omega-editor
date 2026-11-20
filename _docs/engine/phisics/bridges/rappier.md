## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| RapierPhysicsBridge | engine/phisics/bridges/rappier |

This component serves as a dedicated bridge layer, abstracting the complex physics simulation provided by the Rapier 3D library into the engine's internal component model. Its primary responsibility is to manage the lifecycle of physical entitiescreating, updating, and destroying rigid bodies and colliders within the Rapier world based on the engine's `RigidbodyComponent` and `ColliderComponent` data.

Architecturally, `RapierPhysicsBridge` acts as a specialized service layer within the physics subsystem. It interfaces between the high-level entity management system and the low-level physics simulation engine. It relies on `PhysicsWorldSettings` for initialization parameters and exposes methods to synchronize entity transforms and perform physics queries like raycasting, allowing other parts of the application to interact with the simulation state.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `RapierPhysicsBridge` | Class | Manages the Rapier physics world, handling entity registration, simulation stepping, and data synchronization. |
| `initialize(settings: PhysicsWorldSettings): Promise<void>` | Method | Initializes the Rapier world, including loading the WebAssembly binary and setting up gravity based on provided settings. |
| `registerEntity(entityId: string, rb: RigidbodyComponent, col?: ColliderComponent, transform?: PhysicsTransform): void` | Method | Creates a rigid body and associated collider in the Rapier world for a given entity, mapping engine components to Rapier structures. |
| `unregisterEntity(entityId: string): void` | Method | Removes a registered rigid body and collider from the Rapier world using the entity ID. |
| `syncToPhysics(entityId: string, transform: PhysicsTransform): void` | Method | Forces the Rapier body's position and rotation to match the provided engine transform, useful for editor synchronization. |
| `getTransformFromPhysics(entityId: string): PhysicsTransform | null` | Method | Retrieves the current position and rotation of a registered entity directly from the Rapier simulation. |
| `step(dt: number): void` | Method | Advances the physics simulation by the given time step (`dt`). |
| `setGravity(x: number, y: number, z: number): void` | Method | Updates the global gravity vector applied to the entire physics world. |
| `raycast(origin: Vector3D, direction: Vector3D, maxDistance: number)` | Method | Performs a raycast query against all colliders in the world, returning hit information if an intersection occurs. |
| `dispose(): void` | Method | Cleans up all registered bodies and frees the underlying Rapier WebAssembly resources. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component uses a `Map` (`bodyMap`) to maintain a direct reference between the engine's string entity IDs and the native `RAPIER.RigidBody` handles. Entity registration involves translating engine component types (e.g., `RigidbodyType.Static`) into corresponding Rapier descriptions (`RAPIER.RigidBodyDesc.fixed()`) and creating the body and collider within the `RAPIER.World`. The simulation advances via `world.step()`, which integrates forces and calculates collisions based on the provided time step.
- **Side Effects:** Mutates the internal state of the `RAPIER.World` instance, which represents the external physics simulation environment. It manages the lifecycle of these external simulation objects.
- **Error Handling:** The `raycast` method handles the possibility of no collision by returning `null`. Entity removal relies on checking if the body exists in `bodyMap` before attempting removal.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@dimforge/rapier3d`
- **Internal:** [components](/components.md)