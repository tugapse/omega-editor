## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TransformSpace | editor/behaviours/scene-editor/transform-space.enum |

This component defines a set of discrete states, `TransformSpace`, which dictates the coordinate system context for transformations within the editor. It provides a clear, enumerated way to distinguish between transformations relative to an object's own local axes versus transformations relative to the global world axes.

This enum serves as a fundamental data type within the scene editing subsystem. It is used by various transformation logic handlers to correctly interpret and apply spatial operations, ensuring that operations are performed either locally within an object's hierarchy or globally within the scene graph structure.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| TransformSpace | Enum | Defines the possible coordinate spaces for transformations: Local or World. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None