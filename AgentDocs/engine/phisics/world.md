## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | PhysicsWorld |
| Source file | world.ts |

The **PhysicsWorld** class serves as the central orchestrator for the physics simulation subsystem within the engine. It acts as a high-level manager that abstracts the underlying physics engine implementation through a bridge pattern, allowing the engine to remain agnostic of whether it is using a 2D or 3D physics backend.

**Functional Mission**
The primary responsibility of **PhysicsWorld** is to manage the lifecycle of physical entities and synchronize state between the visual engine and the physics simulation. It solves the problem of "dual-state synchronization," ensuring that manual transformations (e.g., from an editor inspector) are pushed to the physics engine, and simulated movements (e.g., gravity or collisions) are pulled back to the visual entities.

**System Context & Integration**
This component sits between the high-level engine loop and the low-level physics implementations. It relies on a `PhysicsEngineBridge` to execute actual mathematical simulations. During the engine's update cycle, it mediates data flow between the entity transform providers and the physics backend. It is critical for maintaining consistency in a real-time environment where both user input and automated physics calculations attempt to modify object transforms.

- **INTERNAL REFERENCES**: 
    - [PhysicsEngineBridge](/AgentDocs/engine/phisics/bridge.md)
    - [PhysicsWorldSettings](/AgentDocs/engine/phisics/components.md)
    - [RigidbodyComponent](/AgentDocs/engine/phisics/components.md)
    - [ColliderComponent](/AgentDocs/engine/phisics/components.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `initialize` | Method | Configures the `activeBridge` with specific settings and prepares the backend. |
| `registerEntity` | Method | Adds an entity's physics properties (Rigidbody/Collider) to the simulation tracking. |
| `unregisterEntity` | Method | Removes an entity from the simulation and the internal tracking set. |
| `update` | Method | Executes the three-stage sync/step/sync loop: Sync-to-Physics $\rightarrow$ Step $\rightarrow$ Sync-to-Visuals. |
| `setGravity` | Method | Passes global gravity vector updates to the active physics bridge. |
| `destroy` | Method | Tears down the bridge and clears all registered entity references. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives a `PhysicsEngineBridge` and `PhysicsWorldSettings`.
    2. Awaits the bridge's internal `initialize` method.
    3. Sets the `activeBridge` reference.
- **Data Path (The Update Loop)**:
    1. **Input (Editor/Script $\rightarrow$ Physics)**: Iterates through `registeredEntities`. If an entity's transform is marked `isDirty`, it calls `activeBridge.syncToPhysics` and resets the dirty flag.
    2. **Processing (Simulation)**: Calls `activeBridge.step(dt)` to advance the physics world by the delta time.
    3. **Output (Physics $\rightarrow$ Visuals)**: Iterates through `registeredEntities`. Retrieves the new transform via `activeBridge.getTransformFromPhysics` and invokes the `updateEntityTransform` callback to move the visual object.
- **Conditional Branching**:
    - **Bridge Check**: Most methods (register, unregister, update, destroy) perform a null check on `activeBridge` to prevent execution if the physics system is not initialized.
    - **Entity Existence**: `unregisterEntity` only proceeds if the `entityId` exists within the `registeredEntities` Set.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [PhysicsEngineBridge](/AgentDocs/engine/phisics/bridge.md)
    - [PhysicsWorldSettings](/AgentDocs/engine/phisics/components.md)
    - [RigidbodyComponent](/AgentDocs/engine/phisics/components.md)
    - [ColliderComponent](/AgentDocs/engine/phisics/components.md)
- **External Packages**: None identified.