## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| OmegaDropzoneComponent | [omega-dropzone](/editor/components/asset-explorer/components/omega-dropzone.component.md) |

This component provides a reusable, interactive dropzone interface designed to accept file uploads from the user via drag-and-drop or by triggering a native file picker dialog. Its primary responsibility is to manage the visual state of the dropzoneindicating when files are being dragged over itand to emit the collected `File` objects to consuming parts of the application.

Architecturally, this component functions as a specialized UI component within the asset explorer module. It encapsulates the complex DOM event handling required for drag-and-drop operations (`dragover`, `dragleave`, `drop`) and file input selection. It communicates its results externally via the `filesDropped` output, allowing parent components to handle the subsequent asset processing or storage logic.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| filesDropped | Output | Emits an array of `File` objects when files are successfully dropped or selected. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component manages two primary input mechanisms: a native `<input type="file">` triggered by a click, and native browser drag-and-drop events. It uses Angular Signals (`isDragging`) to manage the visual state, which is bound to the host element's class. When a drop occurs, it prevents default browser behavior, extracts the `FileList`, and emits the files.
- **Side Effects:** Interacts with the browser's DOM and file system access layer (via the native `File` object). It triggers the native file input element's click event.
- **Error Handling:** The component handles the absence of files during drop or selection by checking `event.dataTransfer?.files` or `input.files` before emitting, preventing runtime errors from empty lists.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None