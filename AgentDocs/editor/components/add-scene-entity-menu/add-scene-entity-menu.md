## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AddBehaviourMenuComponent |
| Source file | add-scene-entity-menu.ts |

The **AddBehaviourMenuComponent** serves as a specialized UI selection interface designed to facilitate the attachment of new logic or properties to entities within the editor. It functions as a filtered selection layer, allowing users to browse through available engine behaviours and select one to be applied to the current scene context.

**Functional Mission**
The primary responsibility of **AddBehaviourMenuComponent** is to provide a searchable, user-friendly menu for discovering and selecting `ClassMetadata` objects representing engine behaviours. It solves the problem of navigating large sets of available engine capabilities by implementing a real-time text-based filtering mechanism.

**System Context & Integration**
This component extends the functionality of the [SearchableMenuComponent](/AgentDocs/editor/components/searchable-menu/searchable-menu.md), inheriting its core search and display logic. It acts as a bridge between the engine's available metadata and the editor's entity manipulation workflow. When a user selects a behaviour, the component emits a `behaviourSelected` event, which is typically consumed by a parent controller or service to instantiate the selected behaviour onto a target entity in the scene.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `behaviours` | `@Input` | An array of `ClassMetadata` objects representing the available behaviours to be displayed in the menu. |
| `behaviourSelected` | `@Output` | An `EventEmitter` that broadcasts the selected `ClassMetadata` to the parent component upon user selection. |
| `filteredBehaviours` | Getter | Computes a subset of `behaviours` based on the current `searchQuery`, filtering by name, description, or type. |

## 4. Execution Logic & Flow
- **Initialization**: The component initializes by inheriting the state of `SearchableMenuComponent`, including the `searchQuery` property. It receives a list of available behaviours via the `behaviours` input.
- **Data Path**: 
    1. **Input**: Receives `ClassMetadata[]` via `behaviours`.
    2. **Processing**: As the user types into the search input (managed by the base class), the `filteredBehaviours` getter is invoked.
    3. **Filtering Logic**: 
        - If `searchQuery` is empty, returns the full list.
        - If `searchQuery` exists, converts it to lowercase and checks if it matches the `name`, `description` (if present), or `type` of each behaviour.
    4. **Output**: The filtered list is rendered in the template; selection triggers the `behaviourSelected` event.
- **Conditional Branching**: 
    - The filtering logic contains a null-check for `b.description` (`b.description! || ''`) to prevent runtime errors when a behaviour lacks a description.

## 5. Resource Dependencies
- **Standard Libraries**: `CommonModule` (Angular)
- **Internal Modules**: 
    - [SearchableMenuComponent](/AgentDocs/editor/components/searchable-menu/searchable-menu.md)
    - `ClassMetadata` (from `omega-game-engine`)
- **External Packages**: `@angular/core`, `@angular/common`