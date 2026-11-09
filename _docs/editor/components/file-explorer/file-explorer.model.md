## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| FileNode, ContextMenuAction | editor/components/file-explorer/file-explorer.model |

This file defines the core data structures used throughout the file explorer module. It establishes the blueprint for representing individual items within the file system hierarchy, whether they are actual files or directories. By standardizing these structures, the application ensures consistent data handling across different parts of the UI and business logic.

These interfaces serve as the foundational data model for the file explorer component. `FileNode` dictates the structure of a file or directory, including metadata like size and extension, while `ContextMenuAction` defines the structure for actions available when a user interacts with a node. These models are consumed by the UI components and services responsible for rendering and managing the file tree.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| FileNode | Interface | Represents a single item in the file system tree, containing name, path, type, and optional metadata like size and children. |
| ContextMenuAction | Interface | Defines an action available in a context menu, including a unique ID, display label, and optional icon. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None