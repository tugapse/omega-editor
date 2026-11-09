## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AssetIcons | editor/components/asset-explorer/icons |

This file defines a constant object, `AssetIcons`, which serves as a centralized mapping for asset types to their corresponding icon names. Its primary responsibility is to provide a consistent, standardized lookup mechanism for rendering visual representations of different types of assets within the editor interface.

This component functions as a static data provider, residing within the UI component layer of the application. It is consumed by various parts of the asset explorer to ensure that the correct visual glyph is displayed when an asset of a specific type (like 'image' or 'material') is encountered, thereby maintaining UI consistency across the application.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| AssetIcons | Object | A map where keys are asset type strings and values are the corresponding icon class names (e.g., 'fa-file'). |

## 3. Implementation Details & Side Effects
- **Core Logic:** The file initializes and exports a constant object literal that maps predefined string keys (asset types) to specific string values (Font Awesome icon classes).
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** None.