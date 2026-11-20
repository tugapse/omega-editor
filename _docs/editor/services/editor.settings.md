## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EditorSettingsService | editor/services/editor.settings |

This service is responsible for managing the application's editor settings, ensuring that user preferences are persisted across sessions. Its primary responsibility is to provide a centralized, observable source of truth for these settings, allowing other parts of the application to react immediately when a change occurs.

Architecturally, this component functions as a state management service. It acts as a bridge between the in-memory state (`_settings`) and persistent storage (`localStorage`), exposing the current state via a `BehaviorSubject` (`onSettingsChanged`) for reactive consumption throughout the application, while relying on the `EditorSettings` interface for data structure integrity.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EditorSettingsService | Class | Manages loading, saving, and providing access to application editor settings. |
| settings | Getter | Returns the current instance of `EditorSettings`. |
| onSettingsChanged | BehaviorSubject | An observable stream that emits the current `EditorSettings` whenever they change. |
| saveSettings | Method | Persists the current state of `_settings` to `localStorage`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service initializes by attempting to retrieve settings from `localStorage` using a predefined key. If data exists, it deserializes it into the internal `_settings` object. If not, it initializes with default settings and immediately saves them. The `onSettingsChanged` subject is initialized with the loaded or default settings. Changes are propagated by calling `saveSettings()` after modification.

- **Side Effects:** Reads from and writes to the browser's `localStorage` (external/global state mutation).

- **Error Handling:** No explicit error handling is shown for `JSON.parse` or `localStorage` operations, relying on standard JavaScript behavior for potential parsing failures.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `rxjs`
- **Internal:** [editor-settings](/editor/interfaces/editor-settings.md)