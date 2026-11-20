## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| IAsset | editor/interfaces/asset.interface |

This interface defines the canonical structure for any asset managed within the editor system. It serves as a contract ensuring that all assets, whether they represent physical files, organizational folders, or other abstract types, possess a consistent set of metadata required for traversal, identification, and manipulation within the project structure.

This component acts as a core data model definition, residing within the editor's interface layer. It is fundamental to how the application manages its content hierarchy, providing the necessary blueprint for components that interact with the file system or project state, such as those found in [editor/components/project-view.md].

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| IAsset | Interface | Defines the structure for a single asset, including its unique ID, name, path, type, project association, and optional children. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None