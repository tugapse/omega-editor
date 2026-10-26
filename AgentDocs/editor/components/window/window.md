## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetExplorerWindow |
| Source file | window.ts |

The **AssetExplorerWindow** component serves as a specialized container designed to host dynamic content within the editor's windowing system. It acts as a wrapper that provides standardized UI elementssuch as a title bar, icons, and footerswhile leveraging Angular's dynamic component loading to render specific child views (like asset trees or grids) based on provided types.

**Functional Mission**
The primary responsibility of **AssetExplorerWindow** is to provide a consistent, movable, and manageable window interface for the Asset Explorer module. It solves the problem of UI fragmentation by encapsulating window management logic (focusing, closing, and movement) and providing a standardized shell for various sub-components to inhabit.

**System Context & Integration**
This component is a consumer of the [WindowService](/AgentDocs/editor/services/window.service.md), which it uses to manage the lifecycle and focus state of the window instance. It integrates with the [MovableDirective](/AgentDocs/editor/directives/moveable.directive.md) to allow users to reposition the window within the workspace. By accepting a `childComponentType`, it facilitates a decoupled architecture where the window shell remains agnostic of the specific data it displays, acting as a bridge between the windowing orchestration layer and the specific functional modules of the asset explorer.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `windowId` | @Input | Unique identifier used to reference this specific window instance in the [WindowService](/AgentDocs/editor/services/window.service.md). |
| `windowtitle` | @Input | The text string displayed in the window's header. |
| `windowIconName` | @Input | The identifier for the icon to be rendered in the header via [Icon](/AgentDocs/app/components/icon/icon.md). |
| `windowFooter` | @Input | Text or content string to be displayed in the window's bottom section. |
| `childComponentType` | @Input | The Angular `Type` used by `NgComponentOutlet` to dynamically instantiate the window's content. |
| `childInputs` | @Input | A key-value map of properties to be passed into the dynamically instantiated child component. |
| `isActive` | @Input | Boolean flag indicating if the window is currently the primary focused element. |
| `isMaximized` | @Input | Boolean flag indicating if the window is occupying the full workspace area. |
| `onWindowClick` | @HostListener | Triggers the `focus` method on [WindowService](/AgentDocs/editor/services/window.service.md) when the window is clicked. |
| `closeWindow` | Method | Triggers the `close` method on [WindowService](/AgentDocs/editor/services/window.service.md) for the current `windowId`. |

## 4. Execution Logic & Flow
- **Initialization**: The component receives configuration via `@Input` properties, defining its identity (`windowId`), visual appearance (`windowtitle`, `windowIconName`), and its internal content (`childComponentType`).
- **Data Path**: 
    1. **Input**: Receives `childComponentType` and `childInputs`.
    2. **Processing**: The `NgComponentOutlet` directive consumes these inputs to instantiate the component.
    3. **Output**: The rendered child component is displayed within the window's template boundaries.
- **Conditional Branching**:
    - **Focus Logic**: Upon a `mousedown` event, the component executes a call to `windowService.focus(this.windowId)`, shifting the application's focus state to this window.
    - **Lifecycle Termination**: When `closeWindow()` is invoked (typically via a UI button in the template), the component instructs the `windowService` to remove the window from the active registry.

## 5. Resource Dependencies
- **Standard Libraries**: `Type` (from `@angular/core`)
- **Internal Modules**: 
    - [MovableDirective](/AgentDocs/editor/directives/moveable.directive.md)
    - [WindowService](/AgentDocs/editor/services/window.service.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
- **External Packages**: `@angular/common` (NgComponentOutlet), `@angular/core`