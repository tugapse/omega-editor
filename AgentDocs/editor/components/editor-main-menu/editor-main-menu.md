## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EditorMainMenu |
| Source file | editor-main-menu.ts |

The **EditorMainMenu** component serves as the primary navigational orchestration layer for the editor's top-level interface. It acts as a centralized command hub, providing users with access to global editor functions, view toggles, and window management tools.

**Functional Mission**
The primary responsibility of **EditorMainMenu** is to manage and render the application's top-level menu structure and dispatch high-level commands based on user interaction. It solves the problem of centralized command routing by mapping menu item identifiers to specific service calls that modify the editor's state, visibility settings, or windowing system.

**System Context & Integration**
This component sits at the top of the UI hierarchy, acting as a bridge between user intent and the underlying editor services. It integrates deeply with the workspace configuration via [EditorSettingsService](/AgentDocs/editor/services/editor.settings.md) to toggle UI panels, utilizes [WindowService](/AgentDocs/editor/services/window.service.md) to spawn floating utility windows like the [SoundMixerComponent](/AgentDocs/editor/components/sound-mixer/sound-mixer.md) and [AssetsExplorerComponent](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md), and communicates with [EditorStateService](/AgentDocs/editor/services/editor-state.service.md) to switch the central workspace view (e.g., to the [CodeWorkspaceComponent](/AgentDocs/code-editor/editor/code-editor.component.md)).

- **INTERNAL REFERENCES**: 
    - [MenuItemComponent](/AgentDocs/editor/components/menu-item/menu-item.md)
    - [SoundMixerComponent](/AgentDocs/editor/components/sound-mixer/sound-mixer.md)
    - [AssetsExplorerComponent](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md)
    - [CodeWorkspaceComponent](/AgentDocs/code-editor/editor/code-editor.component.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `edit` (string)  Identifier for the Edit menu.
- `view` (string)  Identifier for the View menu.
- `windows` (string)  Sub-menu identifier for window management.
- `panels` (string)  Sub-menu identifier for layout management.
- `mixer` (string)  Identifier for the Sound Mixer command.
- `assetExplorer` (string)  Identifier for the Asset Explorer command.
- `codeEditor` (string)  Identifier for the Code Editor command.
- `leftSidebar` (string)  Identifier for toggling the left panel.
- `rightSidebar` (string)  Identifier for toggling the right panel.
- `footer` (string)  Identifier for toggling the footer panel.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `items` | `@Input()` | External menu items to be appended to the default menu structure. |
| `menuItemClicked` | `@Output()` | Event emitter notifying parent components when a menu item is selected. |
| `displayItems` | Property | The processed array of `MenuItem` objects used for rendering. |
| `createMenuItems()` | Method | Populates `displayItems` with hardcoded system menus and injected items. |
| `onMenuItemClick(menuItem: MenuItem)` | Method | The central dispatcher that executes logic based on the `menuItem.id`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The constructor injects `WindowService`, `EditorSettingsService`, and `EditorStateService`.
    2. `createMenuItems()` is invoked immediately to build the menu hierarchy.
    3. The `displayItems` array is populated with "Edit", "View" (containing Windows and Panels sub-menus), and any provided `@Input() items`.
- **Data Path**: 
    - `Input (items)` $\rightarrow$ `createMenuItems()` $\rightarrow$ `displayItems` $\rightarrow$ `Template Rendering`.
- **Conditional Branching**: 
    - `onMenuItemClick` uses a `switch` statement on `menuItem.id`:
        - **Layout Toggles**: If `leftSidebar`, `rightSidebar`, or `footer` is clicked, it performs a boolean negation on the corresponding property in `editorSettings.settings.workspace`.
        - **Window Spawning**: If `mixer` or `assetExplorer` is clicked, it calls `windowService.open()` with specific component configurations.
        - **State Switching**: If `codeEditor` is clicked, it updates the `editorStateService.centralView` to `'code'`.
        - **Default**: No action is taken for unknown IDs.

## 5. Resource Dependencies
- **Standard Libraries**: (None identified)
- **Internal Modules**: 
    - [MenuItemComponent](/AgentDocs/editor/components/menu-item/menu-item.md)
    - [WindowService](/AgentDocs/editor/services/window.service.md)
    - [EditorSettingsService](/AgentDocs/editor/services/editor.settings.md)
    - [EditorStateService](/AgentDocs/editor/services/editor-state.service.md)
    - [SoundMixerComponent](/AgentDocs/editor/components/sound-mixer/sound-mixer.md)
    - [AssetsExplorerComponent](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md)
    - [CodeWorkspaceComponent](/AgentDocs/code-editor/editor/code-editor.component.md)
- **External Packages**: `@angular/core`