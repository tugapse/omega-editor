## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AssetContextMenuComponent | [asset-context-menu](/editor/components/asset-explorer/components/asset-context-menu/asset-context-menu.md) |

This component is responsible for rendering and managing the context menu that appears when a user right-clicks on an asset within the asset explorer view. Its primary function is to provide immediate, actionable options related to the selected asset, such as renaming or deleting it, based on user interaction.

Architecturally, this component serves as a presentation layer UI element. It consumes configuration data, specifically the target asset and its visibility state, via an input. It communicates user intent (rename or delete) back up to parent components via its `rename` and `delete` outputs, allowing higher-level logic to handle the actual state mutations.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| config() | Input | Required configuration object containing `visible` (boolean), `x` (number), `y` (number), and `targetNode` (`IAsset` \| null). |
| rename | Output | Emits the new name (string) when the user chooses to rename the asset. |
| delete | Output | Emits the deleted asset (`IAsset`) when the user confirms deletion. |
| onRename() | Method | Prompts the user for a new name for the target asset and emits the result if provided. |
| onDelete() | Method | Prompts the user for confirmation and emits the target asset if deletion is confirmed. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component uses Angular's `input` and `output` mechanisms to receive state and emit events. The `onRename` method utilizes the browser's native `prompt()` function to gather input, while `onDelete` uses `confirm()` for user confirmation before emitting the asset object.
- **Side Effects:** The component interacts with the browser's native UI functions (`prompt` and `confirm`), which constitutes a side effect by interacting with the global browser state/input mechanisms.
- **Error Handling:** The `onRename` method checks if `targetNode` is null before attempting to prompt. The `onDelete` method checks if `targetNode` exists and only proceeds if the user confirms the deletion prompt.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [IAsset](/editor/interfaces/asset.interface.md)