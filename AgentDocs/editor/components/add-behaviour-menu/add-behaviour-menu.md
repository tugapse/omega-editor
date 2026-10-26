## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AddBehaviourMenuComponent |
| Source file | add-behaviour-menu.ts |

The **AddBehaviourMenuComponent** serves as a specialized UI overlay designed to facilitate the attachment of new logic or behaviors to entities within the editor environment. It provides a searchable, filtered interface that allows users to browse through available `ClassMetadata` definitions, ensuring that the process of extending entity functionality is both intuitive and efficient.

**Functional Mission**
The primary responsibility of the **AddBehaviourMenuComponent** is to act as a selection gateway for engine behaviors. It solves the problem of navigating large libraries of available behaviors by implementing a real-time search mechanism that filters by name, description, or type, ultimately emitting the selected behavior back to the parent controller for entity modification.

**System Context & Integration**
This component functions as a transient UI element, likely triggered by a context menu or a specific editor command. It receives a list of available behaviors via inputs and communicates user decisions through output emitters. Once a selection is made or the user clicks outside the menu boundaries, it signals the parent component to either apply the new behavior or close the interface, maintaining a clean state within the editor's interaction flow.

- **INTERNAL REFERENCES**: [AddBehaviourMenuComponent](/AgentDocs/editor/components/add-behaviour-menu/add-behaviour-menu.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `behaviours` | `@Input<ClassMetadata[]>` | Provides the collection of available behavior metadata to be displayed. |
| `isOpen` | `@Input<boolean>` | Controls the visibility state of the menu component. |
| `menuX` | `@Input<number>` | Defines the horizontal coordinate for the menu positioning. |
| `menuY` | `@Input<number>` | Defines the vertical coordinate for the menu positioning. |
| `behaviourSelected` | `@Output<EventEmitter<ClassMetadata>>` | Emits the selected `ClassMetadata` object when a user clicks a behavior. |
| `closeMenu` | `@Output<EventEmitter<void>>` | Emits a signal to close the menu, triggered by selection or clicking outside. |
| `filteredBehaviours` | `get` (Property) | Computes a subset of `behaviours` based on the current `searchQuery`. |
| `onSearch` | `void` (Method) | Updates the `searchQuery` state based on user input in the search field. |
| `onDocumentClick` | `void` (Method) | Listens to global click events to implement "click-away" dismissal logic. |
| `selectBehaviour` | `void` (Method) | Handles the selection event, emitting the choice and resetting the search state. |

## 4. Execution Logic & Flow
- **Initialization**: The component initializes with an empty `searchQuery` and receives its configuration (`behaviours`, `isOpen`, `menuX`, `menuY`) from the parent component.
- **Data Path**: 
    1. **Input**: `behaviours` array is passed in.
    2. **Processing**: As the user types in the search input, `onSearch` updates `searchQuery`. The `filteredBehaviours` getter dynamically re-calculates the list by checking if the query matches the `name`, `description`, or `type` of each `ClassMetadata` item.
    3. **Output**: Upon clicking a behavior, `selectBehaviour` is invoked, which triggers `behaviourSelected.emit(behaviour)` and `closeMenu.emit()`.
- **Conditional Branching**:
    - **Search Filtering**: If `searchQuery` is empty, the full `behaviours` list is returned; otherwise, a filtered list is returned.
    - **Dismissal Logic**: In `onDocumentClick`, if `isOpen` is true, the component checks if the click target is contained within its own `elementRef`. If the click is outside, `closeMenu.emit()` is called.

## 5. Resource Dependencies
- **Standard Libraries**: `EventEmitter`, `Input`, `Output`, `HostListener`, `ElementRef` (from `@angular/core`), `CommonModule` (from `@angular/common`).
- **Internal Modules**: 
    - `ClassMetadata` (from `omega-game-engine`)
- **External Packages**: `@angular/core`, `@angular/common`