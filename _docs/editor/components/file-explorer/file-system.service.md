## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| FileSystemService | [file-system.service](/editor/components/file-explorer/file-system.service.md) |

This service is responsible for managing the state and retrieval of file system data within the editor application. It simulates interaction with a complex, hierarchical file structure by using a hardcoded `MOCK_FILE_SYSTEM` object. Its primary responsibility is to provide observable streams of directory contents and methods to fetch the content of specific files based on their paths.

Architecturally, `FileSystemService` acts as a dedicated data access layer or service layer. It abstracts the complexity of traversing the mock file system, allowing UI components to subscribe to changes in the current directory state via `currentDirectory$` or request specific file contents using `getFileContent`. It relies on the `FileNode` model for its data structure.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `currentDirectory$` | Observable | An observable stream that emits an array of `FileNode` objects representing the contents of the currently viewed directory. |
| `navigateToDirectory(path: string)` | Method | Initiates a navigation sequence to a specified path, updating the `currentDirectory$` stream after a simulated delay. |
| `getFileContent(path: string)` | Method | Returns an observable that emits the simulated content string for a file located at the given path. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service maintains state using a `BehaviorSubject` to track the current directory's contents. Navigation is handled by recursively searching the `MOCK_FILE_SYSTEM` using `findNodeByPath`. When navigating, it simulates asynchronous behavior using RxJS `delay` operators to mimic network latency before emitting the children of the target directory. File content retrieval also simulates an asynchronous read operation.

- **Side Effects:** The code simulates network latency and asynchronous file reading/navigation via RxJS `delay` operators, which mimics external I/O operations. It mutates the internal state managed by `currentDirectorySubject`.

- **Error Handling:** If `navigateToDirectory` is called with a path that does not exist or is not a directory, the service falls back to emitting the children of the root directory (`MOCK_FILE_SYSTEM.children`). `getFileContent` returns a specific error string if the path does not resolve to a file.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** RxJS
- **Internal:** [file-explorer.model](/editor/components/file-explorer/file-explorer.model.md)