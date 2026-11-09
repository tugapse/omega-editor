## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AddBehaviourMenuComponent | editor/components/add-scene-entity-menu/add-scene-entity-menu |

This component is responsible for presenting a searchable, interactive menu of available behaviors that can be added to a scene entity. It encapsulates the logic for filtering a list of `ClassMetadata` based on user input, allowing developers to quickly locate and select the desired behavior from a potentially large catalog.

Architecturally, this component functions as a specialized UI component within the editor's entity management system. It extends [SearchableMenuComponent](/editor/components/searchable-menu/searchable-menu.md) to inherit core menu functionality, while specifically managing and emitting events related to `ClassMetadata` objects, thereby integrating the behavior selection process into the broader editor workflow.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| behaviours | Input | An array of `ClassMetadata` objects representing all available behaviors to be displayed in the menu. |
| behaviourSelected | Output | An event emitter that fires when a user selects a `ClassMetadata` object from the menu. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component implements a getter, `filteredBehaviours`, which dynamically filters the input `behaviours` array. Filtering occurs based on whether the search query matches the behavior's name, description, or type (case-insensitive).
- **Side Effects:** None. The component is purely declarative and reactive, managing state changes via inputs and emitting events via outputs.
- **Error Handling:** No explicit error handling is implemented; filtering relies on the optional nature of `b.description!`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [SearchableMenuComponent](/editor/components/searchable-menu/searchable-menu.md)