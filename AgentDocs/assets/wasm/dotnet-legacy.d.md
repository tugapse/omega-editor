## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | dotnet-legacy.d.ts |
| Source file | dotnet-legacy.d.ts |

The **dotnet-legacy.d.ts** component serves as a TypeScript declaration layer for the legacy .NET WebAssembly (Wasm) runtime interop. It provides type safety and structural definitions for interacting with the Mono runtime, specifically targeting the older, non-GC-safe or non-thread-safe methods that are being phased out in favor of modern `[JSImportAttribute]` and `[JSExportAttribute]` patterns.

**Functional Mission**
The primary responsibility of **dotnet-legacy.d.ts** is to map the low-level, untyped WebAssembly exports from the Mono runtime into a structured TypeScript interface. It solves the problem of "blind" interop by providing explicit types for managed pointers, native pointers, and the complex `WasmRoot` wrappers required to manage object lifetimes between the JavaScript heap and the Wasm linear memory.

**System Context & Integration**
This component acts as a bridge between the high-level application logic and the low-level WebAssembly execution environment. It is a critical dependency for services that require direct memory manipulation or legacy assembly execution. In the broader architecture, it supports the transition of data (such as strings, arrays, and objects) from the JavaScript environment into the Mono runtime. While marked as deprecated, it remains essential for maintaining compatibility with existing assembly entry points and manual heap management operations.

- **INTERNAL REFERENCES**: This file provides the type definitions used by [omega-core-bridge.service.md](/AgentDocs/app/services/omega-core-bridge.service.md) to facilitate communication between the host environment and the .NET runtime.

## 2. Environment Lookups
**Environment Lookups:**
- `config` (via `MONOType`)  Accesses runtime configuration, including asset loading and environment settings.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ManagedPointer` | Interface | Represents a pointer to an object managed by the .NET Garbage Collector. |
| `NativePointer` | Interface | Represents a pointer to unmanaged/native memory. |
| `VoidPtr` | Interface | A specialized `NativePointer` representing a generic memory address. |
| `MonoObject` | Interface | A managed pointer specifically representing a .NET object. |
| `MonoString` | Interface | A specialized `MonoObject` representing a .NET string. |
| `MonoArray` | Interface | A specialized `MonoObject` representing a .NET array. |
| `MonoObjectRef` | Interface | A reference to a managed object, used for tracking objects across the JS/Wasm boundary. |
| `WasmRoot<T>` | Interface | A wrapper for managing the lifecycle and access of a managed object `T` within Wasm memory. |
| `WasmRootBuffer` | Interface | A specialized buffer for managing collections of managed pointers. |
| `BINDINGType` | Type | Legacy interface for static method binding and assembly entry point execution. |
| `MONOType` | Type | Legacy interface for environment setup, heap manipulation, and runtime execution. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - None identified.
- **External Packages**: 
    - `.NET Foundation` (MIT Licensed runtime)