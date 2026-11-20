## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| RotateBehaviour | editor/behaviours/rotate |

This component implements the `RotateBehaviour`, which dictates that an entity continuously rotates over time based on predefined rotation vectors and a constant speed. Its primary responsibility is to modify the entity's transformation matrix during the game loop by applying rotational changes derived from its internal state.

This behaviour acts as a runtime controller attached to an entity within the game engine's architecture. It leverages the `EntityBehaviour` base class to integrate into the engine's update cycle, allowing for dynamic, time-based modifications to entity properties like rotation, while also providing serialization hooks via `toJsonObject` and `fromJson` for persistence.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| RotateBehaviour | Class | Manages continuous rotation of an entity. Contains `rotationAngle` (Vector3) and `speed` (number) properties. |
| update | Method | Called every frame; calculates rotation velocity based on `ellapsed` time and applies rotation to `this.transform`. |
| toJsonObject | Method | Serializes the current state of the behaviour into `JsonSerializedData`. |
| fromJson | Method | Deserializes the behaviour state from `JsonSerializedData`, restoring `rotationAngle` and `speed`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `update` method calculates a velocity factor by multiplying the `speed` by the elapsed time. This velocity is then used to rotate the entity's transform along the axes defined by `rotationAngle.x`, `rotationAngle.y`, and `rotationAngle.z`. Serialization methods ensure the state (`rotationAngle`, `speed`) is preserved across game sessions.

- **Side Effects:** Mutates the `transform` property of the associated entity by calling `this.transform.rotate()`, thereby changing the entity's spatial orientation in the game world.

- **Error Handling:** No explicit error handling is implemented; relies on the underlying engine methods (`super.fromJson`, `this.deserializeAutomatically`) to manage deserialization errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [EntityBehaviour](/editor/behaviours/entitybehaviour.md), [Vector3](/omega-game-engine/vector3.md), [JsonSerializedData](/omega-game-engine/jsonserializeddata.md), [ObjectInstanciator](/omega-game-engine/objectinstanciator.md), [ClassType](/omega-game-engine/classtype.md)