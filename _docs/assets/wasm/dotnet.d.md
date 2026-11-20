## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| dotnet.d | /assets/wasm/dotnet.d.md |

This file serves as a TypeScript declaration file (`.d.ts`) defining the public interface for the .NET runtime environment when compiled to WebAssembly (Wasm). Its primary responsibility is to provide type safety and structure for JavaScript code interacting with the low-level Wasm runtime, exposing APIs for memory management, I/O, and application bootstrapping.

It acts as a critical bridge between the JavaScript host environment and the compiled .NET runtime instance. It defines complex types like `EmscriptenModule`, `DotnetHostBuilder`, and `RuntimeAPI`, allowing developers to configure, initialize, and execute .NET applications within a browser context without needing to know the underlying C# implementation details.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `NativePointer` | Interface | Represents a raw memory pointer within the Wasm heap. |
| `VoidPtr` | Interface | A pointer type specifically designated as void. |
| `CharPtr` | Interface | A pointer type specifically designated as a character pointer. |
| `Int32Ptr` | Interface | A pointer type specifically designated as a 32-bit integer pointer. |
| `EmscriptenModule` | Interface | Defines core Wasm runtime functions like memory access (`HEAP8`, `_malloc`), calling native functions (`ccall`, `cwrap`), and I/O utilities. |
| `DotnetHostBuilder` | Interface | Provides a fluent builder pattern for configuring the .NET runtime startup process, allowing settings for resources, environment variables, and application arguments. |
| `MonoConfig` | Type | Configuration object used by `DotnetHostBuilder` to specify runtime settings such as resource locations, debugging levels, and globalization modes. |
| `ResourceGroups` | Interface | Defines how various types of assets (assembly, PDB, Wasm symbols, etc.) should be loaded and managed during runtime initialization. |
| `ResourceList` | Type | A map defining specific asset names and their optional integrity hashes. |
| `LoadBootResourceCallback` | Type | A callback function used by `DotnetHostBuilder` to override the default mechanism for fetching boot resources from custom sources like CDNs. |
| `LoadingResource` | Interface | Describes a resource being loaded, including its name, URL, and the promise representing its download. |
| `AssetEntry` | Interface | A detailed structure describing a single asset, including its behavior, resolved URL, and optional buffer data. |
| `SingleAssetBehaviors` | Type | Enumeration defining the specific role an asset plays (e.g., "dotnetwasm", "resource", "assembly"). |
| `AssetBehaviors` | Type | A union type encompassing all possible behaviors for loading assets. |
| `GlobalizationMode` | Enum | Defines how the runtime should handle internationalization data (e.g., "Sharded", "All", "Invariant"). |
| `DotnetModuleConfig` | Type | Configuration object passed to `createDotnetRuntime` to customize the module loading process. |
| `APIType` | Type | Defines the set of high-level API methods available after the runtime is initialized, including running the main application and accessing heap memory. |
| `RuntimeAPI` | Type | The final object returned upon successful runtime initialization, containing the `Module` interface and the high-level `APIType`. |
| `ModuleAPI` | Type | A wrapper interface providing access to the `dotnet` builder and an `exit` function. |
| `IDisposable` | Interface | Defines a contract for objects that can be explicitly cleaned up via a `dispose()` method. |
| `IMemoryView` | Interface | Extends `IDisposable` and provides methods for reading and writing data between the Wasm memory and JavaScript typed arrays. |
| `mono_exit` | Function | The external function declared to signal the runtime to exit with a specific code. |
| `dotnet` | Constant | The globally available instance of `DotnetHostBuilder` for immediate configuration. |
| `exit` | Constant | The globally available function wrapper for `mono_exit`. |
| `getDotnetRuntime` | Function | A global function used to retrieve an initialized `RuntimeAPI` instance based on a runtime ID. |
| `createDotnetRuntime` | Function | The primary factory function used to initialize and return a `RuntimeAPI` instance based on provided configuration. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component primarily defines interfaces and types rather than implementing logic. The core functionality is encapsulated within the `DotnetHostBuilder` and `createDotnetRuntime` functions, which manage the complex asynchronous process of loading, configuring, and instantiating the Wasm runtime environment.
- **Side Effects:** The types define interactions with external systems: `DotnetHostBuilder` methods like `create()` and `run()` inherently involve network I/O (fetching resources) and global state mutation (setting up the runtime). The `EmscriptenModule` methods like `_malloc` and `_free` directly interact with the underlying Wasm memory heap.
- **Error Handling:** The `DotnetHostBuilder` supports configuration options like `ignorePdbLoadErrors` to manage failure modes during resource loading. The `onAbort` and `onExit` callbacks within `EmscriptenModule` provide mechanisms for handling runtime termination or errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** None.