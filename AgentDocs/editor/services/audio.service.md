## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AudioService |
| Source file | audio.service.ts |

The **AudioService** acts as the central orchestration layer for all audio-related functionalities within the Omega Editor. It serves as a bridge between the Angular dependency injection system and the underlying `omega-game-engine` core, providing a singleton instance that manages the lifecycle and access to the audio subsystem.

**Functional Mission**
The primary responsibility of **AudioService** is to instantiate and manage the core audio engine components, including the `AudioEngine`, `AudioCache`, `SequencerClock`, and `VoiceFactory`. It solves the problem of complex audio subsystem initialization by encapsulating the setup of the Web Audio API context and providing a unified interface for downstream components to interact with synthesis, sequencing, and audio processing nodes.

**System Context & Integration**
This service is positioned as a root-level provider, making it globally accessible to other editor modules. It integrates deeply with the `omega-game-engine` to manage the audio graph. It provides essential nodes (Analyser, SynthBus, ReverbBus, DelayBus) to UI components like the [Sound Mixer](/AgentDocs/editor/components/sound-mixer/sound-mixer.md) and [Sound Designer](/AgentDocs/editor/components/sound-mixer/sound-designer/sound-designer.component.md), ensuring that the visual representation of audio data and the manipulation of audio parameters are synchronized with the actual audio processing occurring in the engine.

- **INTERNAL REFERENCES**: [AudioService](/AgentDocs/editor/services/audio.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `clockConfig.bpm` (Default: `120`)  The beats per minute for the sequencer clock.
- `clockConfig.ticksPerBeat` (Default: `4`)  The number of subdivisions per beat.
- `clockConfig.lookaheadMs` (Default: `500.0`)  The scheduling lookahead window in milliseconds.
- `clockConfig.overlapMs` (Default: `100.0`)  The overlap duration for scheduled events in milliseconds.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `engine` | Property (AudioEngine) | The core engine instance managing the Web Audio context. |
| `cache` | Property (AudioCache) | Manages loaded audio buffers and assets. |
| `clock` | Property (SequencerClock) | Handles precise timing and musical sequencing. |
| `factory` | Property (VoiceFactory) | Generates and manages playable audio voices/instruments. |
| `init()` | Method | Triggers `engine.initialize()` to resume the AudioContext (typically via user gesture). |
| `getAudioContext()` | Method | Returns the underlying `AudioContext` instance. |
| `getAnalyserNode()` | Method | Returns the `AnalyserNode` for real-time waveform/frequency visualization. |
| `getMasterGainNode()` | Method | Returns the primary synthesis bus for volume control. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The service is instantiated by Angular's DI container.
    2. `clockConfig` is initialized with default musical timing parameters.
    3. The `engine` is instantiated, followed by the `cache`, `clock`, and `factory`, all sharing the same `AudioContext` from the engine.
    4. The `init()` method must be called (usually via a UI click event) to transition the `AudioContext` from a `suspended` state to `running`.
- **Data Path**: 
    - **Audio Asset Loading**: `AudioCache` receives raw data $\rightarrow$ Decodes via `AudioContext` $\rightarrow$ Stores in memory for `VoiceFactory` access.
    - **Sequencing**: `SequencerClock` calculates timing $\rightarrow$ Triggers events $\rightarrow$ `VoiceFactory` spawns voices $\rightarrow$ Audio flows through `SynthBus` $\rightarrow$ Output.
- **Conditional Branching**: 
    - The `init()` method is designed to handle the browser's requirement for user-initiated audio playback, preventing the `AudioContext` from remaining in a suspended state.

## 5. Resource Dependencies
- **Standard Libraries**: `Injectable` (Angular Core)
- **Internal Modules**: 
    - `AudioEngine` (from `omega-game-engine`)
    - `AudioCache` (from `omega-game-engine`)
    - `SequencerClock` (from `omega-game-engine`)
    - `VoiceFactory` (from `omega-game-engine`)
    - `ClockConfig` (from `omega-game-engine`)
- **External Packages**: `omega-game-engine`