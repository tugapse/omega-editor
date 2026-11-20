## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | OmegaUploadModalComponent |
| Source file | omega-upload-modal.component.ts.ts |

The **OmegaUploadModalComponent** serves as a specialized staging interface for asset ingestion within the editor's filesystem hierarchy. It provides a controlled environment where users can drop multiple files, review their metadata, and manually override target filenames or asset classifications before committing them to the permanent project structure.

**Functional Mission**
The primary responsibility of **OmegaUploadModalComponent** is to act as a buffer between raw local file system input and the application's asset management services. It solves the problem of "blind ingestion" by allowing users to perform batch metadata configuration (renaming and type-casting) in a transient state, ensuring that assets are correctly categorized (e.g., as textures, audio, or scripts) before they hit the backend or the core asset manager.

**System Context & Integration**
This component functions as a high-level UI orchestrator within the asset explorer workflow. It receives a `targetFolderColumn` input to determine the destination path and utilizes [OmegaDropzoneComponent](/AgentDocs/editor/components/asset-explorer/components/omega-dropzone.component.md) to handle file acquisition. Once the user confirms the batch, the component emits a `StagedAssetResult[]` array via the `confirmed` output, which is intended to be consumed by services responsible for actual file persistence and filesystem synchronization.

- **INTERNAL REFERENCES**: [OmegaDropzoneComponent](/AgentDocs/editor/components/asset-explorer/components/omega-dropzone.component.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `targetFolderColumn` (via `input`)  Defines the destination directory within the asset hierarchy.

**Hardcoded Constants:**
- `k` (Default: `1024`)  Used in `formatBytes` for byte-to-unit conversion.
- `sizes` (Default: `['Bytes', 'KB', 'MB']`)  Unit labels for file size formatting.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `targetFolderColumn` | `input<string>` | Receives the destination path for the staged assets. |
| `confirmed` | `output<StagedAssetResult[]>` | Emits the finalized array of files with user-defined metadata. |
| `closed` | `output<void>` | Emits a signal to terminate the modal lifecycle. |
| `queue` | `signal<LocalStagedItem[]>` | Manages the reactive state of the current staging list. |
| `onFilesIngested` | `Method` | Processes raw `File` objects into the internal staging queue with inferred types. |
| `removeRow` | `Method` | Removes a specific item from the staging queue by ID. |
| `onCancel` | `Method` | Triggers the `closed` output. |
| `onConfirm` | `Method` | Maps the internal `LocalStagedItem` state to the public `StagedAssetResult` format and emits `confirmed`. |
| `inferAssetType` | `Private Method` | Logic to map file extensions to internal asset categories (image, audio, code, etc.). |
| `formatBytes` | `Private Method` | Converts numeric byte values into human-readable strings. |

## 4. Execution Logic & Flow
- **Initialization**: The component initializes with an empty `queue` signal. It waits for the `targetFolderColumn` input to be provided by the parent context.
- **Data Path**: 
    1. **Ingestion**: `onFilesIngested` receives `File[]` $\rightarrow$ `inferAssetType` determines category $\rightarrow$ `formatBytes` calculates size $\rightarrow$ items are pushed to `queue`.
    2. **Modification**: User interacts with `ngModel` on `customName` or `assetType` $\rightarrow$ `queue` signal updates reactively.
    3. **Finalization**: `onConfirm` $\rightarrow$ `queue` is mapped to `StagedAssetResult[]` (stripping internal `id` and `sizeFormatted`) $\rightarrow$ `confirmed` is emitted.
- **Conditional Branching**:
    - **Queue State**: If `queue().length === 0`, the UI renders an `empty-queue-fallback` view; otherwise, it renders the `scrollable-queue-list`.
    - **Asset Type Mapping**: `inferAssetType` uses extension-based branching to assign types; if no match is found, it defaults to `'raw'`.
    - **Button State**: The "Import Batch" button is disabled if the `queue` is empty.

## 5. Resource Dependencies
- **Standard Libraries**: `crypto` (for `randomUUID`)
- **Internal Modules**: 
    - [OmegaDropzoneComponent](/AgentDocs/editor/components/asset-explorer/components/omega-dropzone.component.md)
- **External Packages**: `@angular/core`, `@angular/forms`