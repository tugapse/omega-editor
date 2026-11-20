## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | dotnet.d.ts |
| Source file | dotnet.d.ts |

The **dotnet.d.ts** file serves as the TypeScript declaration layer for the .NET WebAssembly runtime integration. It provides the necessary type definitions to bridge the gap between the high-level TypeScript/JavaScript environment and the low-level WebAssembly (Wasm) memory space managed by the Mono runtime.

**Functional Mission**
The primary responsibility of **dotnet.d.ts** is to provide type safety and IntelliSense for the Emscripten-based interop layer and the .NET Host builder. It solves the problem of "blind" interaction with Wasm memory by defining interfaces for pointer manipulation, heap access, and the complex configuration objects required to bootstrap a .NET application within a browser environment.

**System Context & Integration**
This component acts as the foundational type contract for any module attempting to communicate with the .NET runtime. It is critical for the [Omega Engine Service](/AgentDocs/app/services/omega-engine.service.md) and any bridge components that manage the lifecycle of the Wasm instance. It defines how assets are loaded via `ResourceGroups` and how the runtime is initialized through the `DotnetHostBuilder`. By providing definitions for `EmscriptenModule` and `RuntimeAPI`, it enables downstream services to safely perform memory operations (like `setHeapU32`) and execute managed code via `runMain`.

- **INTERNAL REFERENCES**: [dotnet.d.ts](/AgentDocs/assets/wasm/dotnet.d.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `remoteSources` (via `MonoConfig`)  Additional search locations for assets.
- `environmentVariables` (via `MonoConfig`)  Dictionary-style object containing environment variables.
- `applicationEnvironment` (via `MonoConfig`)  The target application environment (e.g., Development, Production).
- `applicationCulture` (via `MonoConfig`)  BCP 47 formatted culture string.

**Hardcoded Constants:**
- `GlobalizationMode` (Enum)  Defines modes for ICU data loading: `Sharded`, `All`, `Invariant`, `Custom`, `Hybrid`.
- `AssetBehaviors` (Union Type)  Defines how assets are handled (e.g., `"dotnetwasm"`, `"assembly"`, `"vfs"`, `"heap"`).

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `NativePointer` | Interface | A branded type representing a raw memory address. |
| `EmscriptenModule` | Interface | Defines the low-level Emscripten interop functions (heap access, string conversion, malloc/free). |
| `DotnetHostBuilder` | Interface | Fluent API for configuring and bootstrapping the .NET runtime. |
| `MonoConfig` | Type | Configuration schema for the Mono runtime (downloads, caching, debugging, etc.). |
| `ResourceGroups` | Interface | Structural definition for all assets required by the runtime (assemblies, PDBs, ICU, etc.). |
| `RuntimeAPI` | Type | The primary interface returned after runtime creation, combining `EmscriptenModule` and `APIType`. |
| `APIType` | Type | High-level managed/unmanaged bridge functions (e.g., `getAssemblyExports`, `setHeapI32`). |
| `createDotnetRuntime` | Function | The entry point function to initialize the .NET environment. |
| `getDotnetRuntime` | Function | Global lookup to retrieve an existing `RuntimeAPI` by its `runtimeId`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The user invokes `createDotnetRuntime` with a `DotnetModuleConfig`.
    2. The `DotnetHostBuilder` is used to chain configuration settings (e.g., `withMainAssembly`, `withEnvironmentVariable`).
    3. The `create()` method is called, returning a `Promise<RuntimeAPI>`.
- **Data Path (Memory Interop)**:
    1. **Input**: A `NativePointer` (address) and a value.
    2. **Processing**: The `APIType` methods (e.g., `setHeapU32`) use the `EmscriptenModule` heap views (e.g., `HEAPU32`) to write data to the specific offset in the Wasm linear memory.
    3. **Output**: The value is persisted in the Wasm heap, accessible by the .NET runtime.
- **Conditional Branching**:
    - **Resource Loading**: The `LoadBootResourceCallback` allows for branching logic where a developer can intercept the default fetch mechanism to provide custom URIs or `Response` objects (e.g., for CDN usage).
    - **Error Handling**: `onAbort` and `onExit` callbacks provide hooks for handling runtime failures or graceful shutdowns.

## 5. Resource Dependencies
- **Standard Libraries**: `WebAssembly` (via `WebAssembly.Instance`, `WebAssembly.Module`, `WebAssembly.Imports`).
- **Internal Modules**: 
    - No direct imports from the provided MANIFEST are present in this `.d.ts` file, as it is a declaration file defining the interface for external Wasm modules.
- **External Packages**: Emscripten (implied via `EmscriptenModule` definitions).