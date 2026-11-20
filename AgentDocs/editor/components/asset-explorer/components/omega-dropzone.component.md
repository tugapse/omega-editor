## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | OmegaDropzoneComponent |
| Source file | omega-dropzone.component.ts |

The **OmegaDropzoneComponent** is a specialized UI utility designed to facilitate file ingestion within the editor environment. It provides a highly interactive, visual target for users to either drag and drop files from their local operating system or trigger a standard file selection dialog via a click event.

**Functional Mission**
The primary responsibility of **OmegaDropzoneComponent** is to abstract the complexities of HTML5 Drag and Drop APIs and file input handling into a single, reactive component. It solves the problem of providing a consistent, visually responsive interface for asset uploading, ensuring that the user receives immediate visual feedback (via state changes) when files are hovered over the drop zone.

**System Context & Integration**
This component acts as an entry point for raw file data into the application's asset management pipeline. While it handles the low-level DOM events and file extraction, it does not process the files itself; instead, it emits the resulting `File[]` array through its `filesDropped` output. This output is intended to be consumed by parent components or services, such as [Assets Explorer Service](/AgentDocs/editor/components/asset-explorer/assets-explorer.service.md) or [Assets Upload Trigger Service](/AgentDocs/editor/components/asset-explorer/assets-upload-triger.service.md), to initiate the actual upload or ingestion process into the project structure.

## 2. Environment & Configuration
**Environment Lookups:**
- `var(--editor-panel-background-50)`  CSS variable for the container background.
- `var(--editor-panel-text-input-border)`  CSS variable for the dashed border color.
- `var(--editor-panel-H-color)`  CSS variable for the highlight/hover border color.
- `var(--editor-panel-background-10)`  CSS variable for the hover background color.
- `var(--editor-focus-shadow)`  CSS variable for the drop-active shadow effect.
- `var(--editor-panel-text-input-background)`  CSS variable for the active drag background.
- `var(--editor-icon-button-color)`  CSS variable for the icon color.
- `var(--editor-panel-color)`  CSS variable for the primary text color.
- `var(--editor-placeholder-icon-color)`  CSS variable for the secondary text color.

**Hardcoded Constants:**
- `min-height: 140px` (Default: `140px`)  Minimum height of the dropzone container.
- `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)` (Default: `0.2s`)  Animation timing for hover/drag states.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `filesDropped` | `output<File[]>` | Emits an array of `File` objects when a drop or selection event occurs. |
| `isDragging` | `signal<boolean>` | Reactive state tracking whether a file is currently being hovered over the component. |
| `onDragOver` | `Method` | Prevents default browser behavior and sets `isDragging` to `true`. |
| `onDragLeave` | `Method` | Resets `isDragging` to `false` when the drag leaves the component area. |
| `onDrop` | `Method` | Handles the drop event, extracts files from `dataTransfer`, and triggers emission. |
| `triggerFilePicker` | `Method` | Programmatically invokes the hidden `<input type="file">` element. |
| `onFileSelected` | `Method` | Handles manual file selection via the file picker and triggers emission. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The component initializes with `isDragging` set to `false`.
    - The `fileInput` view child is captured for programmatic access.
    - The host element is assigned the class `omega-dropzone-block`.
- **Data Path**: 
    - **Input**: User interaction (Drag/Drop or Click/Select).
    - **Processing**: 
        - If Drag/Drop: `DragEvent.dataTransfer.files` is accessed.
        - If Click/Select: `HTMLInputElement.files` is accessed.
        - Files are converted from `FileList` to a standard `File[]` array via `Array.from()`.
    - **Output**: The `filesDropped` output emits the `File[]` array.
- **Conditional Branching**:
    - **Drag State**: `onDragOver` sets `isDragging` to `true`; `onDragLeave` or `onDrop` sets it to `false`.
    - **File Validation**: Inside `onDrop` and `onFileSelected`, the logic checks if `files.length > 0` before attempting to emit to prevent empty emissions.
    - **Input Reset**: In `onFileSelected`, `input.value` is cleared after processing to allow the user to select the same file twice in succession.

## 5. Resource Dependencies
- **Standard Libraries**: `Array` (for `Array.from`)
- **Internal Modules**: 
    - None (The component is standalone and relies on Angular core primitives).
- **External Packages**: 
    - `@angular/core` (Component, output, signal, HostListener, viewChild, ElementRef)