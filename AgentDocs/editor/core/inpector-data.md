## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | InspectorMapData |
| Source file | inpector-data.ts |

The **InspectorMapData** class serves as a structural data container designed to hold the configuration and state required for rendering an object's properties within the editor's inspection interface. It acts as a schema definition for how an entity's metadata should be mapped to UI components, ensuring that the inspector knows which keys to ignore and which specific property types to instantiate.

**Functional Mission**
The primary responsibility of **InspectorMapData** is to provide a standardized data structure for managing the visibility and type-mapping of object properties during the inspection process. It solves the problem of dynamic UI generation by providing a blueprint that dictates which properties are "blocked" from view and which properties require specific inspector component types (e.g., text, boolean, or vector inputs).

**System Context & Integration**
This component functions as a data transfer object (DTO) or a state model used primarily by the inspection subsystem. It is likely consumed by [Inspector Window](/AgentDocs/editor/inspectors/inpector-window/inpector.md) and various specialized inspectors such as [Entity Inspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md) or [Object Inspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md). By providing a `targetClassName`, it allows the [Inspector Service](/AgentDocs/editor/services/inspector.service.md) to determine the context of the data being inspected and apply the correct mapping logic to transform raw entity data into a structured list of `properties`.

- **INTERNAL REFERENCES**: [Inspector Window](/AgentDocs/editor/inspectors/inpector-window/inpector.md), [Entity Inspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md), [Object Inspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md), [Inspector Service](/AgentDocs/editor/services/inspector.service.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `InspectorMapData` | Class | Container for property mapping, exclusion rules, and target type identification. |
| `blckedKeys` | Array | List of property keys to be excluded from the inspector UI. |
| `targetClassName` | String | The name of the class/type the current inspector mapping is intended for. |
| `properties` | Array | A collection of objects defining the key and the corresponding `inpectorType` for UI rendering. |

## 4. Execution Logic & Flow
- **Initialization**: The class initializes with an empty array for `blckedKeys`, an empty string for `targetClassName`, and an empty array for `properties`.
- **Data Path**: Direct exports or structural definitions only; no internal logic flow.
- **Conditional Branching**: Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - None identified.
- **External Packages**: None identified.