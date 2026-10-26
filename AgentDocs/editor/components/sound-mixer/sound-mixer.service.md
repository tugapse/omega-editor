## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SoundMixerPlaybackService |
| Source file | sound-mixer.service.ts |

The **SoundMixerPlaybackService** serves as the central orchestration engine for audio playback, sequencing, and real-time synthesis within the editor. It manages the lifecycle of musical notes, handles the temporal synchronization of the sequencer via a specialized clock, and provides high-level controls for playback states such as play, pause, seek, and stop.

Beyond simple playback, the service is responsible for the complex task of rendering audio sequences into high-fidelity WAV files through an `OfflineAudioContext`. It acts as a bridge between the high-level musical data structures (sequences of notes) and the low-level Web Audio API primitives managed by the underlying game engine.

**Functional Mission**
The primary mission of **SoundMixerPlaybackService** is to provide a robust, stateful playback environment that allows users to preview synth presets, play back complex musical sequences with precise timing, and export their compositions as audio files. It solves the problem of synchronizing visual playhead movement with high-precision audio scheduling.

**System Context & Integration**
This service integrates deeply with the [AudioService](/AgentDocs/editor/services/audio.service.md) to access the core `AudioEngine`, `AudioCache`, `SequencerClock`, and `VoiceFactory`. It consumes `SynthNote` and `SynthPreset` models from [synth.types](/AgentDocs/editor/models/synth.types.md) to drive the synthesis engine. The service exposes reactive signals (e.g., `isPlaying`, `playbackTime`) which are consumed by UI components like the [Sound Mixer](/AgentDocs/editor/components/sound-mixer/sound-mixer.md) to reflect the current state of the audio engine and drive playhead animations.

## 2. Environment & Configuration
**Environment Lookups:**
- `ctx.currentTime` (via `AudioEngine.getContext()`)  Retrieves the current hardware-synchronized time from the Web Audio API context.

**Hardcoded Constants:**
- `stepResolution` (Default: `4`)  Defines the granularity of the sequencer steps.
- `bpm` (Default: `120`)  The hardcoded tempo used during sequence playback.
- `sampleRate` (Default: `44100`)  The standard audio sampling frequency used for WAV export.
- `trackFrequencies` (Default: `[880.0, 440.0, 220.0, 110.0, 55.0]`)  Fixed frequency mapping used to fine-tune demo sequences by track index.
- `PATTERN_LENGTH` (Default: `8.0`)  The duration in seconds of a single musical pattern loop.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `sequence` | Signal | Reactive stream of `SynthNote[]` currently loaded in the mixer. |
| `isPlaying` | Signal | Reactive boolean indicating if the sequencer is active. |
| `isPaused` | Signal | Reactive boolean indicating if playback is suspended. |
| `isExporting` | Signal | Reactive boolean indicating if an offline render is in progress. |
| `playbackTime` | Signal | Reactive numeric value representing the current position in seconds. |
| `totalDuration` | Computed | Automatically calculates the end time of the sequence. |
| `previewPreset` | Method | Triggers a single-shot playback of a specific `SynthPreset`. |
| `playSequence` | Method | Initializes the `SequencerClock` and starts the scheduled playback loop. |
| `pauseSequence` | Method | Suspends playback and calculates elapsed time for resumption. |
| `stopSequence` | Method | Resets all playback states and clears active audio nodes. |
| `seekTo` | Method | Jumps to a specific timestamp and resumes playback if it was previously active. |
| `exportWav` | Method | Performs an offline render of the sequence with reverb and delay effects. |
| `loadDemoSong` | Method | Populates the sequence with pre-defined musical patterns based on a genre type. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The service initializes by calling `initAudio()`, which pulls the engine components (`AudioEngine`, `AudioCache`, etc.) from the injected `AudioService`.
    - Playback state signals are reset to default values.
- **Data Path (Playback)**:
    - **Input**: `sequence()` (Array of `SynthNote`).
    - **Processing**: 
        1. `playSequence` calculates `stepDuration` based on BPM and resolution.
        2. Notes are mapped into a `notesByStep` Map for $O(1)$ lookup during clock ticks.
        3. `SequencerClock` triggers callbacks at precise intervals.
        4. `VoiceFactory` generates audio nodes based on note properties (waveform, frequency, etc.).
    - **Output**: Real-time audio output via the `AudioEngine` and updated `playbackTime` signal for UI synchronization.
- **Data Path (Export)**:
    - **Input**: `sequence()`.
    - **Processing**: 
        1. Creates an `OfflineAudioContext`.
        2. Constructs a signal chain: `VoiceFactory` $\rightarrow$ `Reverb/Delay` $\rightarrow$ `Master Gain` $\rightarrow$ `Compressor` $\rightarrow$ `Destination`.
        3. Iterates through sorted notes and schedules them using `note.startTime`.
        4. `startRendering()` processes the buffer.
    - **Output**: A `Blob` containing a valid WAV file, triggered as a browser download.
- **Conditional Branching**:
    - **Waveform Check**: In `previewPreset` and `playSequence`, the logic branches between `triggerNoiseVoice` and `triggerSynthVoice` based on whether the waveform is `'noise'`.
    - **Playback State**: `playSequence` checks if the engine is already playing/paused to prevent redundant clock instances.
    - **Genre Selection**: `loadDemoSong` uses a large conditional block to switch between different musical logic patterns (`techno`, `synthwave`, `ambient`, etc.).

## 5. Resource Dependencies
- **Standard Libraries**: `ArrayBuffer`, `DataView`, `Map`, `Math`, `URL`, `Blob`.
- **Internal Modules**: 
    - [AudioService](/AgentDocs/editor/services/audio.service.md)
    - [SynthNote](/AgentDocs/editor/models/synth.types.md)
    - [SynthPreset](/AgentDocs/editor/models/synth.types.md)
- **External Packages**: `@angular/core` (Signals, Injectable), `omega-game-engine` (AudioEngine, AudioCache, SequencerClock, VoiceFactory).