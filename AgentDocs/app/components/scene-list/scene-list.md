## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SceneList |
| Source file | scene-list.ts |

The **SceneList** component serves as a specialized management interface for scene assets within a specific project context. It provides users with a visual registry of existing scenes and the capability to instantiate new scene files directly through the editor interface.

**Functional Mission**
The primary responsibility of **SceneList** is to facilitate the lifecycle management of scene assets. It solves the problem of scene discovery and creation by fetching scene-type assets from the backend via the `AssetService` and providing a modal-driven workflow for generating new `.scene` files with valid JSON structures.

**System Context & Integration**
This component acts as a bridge between the project selection state and the editor environment. It reacts to changes in the `project` input, triggering data fetches to populate its internal list. When a user selects a scene, the component utilizes the `Router` to transition the application state into the editor mode, passing the specific project and scene identifiers via the URL. It relies heavily on the `AssetService` for all remote data operations and uses `EngineAssetType` to filter relevant assets.

- **INTERNAL REFERENCES**: 
    - [AssetService](/AgentDocs/app/api/services/asset.service.md)
    - [ProjectResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [AssetResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [EngineAssetType](/AgentDocs/editor/models/asset-types.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `project.id` (via `ngOnChanges`)  Used to scope asset requests to a specific project.

**Hardcoded Constants:**
- `.scene` (Default: `".scene"`)  File extension suffix applied to new scene names.
- `/Scenes/` (Default: `"/Scenes/"`)  Virtual path prefix for newly created scene assets.
- `application/json` (Default: `"application/json"`)  MIME type for the generated scene file.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `project` | `@Input` | Receives the current active project metadata to drive scene loading. |
| `scenes` | Property | Holds the array of `AssetResponse` objects filtered by `EngineAssetType.Scene`. |
| `isModalOpen` | Property | Boolean flag controlling the visibility of the new scene creation modal. |
| `newSceneName` | Property | Buffer for the user-inputted name of the new scene. |
| `loadScenes()` | Method | Private method that fetches scene assets from the `AssetService`. |
| `navigateToEditor(scene)` | Method | Navigates the application to the editor route using project and scene IDs. |
| `openNewSceneModal()` | Method | Sets `isModalOpen` to true. |
| `closeModal()` | Method | Resets modal state and clears the name buffer. |
| `createScene()` | Method | Orchestrates the creation of a `Scene` object, converts it to a `File`, and uploads it. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Component initializes with empty `scenes` array and `isModalOpen` set to `false`.
    - `ngOnChanges` monitors the `project` input; if a valid project is provided, `loadScenes()` is invoked.
- **Data Path**: 
    - **Input**: `ProjectResponse` $\rightarrow$ **Processing**: `AssetService.listAssets(id, SceneType)` $\rightarrow$ **Filtering**: `response.assets.filter(...)` $\rightarrow$ **Output**: `this.scenes` array.
    - **Creation Path**: `newSceneName` $\rightarrow$ **Sanitization**: Append `.scene` if missing $\rightarrow$ **Object Creation**: `new Scene()` $\rightarrow$ **Serialization**: `JSON.stringify(toJsonObject())` $\rightarrow$ **Upload**: `AssetService.uploadAsset(...)`.
- **Conditional Branching**:
    - **Project Check**: If `this.project?.id` is missing during `loadScenes` or `createScene`, the operation is aborted with an error log.
    - **Name Validation**: In `createScene`, if `newSceneName` is empty/whitespace, the function returns early.
    - **Error Handling**: `loadScenes` and `createScene` both implement `error` callbacks in their subscriptions to log failures to the console and prevent application crashes.

## 5. Resource Dependencies
- **Standard Libraries**: `JSON` (Serialization)
- **Internal Modules**: 
    - [AssetService](/AgentDocs/app/api/services/asset.service.md)
    - [ProjectResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [AssetResponse](/AgentDocs/app/api/models/omega-api.models.md)
    - [EngineAssetType](/AgentDocs/editor/models/asset-types.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [Scene](/omega-game-engine) (External Engine Dependency)
- **External Packages**: `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router`