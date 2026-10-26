## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SearchableMenuComponent |
| Source file | searchable-menu.ts |

The **SearchableMenuComponent** is a specialized UI utility designed to provide a filtered, searchable interface for navigating through collections of menu items. It serves as a high-density selection tool, allowing users to quickly locate specific actions, assets, or entities by typing queries that match names, descriptions, or types.

**Functional Mission**
The primary responsibility of the **SearchableMenuComponent** is to manage the lifecycle of a searchable dropdown or overlay menu. It solves the problem of navigating large datasets within the editor by implementing real-time client-side filtering and handling user interaction patterns such as "click-outside-to-close" and item selection.

**System Context & Integration**
This component acts as a generic presentation layer for menu-driven interactions. It is designed to be decoupled from specific business logic, receiving its data via the `MenuItem` interface. It integrates into the broader UI by emitting events (`itemSelected`, `closeMenu`) that downstream modulessuch as those managing asset creation or scene entity additioncan listen to in order to execute specific commands. It relies on the host environment to manage its visibility via the `isOpen` input.

- **INTERNAL REFERENCES**: [SearchableMenuComponent](/AgentDocs/editor/components/searchable-menu/searchable-menu.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `MenuItem` | Interface | Defines the schema for menu entries (id, type, path, name, description). |
| `items` | `@Input` | The raw array of `MenuItem` objects to be displayed. |
| `isOpen` | `@Input` | Boolean flag controlling the visibility state of the menu. |
| `menuX` | `@Input` | The horizontal coordinate for positioning the menu. |
| `menuY` | `@Input` | The vertical coordinate for positioning the menu. |
| `itemSelected` | `@Output` | Emits the selected `MenuItem` when a user clicks an entry. |
| `closeMenu` | `@Output` | Emits a void signal to trigger menu closure. |
| `filteredItems` | Getter | Computes a subset of `items` based on the current `searchQuery`. |
| `onSearch` | Method | Updates the `searchQuery` state based on input event values. |
| `onDocumentClick` | Method | Listens to global clicks to close the menu if the user clicks outside the component. |
| `selectItem` | Method | Handles the selection logic, stops event propagation, and resets the search. |

## 4. Execution Logic & Flow
- **Initialization**: The component initializes with an empty `searchQuery` and receives its configuration (`items`, `isOpen`, `menuX`, `menuY`) from the parent component.
- **Data Path**: 
    1. **Input**: `items` array is provided.
    2. **Processing**: As the user types in the search field, `onSearch` updates `searchQuery`. The `filteredItems` getter reactively filters the `items` array by checking if the query string exists within the `name`, `description`, or `type` properties (case-insensitive).
    3. **Output**: The filtered list is rendered in the template. Upon selection, `selectItem` triggers the `itemSelected` output.
- **Conditional Branching**:
    - **Search Filtering**: If `searchQuery` is empty, the full `items` list is returned; otherwise, the filter logic is applied.
    - **Click Detection**: In `onDocumentClick`, the component checks if the `event.target` is contained within `elementRef.nativeElement`. If the click is outside and `isOpen` is true, `closeMenu` is emitted.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - None identified.
- **External Packages**: 
    - `@angular/common` (CommonModule)
    - `@angular/core` (Component, ElementRef, EventEmitter, HostListener, Input, Output)