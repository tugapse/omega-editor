## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AddBehaviourMenuComponent | editor/components/add-behaviour-menu/add-behaviour-menu |

This component is responsible for presenting a searchable, interactive menu that allows a user to select a specific game behaviour from a provided list. It manages the visibility of the menu, handles user input via search, and emits events upon selection or dismissal.

Architecturally, this component functions as a specialized UI component within the editor interface. It consumes an array of `ClassMetadata` objects via the `behaviours` input and communicates selection changes or menu closures back to its parent container, which likely manages the overall editor state or scene graph.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `behaviours` | Input | An array of `ClassMetadata` objects representing available behaviours. |
| `isOpen` | Input | Boolean flag controlling the visibility state of the menu. |
| `menuX` | Input | The X coordinate position for rendering the menu. |
| `menuY` | Input | The Y coordinate position for rendering the menu. |
| `behaviourSelected` | Output | Emitted when a user successfully selects a behaviour. |
| `closeMenu` | Output | Emitted when the menu should be dismissed (e.g., by clicking outside). |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component filters the input `behaviours` array based on the `searchQuery` entered by the user, providing a dynamic, filtered list. It uses `@HostListener` to capture global document clicks, allowing it to close the menu if the click occurs outside its bounds. Selection triggers both the emission of the selected item and the closure of the menu.

- **Side Effects:** The component emits events (`behaviourSelected`, `closeMenu`) which cause state changes in parent components. It also uses `ElementRef` to monitor DOM events for external click detection.

- **Error Handling:** No explicit error handling (try/catch blocks) is implemented; filtering operations rely on the assumption that `ClassMetadata` objects are correctly structured.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [ClassMetadata](/omega-game-engine.md)