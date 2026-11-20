## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Quaternion | engine/phisics/quaternion |

This component provides a robust implementation of the mathematical Quaternion structure, essential for representing rotations in 3D space. It encapsulates the underlying `gl-matrix` quaternion type, wrapping it with a clean, object-oriented interface that exposes standard quaternion operations like multiplication, normalization, and conversions.

This class serves as a core data model within the physics engine subsystem. It integrates with the broader engine architecture by implementing `JsonSerializable`, allowing instances to be seamlessly persisted and loaded via serialization mechanisms, fitting into the engine's state management layer alongside other physics components.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| Quaternion | Class | Represents a 4D rotation quaternion, providing methods for construction, manipulation, and conversion. |
| Instanciate | Static Method | Creates a new Quaternion instance, defaulting to the identity quaternion. |
| fromAxisAngle | Static Method | Constructs a Quaternion from a specified axis vector and rotation angle. |
| fromEuler | Static Method | Constructs a Quaternion from Euler angles (pitch, yaw, roll). |
| fromMat3 | Static Method | Constructs a Quaternion from a 3x3 rotation matrix. |
| identity | Method | Sets the current quaternion to the identity rotation. |
| set | Method | Sets the quaternion components (x, y, z, w) directly. |
| copy | Method | Copies the values from another Quaternion instance into this one. |
| clone | Method | Creates and returns a deep copy of the current Quaternion instance. |
| setAxisAngle | Method | Sets the quaternion to represent a rotation around a given axis by a specified angle. |
| getAxisAngle | Method | Calculates the angle and axis of the rotation represented by the quaternion. |
| add | Method | Adds the components of another Quaternion to this one (vector addition). |
| multiply | Method | Multiplies this quaternion by another quaternion (composition of rotations). |
| scale | Method | Scales the quaternion components by a scalar value. |
| dot | Method | Calculates the dot product between this quaternion and another. |
| lerp | Method | Linearly interpolates this quaternion towards another over a given factor $t$. |
| slerp | Method | Spherical linearly interpolates this quaternion towards another over a given factor $t$. |
| invert | Method | Calculates the inverse of the quaternion in place. |
| conjugate | Method | Calculates the conjugate of the quaternion in place. |
| length | Method | Returns the magnitude (length) of the quaternion. |
| squaredLength | Method | Returns the squared magnitude of the quaternion. |
| normalize | Method | Normalizes the quaternion in place to ensure unit length. |
| rotateX | Method | Rotates the quaternion around the X-axis by a given angle in radians. |
| rotateY | Method | Rotates the quaternion around the Y-axis by a given angle in radians. |
| rotateZ | Method | Rotates the quaternion around the Z-axis by a given angle in radians. |
| fromEuler | Method | Sets the quaternion to represent a rotation derived from Euler angles. |
| toString | Method | Returns a string representation of the quaternion components. |
| fromJson | Method | Deserializes the quaternion from a JSON data structure. |
| toJsonObject | Method | Serializes the quaternion into a JSON data structure. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class wraps the `gl-matrix` library's `quat` type to provide a high-level, idiomatic TypeScript interface. Core functionality relies on delegating mathematical operations (like `quat.multiply`, `quat.normalize`) to the underlying optimized C/JavaScript implementation provided by `gl-matrix`. State is managed internally via the private `_quaternion` field.
- **Side Effects:** None. All operations are mathematical transformations performed on the internal state or return new instances/references, without interacting with I/O or external systems.
- **Error Handling:** The implementation relies on the underlying `gl-matrix` functions, which typically handle invalid inputs by producing mathematically defined results (e.g., normalization on a zero-length vector might result in a zero vector, depending on the specific function implementation). No explicit custom exception handling is present.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`, `omega-game-engine`
- **Internal:** [Vector3](/engine/phisics/vector3.md)