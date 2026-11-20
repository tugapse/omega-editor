## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Quaternion |
| Source file | quaternion.ts |

The **Quaternion** class serves as a specialized mathematical utility within the physics engine, providing a robust implementation of quaternion algebra for representing 3D rotations. By encapsulating the `gl-matrix` `quat` type, it offers a high-level, object-oriented interface for performing complex rotational transformations, such as spherical linear interpolation (slerp), axis-angle conversions, and Euler angle integrations.

Its primary mission is to provide a stable, serializable, and developer-friendly abstraction for orientation data. This ensures that rotational state can be consistently manipulated by physics solvers and transformed into matrices for rendering, while also supporting seamless persistence through the `JsonSerializable` interface.

**Functional Mission**
The **Quaternion** component is responsible for managing 4D complex number mathematics to handle 3D spatial orientations. It solves the problem of "Gimbal Lock" inherent in Euler angles and provides the necessary mathematical primitives (normalization, conjugation, inversion) required for accurate physics simulations and spatial transformations.

**System Context & Integration**
As a core mathematical primitive, this component is a foundational dependency for the [Physics Engine](/AgentDocs/engine/phisics/world.md) and its various bridges. It acts as the primary data structure for representing the orientation of entities within the physics world. It integrates with the serialization system via `JsonSerializable`, allowing rotational states to be saved or loaded as part of the engine's state management. Downstream, these quaternions are often converted to matrices or used to drive the rotation of visual components in the scene.

- **INTERNAL REFERENCES**: [Quaternion](/AgentDocs/engine/phisics/quaternion.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `w` (Default: `1`)  The default scalar component for an identity quaternion.
- `x, y, z` (Default: `0`)  The default vector components for an identity quaternion.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `Quaternion` | Class | Main mathematical class for 3D rotation representation and manipulation. |
| `internalQuat` | Getter | Provides direct access to the underlying `gl-matrix` `quat` array. |
| `x`, `y`, `z`, `w` | Getters/Setters | Individual component accessors for the quaternion elements. |
| `Instanciate` | Static Method | Factory method to create a new identity `Quaternion`. |
| `fromAxisAngle` | Static Method | Creates a quaternion from a `Vector3` axis and a rotation angle. |
| `fromEuler` | Static Method | Creates a quaternion from Euler angles (x, y, z). |
| `fromMat3` | Static Method | Creates a quaternion from a 3x3 rotation matrix. |
| `identity` | Instance Method | Resets the quaternion to the identity state. |
| `set` | Instance Method | Manually sets the x, y, z, w components. |
| `copy` | Instance Method | Copies values from another `Quaternion` instance. |
| `clone` | Instance Method | Returns a new `Quaternion` instance with identical values. |
| `setAxisAngle` | Instance Method | Updates the current quaternion using an axis and angle. |
| `getAxisAngle` | Instance Method | Extracts the axis and angle from the current quaternion. |
| `add` | Instance Method | Performs component-wise addition. |
| `multiply` | Instance Method | Performs quaternion multiplication (combining rotations). |
| `scale` | Instance Method | Scales the quaternion components. |
| `dot` | Instance Method | Calculates the dot product between two quaternions. |
| `lerp` | Instance Method | Performs Linear Interpolation between two quaternions. |
| `slerp` | Instance Method | Performs Spherical Linear Interpolation between two quaternions. |
| `invert` | Instance Method | Calculates the inverse of the quaternion. |
| `conjugate` | Instance Method | Calculates the conjugate of the quaternion. |
| `length` | Instance Method | Returns the magnitude of the quaternion. |
| `squaredLength` | Instance Method | Returns the squared magnitude of the quaternion. |
| `normalize` | Instance Method | Scales the quaternion to unit length. |
| `rotateX/Y/Z` | Instance Method | Applies a rotation around a specific local axis. |
| `fromEuler` | Instance Method | Updates the current quaternion using Euler angles. |
| `toString` | Instance Method | Returns a string representation of the quaternion components. |
| `fromJson` | Instance Method | Deserializes the quaternion from a JSON object. |
| `toJsonObject` | Instance Method | Serializes the quaternion into a JSON-compatible object. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The constructor initializes the internal `_quaternion` using `quat.fromValues(x, y, z, w)`.
    - If no arguments are provided, it defaults to an identity quaternion `(0, 0, 0, 1)`.
- **Data Path**:
    - **Input**: Numeric components, `Vector3` axes, or `mat3` matrices.
    - **Processing**: Mathematical operations are delegated to the `gl-matrix` library, which performs high-performance array manipulations on the `_quaternion` buffer.
    - **Output**: The internal state of `_quaternion` is mutated (for instance methods) or a new `Quaternion` instance is returned (for static/clone methods).
- **Conditional Branching**:
    - The `fromJson` method triggers `deserializeAutomatically`, which relies on the underlying `JsonSerializable` logic to map keys to the internal `_quaternion` components.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [JsonSerializable](/AgentDocs/engine/phisics/quaternion.md) (via `omega-game-engine`)
    - [Vector3](/AgentDocs/engine/phisics/quaternion.md) (via `omega-game-engine`)
- **External Packages**: 
    - `gl-matrix` (Used for low-level quaternion math operations)