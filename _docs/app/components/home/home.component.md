## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| HomeComponent | /app/components/home/home.component.md |

This component serves as the main landing page for the application, responsible for managing the overall project lifecycle view. Its primary responsibility is to display a list of available projects, allow users to select an existing project to begin editing, and provide functionality to create entirely new projects. It acts as the central hub for project navigation and state management before the user enters the detailed editor view.

Architecturally, `HomeComponent` functions as a high-level UI controller. It orchestrates interactions with the `ProjectService` to fetch and manipulate project data, and it integrates several specialized UI components such as [BackgroundVisualizationComponent](/app/components/background-visualization/background-visualization.md), [UserBarComponent](/app/components/user-bar/user-bar.md), and [SceneList](/app/components/scene-list/scene-list.md). It manages the state of the currently selected project, which dictates the context for the rest of the application.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `selectProject(project: ProjectResponse)` | Method | Sets the `selectedProject` state to the provided `ProjectResponse` object, preparing the application for editing that specific project. |
| `openNewProjectModal()` | Method | Triggers the UI state change to open the modal dialog for creating a new project. |
| `closeModal()` | Method | Resets the modal state and clears the input field for new project names. |
| `createProject()` | Method | Validates the `newProjectName` and calls the `ProjectService` to persist a new project via API. |
| `handleProjectUpdate(updatedProjectData: ProjectResponse)` | Method | Submits updates for an existing project to the backend via `ProjectService` and synchronizes the local state upon success. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by loading all available projects via `loadProjects()`. It uses the route parameters to determine if a project should be pre-selected upon loading. Project creation involves validating input and calling the service. Updates are handled by optimistic local state management followed by a network call to persist changes.
- **Side Effects:** Interacts heavily with the network via `ProjectService` for listing, creating, and updating projects. It also mutates the internal state (`projects`, `selectedProject`, `isModalOpen`) and interacts with `LoadingService` to manage UI feedback during asynchronous operations.
- **Error Handling:** Catches errors during project loading, creation, and updating, logging them to the console. For creation, it prevents execution if the name is empty.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [ProjectService](/app/api/services/project.service.md), [LoadingService](/src/app/services/loading.service.md), [EditorService](/editor/services/editor.service.md), [ActivatedRoute](/angular/router.md)