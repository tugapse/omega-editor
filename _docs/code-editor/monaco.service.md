## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| MonacoService | code-editor/monaco.service |

This component is responsible for encapsulating the entire lifecycle and interaction with the Monaco Editor instance within an Angular application context. Its primary responsibility is to initialize, configure, and manage the editor, providing specialized features such as custom language support for GLSL shaders and advanced IntelliSense completions for mathematical functions.

It functions as a dedicated service layer, abstracting the complexity of the Monaco Editor API from the rest of the application. It integrates deeply with the UI by handling theme application, event subscriptions (like saving and marker changes), and managing the loading of external dependencies, fitting squarely into the application's core service architecture.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `loadDependencies(onReady: () => void)` | Method | Loads the Monaco Editor dependencies asynchronously by injecting a script tag and waiting for the `require` function to be available. |
| `createEditor(container: HTMLElement, onSave: () => void, onMarkerChange: (errors: number, warnings: number) => void): any` | Method | Initializes and returns a configured Monaco Editor instance bound to a specified DOM container, setting up event listeners for saving and error/warning tracking. |
| `setModel(model: any)` | Method | Sets the content model of the existing editor instance to a provided model. |
| `getModelValue(): string` | Method | Retrieves the current text content from the editor model. |
| `clearAllModelMarkers(source: string)` | Method | Removes all diagnostic markers (errors/warnings) from the editor model associated with a given source. |
| `setModelMarkers(source: string, errorMarkers: any[])` | Method | Applies a set of diagnostic markers (errors/warnings) to the editor model. |
| `createOrGetModel(path: string, content: string, language: string): any` | Method | Creates a new Monaco model or retrieves an existing one based on the provided file path and content, automatically determining the correct language ID. |
| `updateIntelliSenseDefinitions(filePath: string, declarationContent: string): void` | Method | Adds an external library definition to the TypeScript language service, allowing the editor to understand custom types defined in the provided content. |
| `isEditorReady(): boolean` | Method | Checks if the Monaco Editor instance has been successfully initialized. |
| `disposeEditor(): void` | Method | Cleans up all resources associated with the editor, including disposing of extra library definitions and destroying the editor instance. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service manages two primary feature sets: a custom GLSL language provider using Monarch tokens for syntax highlighting, and a completion provider that offers context-aware suggestions. It uses a static map (`NATIVE_GLSL_BUILTINS`) to provide rich, snippet-enabled suggestions for mathematical functions when the user is typing in GLSL mode. It also dynamically loads the Monaco library via a script tag if it's not already present on the window object.
- **Side Effects:** Interacts heavily with the global `window` object to load external scripts (`loader.js`) and utilizes `document.body.appendChild` for dependency loading. It mutates the state of the editor instance (`this.editorInstance`) and manages external library handles via `this.extraLibs`.
- **Error Handling:** The `loadDependencies` method uses `onload` callbacks to handle the asynchronous loading of the Monaco library. The `createEditor` method relies on the existence of the `monaco` object on `window` before proceeding with configuration.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** None