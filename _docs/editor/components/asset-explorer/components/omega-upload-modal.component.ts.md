## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| OmegaUploadModalComponent | [omega-upload-modal](/editor/components/asset-explorer/components/omega-upload-modal.component.ts.md) |

This component is responsible for providing a user interface for batch importing assets into the editor environment. It manages the staging process, allowing users to drag-and-drop files or browse for them, while simultaneously allowing them to configure metadata for each file, such as a custom filename and asset type. Its primary responsibility is to collect and validate these staged items before committing them to the editor's asset pipeline.

Architecturally, this component functions as a dedicated UI modal layer. It utilizes signals (`queue`) to manage the transient state of staged items and exposes public outputs (`confirmed`, `closed`) to communicate the final batch of assets or the cancellation event back to its parent controller. It relies on the `OmegaDropzoneComponent` for file ingestion and handles the internal logic for inferring asset types based on file extensions.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `targetFolderColumn` | Input | Provides the target directory path where assets will be imported. |
| `confirmed` | Output | Emitted when the user confirms the batch import, containing an array of `StagedAssetResult`. |
| `closed` | Output | Emitted when the user cancels the modal operation. |
| `queue` | Signal | A read-only signal holding the current array of `LocalStagedItem` objects awaiting confirmation. |
| `onFilesIngested` | Method | Processes an array of dropped `File` objects, adding them to the staging queue with inferred metadata. |
| `removeRow` | Method | Removes a specific staged item from the queue using its unique ID. |
| `onCancel` | Method | Triggers the `closed` output event, dismissing the modal. |
| `onConfirm` | Method | Triggers the `confirmed` output event, passing the current staged items as `StagedAssetResult[]`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component maintains a queue of staged assets. When files are ingested, they are added to this queue, and metadata (like size formatting and initial asset type inference) is calculated. The user can then modify the `customName` and `assetType` for each item within the queue. Upon confirmation, the component maps the internal `LocalStagedItem` structure to the external `StagedAssetResult` structure and emits it.
- **Side Effects:** None. The component manages internal state via signals and emits events; it does not directly interact with the network or filesystem.
- **Error Handling:** The component relies on the `inferAssetType` method to provide a default ('raw') if an extension cannot be matched, ensuring the queue always contains a valid asset type.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `FormsModule`
- **Internal:** [OmegaDropzoneComponent](/editor/components/asset-explorer/components/omega-dropzone.component.ts.md)