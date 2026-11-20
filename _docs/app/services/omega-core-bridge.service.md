## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| OmegaCoreBridgeService | app/services/omega-core-bridge.service |

This component serves as the primary bridge between the Angular application environment and the external .NET WebAssembly runtime. Its core responsibility is managing the lifecycle of the .NET runtime, ensuring it is initialized correctly, and providing typed access to the exported functionalities from the `omega-engine-core.dll` assembly.

Architecturally, this service acts as a critical integration layer within the application's service layer. It abstracts the complex asynchronous loading and configuration of the WebAssembly runtime, allowing other parts of the application to interact with engine logic (like `EngineMath`) through a clean, promise-based interface, such as the `calculateTransform` method.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| OmegaEngineExports | Interface | Defines the expected structure of the exports object returned by the .NET runtime, including nested structures like `OmegaCore` and `EngineMath`. |
| OmegaCoreBridgeService | Class | Manages the connection and interaction with the .NET WebAssembly runtime. |
| initializeEngine | Method | Asynchronously initializes the .NET runtime, loading necessary assemblies and returning the full exports object. |
| runTestCalculation | Method | Executes a predefined test calculation using the initialized engine exports and logs the result. |
| calculateTransform | Method | Public method to execute the `CalculateTransform` function from the engine, requiring initialization first. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The service first checks its internal state (`isInitialized`). If not initialized, it dynamically imports the `dotnet.js` script. It then configures the .NET runtime with specific assembly names and resource loaders. It attempts to retrieve assembly exports from `omega-engine-core.dll`, falling back to `omega-engine-core` if the first attempt fails. Subsequent calls use the cached `dotNetExports`.
- **Side Effects:** Interacts heavily with the network by dynamically importing external JavaScript modules (`/assets/wasm/dotnet.js`) and loading WebAssembly binaries/DLLs from the `/assets/wasm/` directory. It mutates internal state (`dotNetExports`, `isInitialized`).
- **Error Handling:** It uses `try...catch` blocks extensively. Initialization errors are caught, logged, and re-thrown. A specific fallback mechanism is implemented when retrieving assembly exports, attempting to load without the `.dll` extension if the initial attempt fails.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** None