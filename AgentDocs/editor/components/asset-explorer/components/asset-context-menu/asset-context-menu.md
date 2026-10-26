## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetContextMenuComponent |
| Source file | asset-context-menu.ts |

The **AssetContextMenuComponent** serves as a specialized UI overlay designed to provide contextual actions for assets within the editor's asset exploration ecosystem. It acts as a bridge between the user's intent (via right-click or selection interactions) and the underlying asset management logic, offering high-level operations such as renaming and deletion.

**Functional Mission**
The primary responsibility of **AssetContextMenuComponent** is to manage the lifecycle of a contextual menu triggered by an asset interaction. It solves the problem of providing a non-intrusive, localized interface for asset manipulation, ensuring that destructive or transformative actions (like renaming or deleting) are gated by user confirmation before being emitted to the parent controller.

**System Context & Integration**
This component is a child element within the asset explorer hierarchy, likely managed by [Assets Explorer Component](/AgentDocs/editor/components/asset-explorer/assets-explorer.component.md). It receives its positioning and target data via a required configuration input. When a user interacts with the menu, the component does not perform the business logic itself; instead, it emits events that are handled by higher-level services or components, such as [Assets Explorer Service](/AgentDocs/editor/components/asset-explorer/assets-explorer.service.md), to ensure state synchronization across the application.

- **INTERNAL REFERENCES**: [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `config` (via `input`)  Provides visibility state, screen coordinates (`x`, `y`), and the specific `targetNode` of type `IAsset` being acted upon.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `config` | `input` | Receives visibility, position, and the target `IAsset` object. |
| `rename` | `output` | Emits the new string name after successful user input via `prompt`. |
| `delete` | `output` | Emits the `IAsset` object for deletion after user confirmation via `confirm`. |
| `onRename` | `method` | Orchestrates the renaming flow: retrieves target, prompts user, and emits result. |
| `onDelete` | `method` | Orchestrates the deletion flow: retrieves target, confirms intent, and emits target. |

## 4. Execution Logic & Flow
- **Initialization**: The component relies on the `config` input being populated. It uses `ChangeDetectionStrategy.OnPush` for optimized performance, reacting only when the input reference changes.
- **Data Path**: 
    1. **Input**: `config` provides `targetNode` (an `IAsset`).
    2. **Processing**: 
        - For renaming: `targetNode.name` $\rightarrow$ `prompt()` $\rightarrow$ `newName`.
        - For deletion: `targetNode` $\rightarrow$ `confirm()` $\rightarrow$ `boolean`.
    3. **Output**: `rename.emit(newName)` or `delete.emit(node)`.
- **Conditional Branching**:
    - **Null Check**: If `config().targetNode` is null, both `onRename` and `onDelete` terminate immediately.
    - **Rename Validation**: If the user cancels the `prompt` (returns null/empty), no event is emitted.
    - **Delete Validation**: The `delete` event is only emitted if the user explicitly accepts the `confirm()` dialog.

## 5. Resource Dependencies
- **Standard Libraries**: `prompt`, `confirm` (Browser APIs)
- **Internal Modules**: 
    - [IAsset](/AgentDocs/editor/interfaces/asset.interface.md)
- **External Packages**: `@angular/core`