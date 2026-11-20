## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SceneTreeService |
| Source file | scene-tree.service.ts |

The **SceneTreeService** acts as a centralized communication hub for selection state within the editor's scene hierarchy. It provides a reactive mechanism to broadcast which entity is currently active or focused within the scene, allowing disparate parts of the UI to synchronize their state based on user interaction.

**Functional Mission**
The primary responsibility of **SceneTreeService** is to manage and emit selection events for `SceneEntity` objects. It solves the problem of decoupled component communication by providing a single source of truth for the "currently selected entity," ensuring that when a user clicks an item in the scene tree, other modules (like the inspector) are notified immediately.

**System Context & Integration**
This service serves as a bridge between the scene hierarchy navigation and the property editing systems. When an entity is selected via the [Scene Tree](/AgentDocs/editor/components/scene-tree/scene-tree.md), this service emits the entity through `onEntitySelected`. Downstream modules, such as the [Entity Inspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md) or [Object Inspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md), subscribe to this event to populate their interfaces with the relevant data for the selected `SceneEntity`.

- **INTERNAL REFERENCES**: [Scene Tree](/AgentDocs/editor/components/scene-tree/scene-tree.md), [Entity Inspector](/AgentDocs/editor/inspectors/entity-inspector/entity-inspector.md), [Object Inspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `onEntitySelected` | `EventEmitter<SceneEntity>` | Emits a `SceneEntity` instance whenever a new entity is selected in the scene hierarchy. |

## 4. Execution Logic & Flow
- **Initialization**: The service is instantiated as a singleton via `@Injectable({ providedIn: 'root' })`. The `onEntitySelected` EventEmitter is initialized in an empty state, ready to broadcast events.
- **Data Path**: 
    1. An external trigger (e.g., a click in the [Scene Tree](/AgentDocs/editor/components/scene-tree/scene-tree.md)) calls `.emit(entity)` on `onEntitySelected`.
    2. The `SceneEntity` object is passed through the EventEmitter.
    3. Subscribed observers (e.g., Inspector components) receive the `SceneEntity` and update their internal state to reflect the new selection.
- **Conditional Branching**: Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: `EventEmitter`, `Injectable` (from `@angular/core`)
- **Internal Modules**: 
    - `SceneEntity`, `Scene` (from `omega-game-engine`)
- **External Packages**: `@angular/core`