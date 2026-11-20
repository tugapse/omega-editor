## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | TransformSpace |
| Source file | transform-space.enum.ts |

The **TransformSpace** enum serves as a fundamental type definition within the scene editing subsystem. It provides a strictly typed mechanism to distinguish between different coordinate reference frames used during spatial manipulations.

**Functional Mission**
The primary responsibility of **TransformSpace** is to define the available modes for spatial transformations (translation, rotation, and scaling) within the editor. By providing explicit values for `Local` and `World` spaces, it prevents logic errors in mathematical calculations by ensuring that transformation operations are applied relative to either the object's own coordinate system or the global scene origin.

**System Context & Integration**
This component acts as a configuration constant for modules responsible for 3D manipulation. It is heavily utilized by the gizmo and transformation logic to determine how input vectors should be interpreted. It is a critical dependency for [gizmos-behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md) and likely influences how [vector-gizmo](/AgentDocs/editor/components/inspector-components/vector-inspector/component/vector-gizmo.md) or other spatial helpers calculate delta movements.

- **INTERNAL REFERENCES**: [gizmos-behaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md), [vector-gizmo](/AgentDocs/editor/components/inspector-components/vector-inspector/component/vector-gizmo.md).

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
- `TransformSpace.Local` (Default: `'Local'`)  Represents transformations relative to the entity's own axes.
- `TransformSpace.World` (Default: `'World'`)  Represents transformations relative to the global scene axes.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `TransformSpace` | Enum | Defines the coordinate space modes (`Local` or `World`) for spatial transformations. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: None identified.
- **External Packages**: None identified.