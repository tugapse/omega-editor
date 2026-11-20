## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Icon |
| Source file | icon.ts |

The **Icon** component serves as a highly reusable, atomic UI primitive designed to render graphical symbols across the application. It abstracts the complexity of icon implementation, providing a standardized interface for displaying visual indicators, whether they are used as static decorations or interactive elements.

**Functional Mission**
The primary responsibility of the **Icon** component is to provide a consistent and configurable way to display icons within the UI. It solves the problem of icon fragmentation by centralizing the logic for icon naming, sizing, and behavioral states (such as button-mode or selection-state) into a single, standalone component.

**System Context & Integration**
As a low-level atomic component, **Icon** is intended to be consumed by higher-order components throughout the system. It acts as a leaf node in the component tree, receiving configuration via `@Input` properties and rendering its visual representation based on those inputs. It is frequently utilized in navigation elements, menu items, and action buttons to enhance user interface affordance.

- **INTERNAL REFERENCES**: No direct internal component dependencies identified in the source.

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
- `iconName` (Default: `'fa-file-invoice-dollar'`)  The default FontAwesome class name used if no icon is provided.
- `iconSize` (Default: `12`)  The default pixel size for the icon rendering.
- `isButton` (Default: `false`)  Determines if the icon should behave as an interactive button element.
- `isSelected` (Default: `false`)  Indicates the visual selection state of the icon.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `Icon` | Class | The main Angular component class managing icon state and inputs. |
| `iconName` | @Input | Receives the string identifier for the icon (e.g., FontAwesome class). |
| `iconSize` | @Input | Receives a numeric value to control the dimensions of the icon. |
| `isButton` | @Input | Boolean flag to toggle between a static icon and a clickable button wrapper. |
| `isSelected` | @Input | Boolean flag to trigger visual styles associated with a selected state. |

## 4. Execution Logic & Flow
- **Initialization**: The component initializes with default values for `iconName` ('fa-file-invoice-dollar'), `iconSize` (12), `isButton` (false), and `isSelected` (false).
- **Data Path**: 
    1. External parent components pass configuration values via `@Input` decorators.
    2. The component receives these values during the Angular change detection cycle.
    3. The values are passed to the `icon.html` template to drive CSS classes and inline styles.
- **Conditional Branching**: The component relies on template-level logic (implied by `CommonModule` import) to conditionally apply styles or structural elements based on the `isButton` and `isSelected` states.

## 5. Resource Dependencies
- **Standard Libraries**: `@angular/common` (CommonModule)
- **Internal Modules**: None
- **External Packages**: `@angular/core`