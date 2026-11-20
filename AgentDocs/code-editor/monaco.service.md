## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | MonacoService |
| Source file | monaco.service.ts |

The **MonacoService** acts as the specialized orchestration layer for the Monaco Editor integration within the Omega Editor ecosystem. Its primary purpose is to abstract the complexities of the Monaco Editor lifecycle, including dynamic dependency loading via the AMD loader, language registration for custom syntaxes (specifically GLSL), and the implementation of advanced IntelliSense features tailored for shader development.

**Functional Mission**
The core mission of **MonacoService** is to provide a high-performance, feature-rich code editing environment that supports both standard programming languages (TypeScript/JavaScript) and domain-specific languages (GLSL). It solves the problem of providing a professional-grade IDE experiencecomplete with syntax highlighting, snippet-based autocompletion, and real-time error/warning reportingwithin a web-based architecture.

**System Context & Integration**
This service serves as a critical bridge between the raw text editing capabilities and the broader editor UI. It interacts with the `[Code Editor Component](/AgentDocs/code-editor/editor/code-editor.component.md)` to provide the editor instance and manages the lifecycle of code models. It is designed to feed diagnostic information (errors and warnings) back to the system, which can be consumed by components like the `[Problems Panel](/AgentDocs/editor/components/problems-panel/problems-panel.md)` to alert users of syntax issues. Furthermore, it integrates with the engine's shader logic by providing preprocessor directive mapping and native GLSL function signatures.

- **INTERNAL REFERENCES**: `[Code Editor Component](/AgentDocs/code-editor/editor/code-editor.component.md)`, `[Problems Panel](/AgentDocs/editor/components/problems-panel/problems-panel.md)`.

## 2. Environment & Configuration
**Environment Lookups:**
- `window.monaco` (via `loadDependencies`)  Checks for existing Monaco instance to prevent redundant loading.
- `window.require` (via `loadDependencies`)  Accesses the AMD loader for fetching Monaco assets.
- `window.getComputedStyle` (via `createEditor`)  Retrieves CSS variables (`--global-background-color`, `--editor-panel-color`, etc.) to synchronize the editor theme with the application's dynamic UI theme.

**Hardcoded Constants:**
- `SHADER_FUNCTIONS` (Default: `@INCLUDE_FOG_FUNC` $\to$ `ShaderSources.frag.fog`, etc.)  Maps custom preprocessor tokens to internal shader source modules.
- `NATIVE_GLSL_BUILTINS` (Default: Array of GLSL function objects)  A hardcoded dictionary of GLSL mathematical and vector functions used to drive the IntelliSense engine.
- `omega-dynamic-theme` (Default: `vs-dark` base)  The identifier for the custom-defined Monaco theme.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `loadDependencies` | Func | Asynchronously injects and configures the Monaco loader script. |
| `createEditor` | Func | Initializes the Monaco editor instance, applies dynamic themes, and sets up command listeners (e.g., Ctrl+S). |
| `registerGlslLanguageFeatures` | Func | Defines the GLSL Monarch tokenizer and registers the custom completion provider. |
| `setModel` | Func | Updates the current editor instance with a new model. |
| `getModelValue` | Func | Retrieves the current string content of the active editor model. |
| `clearAllModelMarkers` | Func | Removes all diagnostic markers (errors/warnings) from a specific model source. |
| `setModelMarkers` | Func | Manually injects diagnostic markers into the editor's UI. |
| `createOrGetModel` | Func | Handles model instantiation with intelligent language mapping (e.g., `.frag` $\to$ `glsl`). |
| `updateIntelliSenseDefinitions` | Func | Injects TypeScript declaration content into the editor to support custom type definitions via `addExtraLib`. |
| `isEditorReady` | Func | Boolean check for the existence of the `editorInstance`. |
| `disposeEditor` | Func | Performs cleanup of extra libraries and the editor instance to prevent memory leaks. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. `loadDependencies` is called to inject `loader.js`.
    2. Once loaded, `require(['vs/editor/editor.main'])` is invoked.
    3. `createEditor` is triggered, which first calls `registerGlslLanguageFeatures`.
    4. The editor theme is constructed by reading CSS variables from the DOM.
- **Data Path (IntelliSense/Completion)**:
    1. User types a character $\to$ `provideCompletionItems` is triggered.
    2. **Branch A**: If the character is `@`, the logic filters `SHADER_FUNCTIONS` to suggest preprocessor macros.
    3. **Branch B**: If typing standard text, the logic maps `NATIVE_GLSL_BUILTINS` to `CompletionItem` objects with `InsertAsSnippet` rules.
    4. Result: A dropdown menu appears with snippets and documentation.
- **Conditional Branching (Language Mapping)**:
    - In `createOrGetModel`, the logic checks file extensions:
        - `.frag` or `.vert` $\to$ sets language to `glsl`.
        - `.ts` or `.typescript` $\to$ sets language to `typescript`.
        - Default $\to$ sets language to `javascript`.

## 5. Resource Dependencies
- **Standard Libraries**: `Map`, `Array`, `Object`.
- **Internal Modules**: 
    - No direct internal module imports found in the provided source.
- **External Packages**: 
    - `@angular/core` (Injectable, inject, NgZone)
    - `Monaco Editor` (via global `window.monaco`)