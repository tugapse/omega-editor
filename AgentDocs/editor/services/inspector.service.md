## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | InspectorService |
| Source file | inspector.service.ts |

The **InspectorService** serves as a centralized service provider within the Angular dependency injection system, intended to manage the state and logic associated with the editor's inspection capabilities. As a `root` provided service, it acts as a singleton that can be accessed by various components across the application to facilitate the inspection of entities, assets, or scene objects.

**Functional Mission**
The primary mission of the **InspectorService** is to act as the orchestration layer for the inspection subsystem. It is designed to bridge the gap between the selected data in the editor (such as scene entities or assets) and the UI components responsible for rendering property editors, such as [Entity Inspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md) or [Transform Inspector](/AgentDocs/editor/inspectors/transform-inspector/transform-inspector.md).

**System Context & Integration**
This service sits at the core of the editor's property-editing workflow. It likely interacts with [Editor State Service](/AgentDocs/editor/services/editor-state.service.md) to determine which object is currently active and provides that context to the [Inspector Window](/AgentDocs/editor/inspectors/inpector-window/inpector.md). Downstream, various specialized inspectors like the [Vector Inspector](/AgentDocs/editor/components/inspector-components/vector-inspector/vector-inspector.md) or [Boolean Inspector](/AgentDocs/editor/components/inspector-components/boolean-inspector/boolean-inspector.md) rely on the data or selection state managed or broadcast by this service to display and modify object properties.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `InspectorService` | Class | Provides a singleton service for managing inspection logic and state. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: 
    - `@angular/core`
- **Internal Modules**: 
    - No internal modules identified.
- **External Packages**: 
    - `@angular/core`