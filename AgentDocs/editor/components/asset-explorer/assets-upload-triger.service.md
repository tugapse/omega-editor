## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AssetsUploadTriggerService |
| Source file | assets-upload-triger.service.ts |

The **AssetsUploadTriggerService** serves as a programmatic orchestrator for spawning asset upload workflows within the Omega Editor. It acts as a bridge between high-level user intent (such as clicking an "upload" button in the asset explorer) and the low-level imperative instantiation of a UI modal component.

**Functional Mission**
The primary responsibility of **AssetsUploadTriggerService** is to manage the lifecycle of the `OmegaUploadModalComponent`. It solves the problem of triggering complex, stateful UI overlays that are not part of the static routing tree, allowing for "on-demand" modal injection directly into the application's DOM.

**System Context & Integration**
This service operates as a utility within the asset management subsystem. It utilizes the `ApplicationRef` and `EnvironmentInjector` to create a component context that is completely detached from standard layout routes. Once the `OmegaUploadModalComponent` is instantiated, the service manages the subscription to its internal event emitters (`confirmed` and `closed`). It facilitates the transition of data by converting component-level events into an `Observable` stream of `StagedAssetResult[]`, which downstream consumers can subscribe to for processing the newly uploaded assets.

- **INTERNAL REFERENCES**: [OmegaUploadModalComponent](/AgentDocs/editor/components/asset-explorer/components/omega-upload-modal.component.ts.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `injector` (via `EnvironmentInjector`)  Used to provide the necessary dependency injection context for the dynamically created component.
- `appRef` (via `ApplicationRef`)  Used to attach the component's host view to the application's change detection tree.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `openUploadDialog` | Method | Programmatically creates, configures, and displays the upload modal; returns an `Observable` of the upload results. |
| `destroyModal` | Method | Performs cleanup by detaching the component view from the `ApplicationRef` and destroying the component instance. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives `targetVirtualPath` as a destination context.
    2. Creates a new `Subject` to manage the lifecycle of the returned `Observable`.
    3. Uses `createComponent` to instantiate `OmegaUploadModalComponent` using the service's `EnvironmentInjector`.
- **Data Path**: 
    1. **Input**: `targetVirtualPath` is passed into the component via `componentRef.setInput('targetFolderColumn', ...)`.
    2. **Processing**: The service listens to the `confirmed` output of the modal.
    3. **Output**: Upon confirmation, the `stagedData` is pushed through the `result$` subject, the subject is completed, and the modal is destroyed.
- **Conditional Branching**:
    - **On Confirmation**: If the `confirmed` event fires, the data is emitted, the stream completes, and `destroyModal` is called.
    - **On Cancellation**: If the `closed` event fires, the stream completes without emitting data, and `destroyModal` is called.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs` (Subject, Observable)
- **Internal Modules**: 
    - [OmegaUploadModalComponent](/AgentDocs/editor/components/asset-explorer/components/omega-upload-modal.component.ts.md)
- **External Packages**: `@angular/core` (inject, Injectable, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector)