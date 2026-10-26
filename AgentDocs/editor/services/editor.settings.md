## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EditorSettingsService |
| Source file | editor.settings.ts |

The **EditorSettingsService** serves as the centralized persistence and state management layer for user-specific editor configurations. It acts as a bridge between the browser's `localStorage` and the active application state, ensuring that user preferences (such as UI layouts, editor modes, or tool settings) persist across browser sessions.

**Functional Mission**
The primary responsibility of **EditorSettingsService** is to manage the lifecycle of the `EditorSettings` object. It solves the problem of volatile application state by providing a mechanism to serialize settings to JSON for local storage and deserialize them upon service instantiation, while simultaneously providing a reactive stream for other components to observe changes in real-time.

**System Context & Integration**
This service is provided at the `root` level, making it a singleton accessible throughout the entire application. It integrates deeply with the UI layer by exposing an `onSettingsChanged` `BehaviorSubject`. Downstream modules, such as the [Theme Selector](/AgentDocs/editor/components/theme-selector/theme-selector.md), can subscribe to this stream to react immediately to configuration updates. It relies on the [EditorSettings](/AgentDocs/editor/interfaces/editor-settings.md) interface to define the structure of the data it manages.

- **INTERNAL REFERENCES**: [EditorSettings](/AgentDocs/editor/interfaces/editor-settings.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `localStorage` (via `constructor`)  Used to retrieve and persist settings data.

**Hardcoded Constants:**
- `storageKey` (Default: `"omg_settings"`)  The key used to identify the settings object within the browser's `localStorage`.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `settings` | Getter | Provides read-only access to the current `EditorSettings` instance. |
| `onSettingsChanged` | BehaviorSubject | An observable stream that emits the current `EditorSettings` whenever they are updated. |
| `saveSettings()` | Method | Serializes the current settings to a JSON object and writes them to `localStorage`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The constructor attempts to retrieve a string from `localStorage` using `storageKey`.
    2. **If data exists**: The string is parsed from JSON and applied to the `_settings` instance via `fromJson()`.
    3. **If no data exists**: The `saveSettings()` method is called to initialize the `localStorage` with default values from the new `EditorSettings` instance.
    4. A new `BehaviorSubject` is initialized with the current state of `_settings`.
- **Data Path**: 
    - **Input**: JSON string from `localStorage` or updates to the `_settings` object.
    - **Processing**: `JSON.parse()` for retrieval; `toJsonObject()` for serialization.
    - **Output**: Updates to the `onSettingsChanged` stream and persistence in `localStorage`.
- **Conditional Branching**: 
    - Checks for the existence of `item` from `localStorage.getItem()` to decide between hydration (loading existing) or initialization (saving defaults).

## 5. Resource Dependencies
- **Standard Libraries**: `JSON`
- **Internal Modules**: 
    - [EditorSettings](/AgentDocs/editor/interfaces/editor-settings.md)
- **External Packages**: 
    - `@angular/core` (Injectable)
    - `rxjs` (BehaviorSubject)