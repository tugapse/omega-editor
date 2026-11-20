## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| dotnet-legacy | /assets/wasm/dotnet-legacy.d.md |

This component provides a set of TypeScript declarations for legacy interoperability bindings between JavaScript/TypeScript and a .NET runtime compiled to WebAssembly (Wasm). Its primary responsibility is to define the interfaces and types necessary to interact with low-level memory management, object references, and runtime functions exposed by the Wasm environment.

This file serves as a foundational layer within the application's architecture, specifically acting as a bridge or adapter layer. It exposes deprecated APIs (`BINDINGType` and `MONOType`) that allow older code paths to interact with the core runtime, while also defining the fundamental data structures like `MonoObject` and `WasmRoot` that underpin the managed environment.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ManagedPointer | Interface | Represents a managed pointer type within the Wasm environment. |
| NativePointer | Interface | Represents a native pointer type within the Wasm environment. |
| VoidPtr | Interface | An extension of `NativePointer` used to denote a void pointer. |
| MonoObject | Interface | The base interface for managed objects in the runtime. |
| MonoString | Interface | Represents a managed string object. |
| MonoArray | Interface | Represents a managed array object. |
| MonoObjectRef | Interface | Represents a reference to a managed object. |
| WasmRoot | Interface | Defines the interface for a managed root object, providing methods for access, manipulation, and lifecycle management. |
| WasmRootBuffer | Interface | Defines the interface for a managed buffer root, allowing indexed access to managed pointers. |
| BINDINGType | Type | A collection of deprecated functions for static binding and runtime entry point calls. |
| MONOType | Type | A collection of deprecated functions for runtime configuration, memory manipulation, and object creation. |

## 3. Implementation Details & Side Effects
- **Core Logic:** This file is purely a set of type definitions (`declare interface`, `type`). It does not contain executable logic, algorithms, or state flow. It defines the contract for how external JavaScript code should interact with the underlying Wasm runtime functions.

- **Side Effects:** None. It is a declaration file and has no runtime side effects.

- **Error Handling:** None. As a declaration file, it defines potential behaviors but does not implement error handling.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** None.