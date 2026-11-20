## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | FileSystemService |
| Source file | file-system.service.ts |

The **FileSystemService** acts as a virtualized data provider for the application's file exploration capabilities. It abstracts the complexities of file system navigation and retrieval by providing an observable-based interface that simulates asynchronous file system operations, including latency.

**Functional Mission**
The primary responsibility of the **FileSystemService** is to manage the state of the current directory being viewed and to provide a mechanism for traversing a hierarchical file structure. It solves the problem of decoupling the UI components from the underlying data source (currently a mock object) by providing standardized methods to navigate paths and fetch file contents.

**System Context & Integration**
This service serves as the data backbone for the [File Explorer Component](/AgentDocs/editor/components/file-explorer/file-explorer.component.md). It manages the `currentDirectory$` stream, which downstream UI components subscribe to in order to render the list of files and folders. When a user interacts with the explorer to enter a folder, the service updates its internal state, triggering a reactive update across the file explorer interface.

- **INTERNAL REFERENCES**: [FileNode](/AgentDocs/editor/components/file-explorer/file-explorer.model.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `MOCK_FILE_SYSTEM` (Default: `FileNode` object)  A static, hierarchical mock representation of a file system used for development and testing.
- `delay(100)` (Default: `100ms`)  Simulated network latency for directory navigation.
- `delay(50)` (Default: `50ms`)  Simulated latency for file content retrieval.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `currentDirectory$` | Observable | Emits the array of `FileNode` objects contained within the currently active directory. |
| `navigateToDirectory(path: string)` | Method | Navigates the internal pointer to a specific path; updates `currentDirectorySubject` with the children of the target directory. |
| `getFileContent(path: string)` | Method | Returns an Observable containing a string representation of the file's metadata and mock content. |
| `findNodeByPath(root: FileNode, path: string)` | Private Method | Recursively traverses the `FileNode` tree to locate a specific node matching the provided path. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The service instantiates `currentDirectorySubject` as an empty array.
    - The `constructor` immediately invokes `navigateToDirectory('/')` to populate the initial view with the root directory's children.
- **Data Path (Navigation)**: 
    - `Input (path string)` $\rightarrow$ `findNodeByPath (recursive search)` $\rightarrow$ `delay (100ms)` $\rightarrow$ `Validation (is directory?)` $\rightarrow$ `Output (currentDirectorySubject.next(children))`.
- **Data Path (File Reading)**: 
    - `Input (path string)` $\rightarrow$ `findNodeByPath (recursive search)` $\rightarrow$ `String Construction (metadata template)` $\rightarrow$ `delay (50ms)` $\rightarrow$ `Output (Observable<string>)`.
- **Conditional Branching**:
    - **Navigation Failure**: If `findNodeByPath` returns a node that is not a directory or is undefined, the service defaults the current directory to the root's children (`MOCK_FILE_SYSTEM.children`).
    - **File Not Found**: In `getFileContent`, if the path does not resolve to a file, a "File not found" error string is returned instead of the content template.

## 5. Resource Dependencies
- **Standard Libraries**: `rxjs` (BehaviorSubject, Observable, of), `rxjs/operators` (map, delay)
- **Internal Modules**: 
    - [FileNode](/AgentDocs/editor/components/file-explorer/file-explorer.model.md)
- **External Packages**: `@angular/core`