## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ThemeSelector |
| Source file | theme-selector.ts |

The **ThemeSelector** component is a specialized UI controller responsible for managing the visual aesthetic of the editor application. It provides a user interface for selecting between various predefined color schemes, ranging from high-contrast dark modes to vibrant cyberpunk aesthetics.

**Functional Mission**
The primary responsibility of the **ThemeSelector** is to facilitate theme switching by mapping user selections to CSS classes applied to the document body. It ensures visual persistence by synchronizing the active theme with the browser's `localStorage`, allowing the user's aesthetic preference to survive page reloads.

**System Context & Integration**
This component acts as a bridge between the user interface and the global document state. When a user selects a theme via the [DropdownComponent](/AgentDocs/app/components/dropdown/dropdown.md), the component updates the `className` of the `document.body`. This change triggers a global CSS cascade, altering the appearance of all downstream modules within the editor. It relies on the browser's `DOCUMENT` injection to perform side effects on the DOM and uses `localStorage` for state persistence.

- **INTERNAL REFERENCES**: [DropdownComponent](/AgentDocs/app/components/dropdown/dropdown.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `omg_theme` (via `localStorage.getItem`)  Retrieves the persisted theme identifier from the browser's local storage.

**Hardcoded Constants:**
- `data` (Default: `Array<Object>`)  A collection of theme definitions containing `code`, `title`, and `descri` (description).

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `items` | Property | Holds the transformed `DropdownItem[]` array used for rendering the selection menu. |
| `selectedItem` | Property | Stores the currently active `DropdownItem` to reflect the state in the UI. |
| `data` | Property | The raw configuration array defining available themes. |
| `setTheme` | Method | Applies the provided CSS class string directly to the `document.body.className`. |
| `onItemSetected` | Method | Handles selection events; updates the theme, updates the local state, and persists the choice to `localStorage`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `constructor` maps the raw `data` array into a format compatible with `DropdownItem[]` (mapping `title` to `key` and `code` to `value`).
    2. It attempts to retrieve the `omg_theme` key from `localStorage`.
    3. It searches the `items` array for a match to the saved theme.
    4. It invokes `setTheme` with the found theme's code to apply the visual state immediately upon component instantiation.
- **Data Path**: 
    - `data` (Raw Objects) $\rightarrow$ `items` (DropdownItem Array) $\rightarrow$ `onItemSetected` (User Selection) $\rightarrow$ `document.body.className` (DOM Update).
- **Conditional Branching**: 
    - If no `omg_theme` exists in `localStorage`, it defaults to an empty string, which results in the application using the default CSS state.

## 5. Resource Dependencies
- **Standard Libraries**: `Document` (via `@angular/core`'s `DOCUMENT` injection).
- **Internal Modules**: 
    - [DropdownComponent](/AgentDocs/app/components/dropdown/dropdown.md)
- **External Packages**: `@angular/core`