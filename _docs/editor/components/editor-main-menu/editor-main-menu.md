## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EditorMainMenu | /editor/components/editor-main-menu/editor-main-menu.md |

This component is responsible for rendering the main application menu structure, providing users with access to various editor functionalities through a hierarchical menu system. Its primary role is to manage the display logic for menu items, both those defined internally (like 'Edit' or 'View') and those passed in via external inputs.

Architecturally, `EditorMainMenu` functions as a primary UI component that acts as a controller for menu interactions. It utilizes services like [WindowService](/editor/services/window.service.md) and [EditorSettingsService](/editor/services/editor.settings.md) to execute actions when a user selects a menu item, such as opening new windows or toggling panel visibility.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `items` | Input | An array of `MenuItem` objects passed into the component to augment the default menu structure. |
| `menuItemClicked` | Output | An event emitter that fires when any menu item is clicked, passing the clicked `MenuItem` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes its menu structure in the constructor by calling `createMenuItems()`. This method populates `displayItems` with predefined top-level items and nested sub-menus. The `onMenuItemClick` method uses a `switch` statement to handle the logic associated with specific item IDs, triggering state changes or window openings based on the selected item.

- **Side Effects:** The component mutates external state by calling methods on `EditorSettingsService` to toggle UI visibility flags (e.g., `showLeftpanel`) and interacts with the application environment by calling `WindowService.open()` to launch new editor windows. It also updates the central view state via `EditorStateService`.

- **Error Handling:** No explicit exception handling is implemented; actions are performed based on the `menuItem.id` matching predefined cases, with a `default` case serving as a fallback for unhandled IDs.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [MenuItemComponent](/editor/components/editor-main-menu/menu-item.md), [WindowService](/editor/services/window.service.md), [SoundMixerComponent](/editor/components/sound-mixer/sound-mixer.md), [AssetsExplorerComponent](/editor/components/asset-explorer/assets-explorer.component.md), [EditorSettingsService](/editor/services/editor.settings.md), [CodeWorkspaceComponent](/editor/components/code-editor/editor/code-editor.component.md), [EditorStateService](/editor/services/editor-state.service.md)