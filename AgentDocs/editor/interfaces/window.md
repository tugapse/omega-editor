## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | WindowConfig |
| Source file | window.ts |

The **WindowConfig** interface serves as the structural blueprint for defining window instances within the editor's multi-window environment. It provides a standardized schema that encapsulates all necessary metadata and runtime requirements for a window, ranging from visual identification (title, icon) to functional implementation (component type and input data).

**Functional Mission**
The primary responsibility of **WindowConfig** is to provide a type-safe contract for the window management system. It solves the problem of heterogeneous window creation by ensuring that any module requesting a new window provides a consistent set of properties required for the windowing service to instantiate, render, and manage the lifecycle of the windowed component.

**System Context & Integration**
This interface acts as the data transfer object (DTO) between the logic requesting a window and the service responsible for rendering it. It is heavily utilized by [Window Service](/AgentDocs/editor/services/window.service.md) to facilitate the dynamic creation of UI elements. By including the `component` property as an Angular `Type<any>`, it enables the system to perform dynamic component loading, while the `inputs` property allows for the injection of state into the newly created windowed component.

- **INTERNAL REFERENCES**: [Window Service](/AgentDocs/editor/services/window.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `WindowConfig` | Interface | Defines the required and optional properties for a window instance. |
| `id` | string | Unique identifier for the window instance. |
| `title` | string | Display text for the window header. |
| `iconName` | string | Identifier for the icon displayed in the window tab/header. |
| `footer` | string | Textual content to be displayed in the window footer. |
| `isMaximized` | boolean | Optional flag indicating if the window should start in a maximized state. |
| `component` | Type<any> | The Angular component class to be instantiated within the window. |
| `inputs` | Record<string, unknown> | Optional dictionary of key-value pairs to be passed as `@Input()` to the component. |
| `zIndex` | number | Determines the stacking order of the window in the UI layer. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: (none)
- **Internal Modules**: 
    - (none)
- **External Packages**: 
    - `@angular/core` (Type)