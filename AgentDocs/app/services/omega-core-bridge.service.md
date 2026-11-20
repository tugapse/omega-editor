## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | OmegaCoreBridgeService |
| Source file | omega-core-bridge.service.ts |

The **OmegaCoreBridgeService** acts as the critical interoperability layer between the Angular application environment and the .NET WebAssembly (WASM) runtime. It is responsible for orchestrating the lifecycle of the .NET runtime, including dynamic module loading, resource mapping, and the initialization of the WebAssembly environment.

**Functional Mission**
The primary mission of the **OmegaCoreBridgeService** is to provide a type-safe, asynchronous bridge that allows the TypeScript-based frontend to execute high-performance logic hosted within the `omega-engine-core.dll`. It abstracts the complexities of the .NET WASM runtime, such as resource loading and assembly export retrieval, presenting a clean API for downstream services to consume engine-level computations.

**System Context & Integration**
This service serves as the foundational gateway for any module requiring heavy computational capabilities. It is designed to be consumed by higher-level services, such as [OmegaEngineService](/AgentDocs/app/services/omega-engine.service.md), which rely on the bridge to access the core engine's mathematical and physics capabilities. By managing the singleton state of the runtime initialization, it ensures that the expensive process of loading the WASM environment occurs only once and is shared across the entire application.

- **INTERNAL REFERENCES**: [OmegaEngineService](/AgentDocs/app/services/omega-engine.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `dotnetScriptUrl` (via `initializeEngine`)  The path to the .NET WASM runtime entry point (`/assets/wasm/dotnet.js`).

**Hardcoded Constants:**
- `dotnetScriptUrl` (Default: `"/assets/wasm/dotnet.js"`)  Location of the .NET JS interop script.
- `mainAssemblyName` (Default: `"omega-engine-core.dll"`)  The primary assembly to be loaded by the runtime.
- `resourceLoader` path (Default: `"/assets/wasm/${name}"`)  The base directory for all WASM and .NET assets.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `OmegaEngineExports` | Interface | Defines the shape of the exported C# methods available in TypeScript. |
| `OmegaCoreBridgeService` | Class | The main service managing the .NET WASM lifecycle and bridge. |
| `initializeEngine` | Method | Asynchronously loads the .NET runtime, configures resources, and retrieves assembly exports. |
| `runTestCalculation` | Method | A diagnostic method that executes a sample calculation from the `EngineMath` export. |
| `calculateTransform` | Method | Provides a high-level wrapper to call the C# `CalculateTransform` function. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Checks `isInitialized` and `dotNetExports` to prevent redundant loading.
    2. Dynamically imports the `dotnet.js` module using a Vite-ignored import.
    3. Configures the `.NET` runtime with specific assembly resources (DLLs, ICU data, etc.).
    4. Implements a custom `resourceLoader` to map requested assets to the `/assets/wasm/` directory.
    5. Calls `runtime.create()` to instantiate the environment.
- **Data Path**: 
    1. **Input**: Numeric parameters (`x`, `y`, `scale`) passed to `calculateTransform`.
    2. **Processing**: The service retrieves the `OmegaCore.EngineMath` export and invokes the WASM-hosted `CalculateTransform` function.
    3. **Output**: A `number` returned from the C# execution context back to the TypeScript caller.
- **Conditional Branching**:
    - **Assembly Resolution**: If `getAssemblyExports` fails with the `.dll` extension, the service attempts a fallback by stripping the extension (`omega-engine-core`).
    - **Export Validation**: Before calling math functions, the service checks for the existence of the `OmegaCore.EngineMath` path within the exports object to prevent runtime null pointer exceptions.

## 5. Resource Dependencies
- **Standard Libraries**: `import { Injectable } from "@angular/core"`
- **Internal Modules**: 
    - No internal modules from the MANIFEST are imported directly in this file.
- **External Packages**: 
    - `@angular/core` (Angular Framework)
    - `.NET WebAssembly Runtime` (External WASM runtime)