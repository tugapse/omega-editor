## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | main.ts |
| Source file | main.ts |

The **main.ts** file serves as the primary entry point for the Omega Editor application. It is responsible for bootstrapping the Angular framework, configuring the global execution environment, and establishing the bridge between the web-based editor interface and the underlying game engine.

**Functional Mission**
The core mission of **main.ts** is to initialize the application runtime. This involves extending native JavaScript prototypes to ensure consistent string formatting across the UI, injecting the `omega-game-engine` into the global `window` scope for external accessibility, and triggering the `bootstrapApplication` process to mount the root component.

**System Context & Integration**
This component sits at the highest level of the execution hierarchy. It orchestrates the transition from a static script execution to a live Angular application by utilizing [appConfig](/AgentDocs/app/app.config.md) and the [App](/AgentDocs/app/app.md) component. By attaching `omega-game-engine` to the `window` object, it enables low-level engine access for various services and components throughout the system, facilitating the integration between the editor's UI logic and the engine's computational core.

- **INTERNAL REFERENCES**: [appConfig](/AgentDocs/app/app.config.md), [App](/AgentDocs/app/app.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `window` (via `globalThis/window`)  Used to expose the `omega-game-engine` to the global browser scope.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `capitalize` | Method (String.prototype) | Transforms the first character of a string to uppercase and appends the remainder of the string. |
| `bootstrapApplication` | Function | Angular framework function used to initialize the application with a root component and configuration. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Extends the `String` interface via TypeScript declaration to support `capitalize()`.
    2. Checks for the existence of `String.prototype.capitalize` to prevent redundant assignments.
- **Prototype Augmentation**: 
    - If `capitalize` is missing, it is assigned a function that performs character manipulation: `this.charAt(0).toUpperCase() + this.slice(1)`.
- **Engine Integration**: 
    - Imports the `omega-game-engine` module.
    - Assigns the imported module to `window['omega-game-engine']`, making the engine available to non-Angular scripts or legacy code.
- **Application Bootstrapping**: 
    - Executes `bootstrapApplication` using the `App` component and `appConfig`.
    - Implements a `.catch()` block to log any critical initialization errors to the console.

## 5. Resource Dependencies
- **Standard Libraries**: `String` (Native JS)
- **Internal Modules**: 
    - [appConfig](/AgentDocs/app/app.config.md)
    - [App](/AgentDocs/app/app.md)
- **External Packages**: 
    - `@angular/platform-browser`
    - `omega-game-engine`