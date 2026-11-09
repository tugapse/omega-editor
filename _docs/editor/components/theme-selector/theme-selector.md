## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ThemeSelector | editor/components/theme-selector/theme-selector.md |

This component is responsible for providing a user interface mechanism to select and apply different visual themes to the editor environment. It manages a predefined list of available themes, allowing the user to choose one via a dropdown interface. Its primary responsibility is to synchronize the selected theme with the application's global styling context.

Architecturally, `ThemeSelector` functions as a presentation layer UI component. It utilizes the `DropdownComponent` for user interaction and directly manipulates the global `document.body` class name to apply the selected theme. It also interacts with `localStorage` to persist the user's theme preference across sessions.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `setTheme(newThemeClass: string)` | Method | Applies the provided CSS class name to the document body, changing the active theme. |
| `onItemSetected($event: DropdownItem)` | Method | Handles the selection event from the dropdown, applies the theme, updates the internal state, and saves the selection to local storage. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by mapping a static data array of theme definitions into a list of `DropdownItem` objects. It checks `localStorage` for a previously saved theme, sets the initial state, and applies that theme immediately upon construction. When a selection is made, it calls `setTheme` and persists the choice.

- **Side Effects:** Mutates the global `document.body` class name, reads from, and writes to `localStorage`.

- **Error Handling:** The constructor uses the non-null assertion operator (`!`) when finding the saved theme, assuming that if `localStorage` returns a value, a corresponding item must exist in the initialized `this.items` array.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [DropdownComponent](/editor/components/dropdown/dropdown.md)