## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AssetsUploadTriggerService | [assets-upload-triger-service](/editor/components/asset-explorer/assets-upload-triger.service.md) |

This service is responsible for programmatically triggering and managing the lifecycle of a modal component responsible for asset uploads. Its primary function is to instantiate the `OmegaUploadModalComponent` dynamically, configure it with a target directory, and manage the asynchronous communication flow until the user confirms or cancels the upload process.

Architecturally, this service acts as a dedicated controller/utility layer within the asset explorer feature. It abstracts the complex DOM manipulation and component lifecycle management required to display a modal overlay globally, allowing other parts of the application to initiate uploads simply by calling `openUploadDialog` and subscribing to the resulting `Observable<StagedAssetResult[]>`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| openUploadDialog | Method | Spawns the modern staging modal overlay. Accepts a `targetVirtualPath` string and returns an Observable that emits an array of `StagedAssetResult` upon successful import, or completes without value if canceled. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service uses Angular's `createComponent` and `ApplicationRef` to instantiate and attach the modal component outside of the standard component tree. It subscribes to the modal's `confirmed` and `closed` events to resolve the returned Observable. The component is attached to the global `document.body` for overlay presentation.
- **Side Effects:** Mutates global state by appending the modal's root DOM element to `document.body`. It also manages the lifecycle of the component instance by calling `destroy()` and detaching the view.
- **Error Handling:** The service relies on the modal component emitting a `closed` event to complete the observable gracefully, effectively handling cancellation without throwing an error.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** rxjs
- **Internal:** [OmegaUploadModalComponent](/editor/components/omega-upload-modal.component.md)