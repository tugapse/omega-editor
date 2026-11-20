## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | BooleanInspector |
| Source file | boolean-inspector.ts |

The **BooleanInspector** is a specialized UI component designed to provide a standardized interface for toggling boolean properties within the editor's inspection system. It acts as a bridge between the raw data models of an entity and the user interface, allowing for the visual representation and modification of binary states (true/false).

**Functional Mission**
The primary responsibility of the **BooleanInspector** is to render a labeled toggle switch that reflects a specific boolean state. It solves the problem of providing a consistent, reusable, and type-safe way to edit boolean attributes across various inspectors in the system, ensuring that user interactions are correctly propagated back to the underlying data source via event emission.

**System Context & Integration**
This component functions as a leaf node within the larger inspector hierarchy. It is typically consumed by higher-level inspector modules, such as the [Entity Inspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md) or [Material Inspector](/AgentDocs/editor/inspectors/material-inspector/material-inspector.md), to allow users to manipulate component properties. It relies on the [Toggle](/AgentDocs/app/components/toggle/toggle.md) component for the actual visual interaction and uses an `EventEmitter` to signal state changes to parent components, which then update the global state via services like the [Inspector Service](/AgentDocs/editor/services/inspector.service.md).

- **INTERNAL REFERENCES**: [Toggle](/AgentDocs/app/components/toggle/toggle.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `active` | `@Input() boolean` | Represents the current boolean state to be displayed and toggled. |
| `label` | `@Input() string` | The descriptive text displayed alongside the toggle to identify the property. |
| `change` | `@Output() EventEmitter<boolean>` | Emits the new boolean value whenever the user interacts with the toggle. |

## 4. Execution Logic & Flow
- **Initialization**: The component initializes with default values: `active` is set to `false` and `label` is an empty string.
- **Data Path**: 
    1. **Input**: The parent component passes a boolean value via the `active` property and a string via the `label` property.
    2. **Processing**: The component renders the `Toggle` component, passing the `active` state to it.
    3. **Output**: When the `Toggle` component triggers a change, the `BooleanInspector` captures the event and emits the new value through the `change` `EventEmitter`.
- **Conditional Branching**: Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: `@angular/core`
- **Internal Modules**: 
    - [Toggle](/AgentDocs/app/components/toggle/toggle.md)
- **External Packages**: None identified.