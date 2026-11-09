## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SoundMixerPlaybackService | editor/components/sound-mixer/sound-mixer.service |

This service is responsible for managing the entire audio playback lifecycle within the editor, from simple single-note previews to complex, timed sequence playback and final WAV file export. It abstracts the low-level audio engine interactions, allowing higher-level components to control playback state (play, pause, stop, seek) based on a defined sequence of musical notes.

It acts as the central controller for audio generation, integrating the `AudioService` to access the underlying `AudioEngine`, `SequencerClock`, and `VoiceFactory`. It translates abstract musical data (`SynthNote[]`) into concrete, time-synced audio events, providing reactive state via Angular signals for UI synchronization.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `sequence` | Signal | Exposes the current array of `SynthNote` objects being played. |
| `isPlaying` | Signal | Boolean signal indicating if playback is currently active. |
| `isPaused` | Signal | Boolean signal indicating if playback is paused. |
| `isExporting` | Signal | Boolean signal indicating if the audio export process is running. |
| `playbackTime` | Signal | Current playback time in seconds. |
| `totalDuration` | Computed | Calculates the maximum end time based on the notes in the sequence. |
| `previewPreset` | Method | Triggers a single-note preview using a given `SynthPreset`. |
| `playSequence` | Method | Starts playback of the current sequence, accepting a frame update callback. |
| `pauseSequence` | Method | Pauses the current playback, updating the `playbackTime` based on elapsed time. |
| `stopSequence` | Method | Halts all playback, resets the state, and cleans up active audio nodes. |
| `seekTo` | Method | Jumps playback to a specific time, optionally resuming playback if it was active. |
| `exportWav` | Method | Renders the entire sequence into an offline audio buffer and triggers a WAV file download. |
| `loadDemoSong` | Method | Populates the internal sequence with predefined musical patterns based on a genre type. |

## 3. Implementation Details & Side Effects
- **Core Logic:** Playback is managed by synchronizing the `SequencerClock` to the BPM derived from the sequence timing. Notes are mapped to specific time steps, and the clock callback triggers the creation and scheduling of audio voices (`triggerNoiseVoice` or `triggerSynthVoice`) at the correct `schedulerTime`. The `animatePlayhead` function uses `requestAnimationFrame` to provide a smooth visual representation of the current time, which is synchronized with the audio clock's progression. Exporting utilizes an `OfflineAudioContext` to render the entire sequence offline before converting the resulting `AudioBuffer` to a WAV Blob.

- **Side Effects:** Interacts heavily with external state managed by `AudioService` (which manages the `AudioEngine`). It mutates the internal state signals (`sequence`, `isPlaying`, etc.). It triggers browser-level side effects during `exportWav` by creating and clicking a temporary `<a>` element to initiate a file download.

- **Error Handling:** The `previewPreset` and `exportWav` methods use `try...catch` blocks to gracefully handle potential errors during audio node disconnection or rendering failures, ensuring the service state remains stable.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`, `omega-game-engine`
- **Internal:** [AudioService](/editor/services/audio.service.md), [SynthNote](/editor/models/synth.types.md), [SynthPreset](/editor/models/synth.types.md)