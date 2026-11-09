## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SceneList | /app/components/scene-list/scene-list.md |

This component is responsible for displaying a list of existing scenes associated with a specific project and providing functionality to create new scenes. Its primary responsibility is to fetch scene assets from the backend API when a project context is provided and to manage the user interface for scene selection and creation.

Architecturally, `SceneList` functions as a presentation and controller component within the UI layer. It relies heavily on the `AssetService` for all data interactions (listing and uploading assets) and uses the `Router` to navigate the user to the editor view upon scene selection. It consumes the `ProjectResponse` input to scope its operations.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `project` | Input | The `ProjectResponse` object containing project metadata, used to scope asset loading and creation. |
| `scenes` | Property | An array holding the `AssetResponse` objects representing the scenes available in the current project. |
| `isModalOpen` | Property | Boolean state controlling the visibility of the "Create New Scene" modal. |
| `newSceneName` | Property | String holding the name input for a newly created scene. |
| `navigateToEditor(scene: AssetResponse)` | Method | Navigates the user to the editor view for the specified scene ID within the current project. |
| `openNewSceneModal()` | Method | Triggers the display of the modal interface for creating a new scene. |
| `closeModal()` | Method | Hides the creation modal and resets the input field. |
| `createScene()` | Method | Handles the logic for creating a new scene by generating a file object and uploading it via the `AssetService`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by listening for changes to the `project` input. Upon receiving a project, it calls `loadScenes()` to fetch all assets of type `Scene` for that project ID. The `createScene()` method constructs a `Scene` object, serializes it, wraps it in a `File` object, and then uploads it to the server, subsequently reloading the scene list upon success.

- **Side Effects:** The code interacts heavily with the network via `AssetService.listAssets` and `AssetService.uploadAsset`. It also mutates the component's internal state (`scenes`, `isModalOpen`, `newSceneName`) and uses the `Router` to navigate the application.

- **Error Handling:** Errors during scene loading are caught, logging the error and setting `this.scenes` to an empty array. Errors during scene creation are caught, logging the error, and noting a FIXME for implementing an info popup.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`, `@angular/common`, `@angular/forms`, `omega-game-engine`
- **Internal:** [AssetService](/app/components/scene-list/asset.service.md), [AssetResponse](/app/api/models/omega-api.models.md), [ProjectResponse](/app/api/models/omega-api.models.md), [Icon](/app/components/icon/icon.md), [EngineAssetType](/app/editor/models/asset-types.md)