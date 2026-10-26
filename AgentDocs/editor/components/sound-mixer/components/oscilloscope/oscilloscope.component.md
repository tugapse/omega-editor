## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | OscilloscopeComponent |
| Source file | oscilloscope.component.ts |

The **OscilloscopeComponent** is a specialized visual feedback component designed to provide real-time waveform visualization of audio signals. It functions as a high-frequency rendering bridge between the low-level Web Audio API data and the Angular UI, utilizing the HTML5 Canvas API to draw time-domain data.

**Functional Mission**
The primary responsibility of the **OscilloscopeComponent** is to transform raw byte-level audio time-domain data into a continuous visual waveform. It solves the problem of providing immediate, low-latency visual confirmation of audio signal activity, which is critical for sound design and debugging within the editor's audio environment.

**System Context & Integration**
This component acts as a consumer of the audio engine's state. It integrates with the [AudioService](/AgentDocs/editor/services/audio.service.md) to acquire an `AnalyserNode`. It is designed to be decoupled; it attempts to access the underlying engine directly via the service bridge or through a dedicated getter method. Once the `AnalyserNode` is acquired, the component enters a high-frequency animation loop that pulls data from the audio stream and renders it onto a local canvas, ensuring that the visual representation stays synchronized with the actual audio output.

## 2. Environment & Configuration
**Environment Lookups:**
- `--canvas-bg` (via `window.getComputedStyle`)  Retrieves the background color for the canvas from CSS variables.
- `--canvas-stroke` (via `window.getComputedStyle`)  Retrieves the waveform line color from CSS variables.

**Hardcoded Constants:**
- `128.0` (Default: `128.0`)  Used as the normalization divisor to convert `Uint8Array` byte values (0-255) to a centered float range for waveform calculation.
- `2` (Default: `2`)  The `lineWidth` for the oscilloscope trace.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `OscilloscopeComponent` | Class | Manages the lifecycle, canvas resizing, and the animation loop for audio visualization. |
| `canvasRef` | ViewChild | Provides direct access to the HTMLCanvasElement for imperative drawing operations. |
| `initAnalyser()` | Private Method | Logic to resolve and attach to an `AnalyserNode` from the [AudioService](/AgentDocs/editor/services/audio.service.md). |
| `resizeCanvas()` | Private Method | Synchronizes canvas internal dimensions with its parent container's client dimensions. |
| `start()` | Private Method | Initializes the `requestAnimationFrame` loop and the 2D drawing context. |
| `draw()` | Private Method | The core render loop that fetches time-domain data and executes canvas drawing commands. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The component is instantiated and attaches a `resize` event listener to the `window`.
    2. `ngAfterViewInit` triggers `initAnalyser()` to attempt to bridge with the audio engine.
    3. `resizeCanvas()` is called to set initial dimensions.
    4. `start()` initiates the animation loop.
- **Data Path**: 
    1. **Input**: `AnalyserNode.getByteTimeDomainData(dataArray)` populates a `Uint8Array` with current audio samples.
    2. **Processing**: Each byte is divided by `128.0` to normalize the signal, then mapped to the canvas height (`(v * canvas.height) / 2`).
    3. **Output**: The calculated coordinates are drawn as a continuous path via `ctx.lineTo` on the `<canvas>` element.
- **Conditional Branching**:
    1. **Analyser Resolution**: The component checks if `engine.getAnalyser()` exists; if not, it falls back to `audioService.getAnalyserNode()`.
    2. **Resource Guarding**: The `draw` loop and `start` method exit early if `analyser` or `canvasRef` are null/undefined.
    3. **Canvas Context**: The `start` method aborts if the `2d` context cannot be acquired.

## 5. Resource Dependencies
- **Standard Libraries**: `requestAnimationFrame`, `window`, `cancelAnimationFrame`
- **Internal Modules**: 
    - [AudioService](/AgentDocs/editor/services/audio.service.md)
- **External Packages**: `@angular/core` (Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy, AfterViewInit, inject)