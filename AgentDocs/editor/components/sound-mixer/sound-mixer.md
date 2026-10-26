## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SoundMixerComponent |
| Source file | sound-mixer.ts |

The **SoundMixerComponent** serves as the primary orchestration layer for the audio sequencing and synthesis interface within the Omega Editor. It provides a multi-track timeline environment where users can visually arrange, manipulate, and design sonic elements. By integrating real-time playback controls, visual waveform monitoring, and a granular sound design interface, it acts as the central hub for musical composition and sound effect layering.

**Functional Mission**
The primary responsibility of **SoundMixerComponent** is to manage the visual representation and user interaction of a multi-track audio sequencer. It solves the problem of complex audio arrangement by providing a drag-and-drop timeline, a frequency-aware track system, and a bridge between high-level preset management and low-level note sequencing.

**System Context & Integration**
This component functions as a high-level controller that coordinates several specialized sub-modules. It utilizes [SoundMixerPlaybackService](/AgentDocs/editor/components/sound-mixer/sound-mixer.service.md) to drive the actual audio engine and sequence state. It delegates visual feedback to [OscilloscopeComponent](/AgentDocs/editor/components/sound-mixer/components/oscilloscope/oscilloscope.component.md) and manages preset selection via [PresetListComponent](/AgentDocs/editor/components/sound-mixer/components/preset-list/preset-list.component.md). When deep editing is required, it launches the [SoundDesignerComponent](/AgentDocs/editor/components/sound-mixer/sound-designer/sound-designer.component.md). The component translates user gestures (drags, clicks, zooms) into precise temporal and frequency data, which is then pushed to the playback service to update the [SynthNote](/AgentDocs/editor/models/synth.types.md) sequence.

## 2. Environment & Configuration
**Environment Lookups:**
- `pixelsPerSecond` (via `updateZoom`)  Controls the horizontal zoom level of the timeline.

**Hardcoded Constants:**
- `trackHeight` (Default: `72`)  Vertical pixel height of a single audio track.
- `rulerHeight` (Default: `32`)  Vertical pixel height of the time ruler.
- `trackHeaderWidth` (Default: `96`)  Horizontal width of the track label area.
- `numTracks` (Default: `5`)  Total number of available audio tracks.
- `snapResolution` (Default: `0.1`)  The temporal increment (in seconds) for grid snapping.
- `trackFrequencies` (Default: `[880.0, 440.0, 220.0, 110.0, 55.0]`)  Base frequencies assigned to each track index.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `updateZoom` | Method | Updates the `pixelsPerSecond` signal based on UI input. |
| `openDesigner` | Method | Opens the sound designer for a specific preset or a new sound. |
| `openDesignerForTimelineNote` | Method | Opens the sound designer to modify an existing note on the timeline. |
| `savePreset` | Method | Commits changes from the designer to either a global preset or a specific timeline note. |
| `onDragStartPreset` | Method | Initiates the drag operation for a new sound from the preset list. |
| `onDragStartExistingNote` | Method | Initiates the drag operation for moving an existing note on the timeline. |
| `onDragOver` | Method | Calculates real-time drag indicators (position/width) and tracks the target frequency. |
| `onDrop` | Method | Finalizes the placement of a note, applying snapping and track-specific frequencies. |
| `onRulerClick` | Method | Triggers a seek operation in the playback service. |
| `triggerPlay` | Method | Starts the audio sequence playback. |
| `removeNote` | Method | Deletes a specific note from the sequence. |
| `clearTimeline` | Method | Wipes all notes from the current sequence. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Injects `SoundMixerPlaybackService`.
    2. Initializes signals for zoom, designer state, and drag indicators.
    3. `ngAfterViewInit` triggers `playback.loadDemoSong` to populate the initial sequence.
- **Data Path (Drag & Drop)**: 
    1. **Input**: `DragEvent` (Preset or Note).
    2. **Processing**: `onDragOver` calculates `rawTime` and `trackIndex` based on mouse coordinates relative to `timelineRef` and `trackHeaderWidth`. It applies `snapResolution` to determine `snappedTime`.
    3. **Output**: `onDrop` creates a `SynthNote` object. If the note is not "noise", it overwrites the frequency with the `trackFrequencies[trackIndex]` value. The note is then added/updated in the `playback.sequence` signal.
- **Conditional Branching (Designer Save)**:
    - If `editingTimelineNoteId` is present $\rightarrow$ Update specific note in `playback.sequence`.
    - Else if `editingPresetId` is present $\rightarrow$ Update global `presets` list AND sync existing notes in `playback.sequence` that match the preset name.
    - Else $\rightarrow$ Append new preset to `presets` list.

## 5. Resource Dependencies
- **Standard Libraries**: `crypto` (for UUID generation)
- **Internal Modules**: 
    - [SynthPreset](/AgentDocs/editor/models/synth.types.md)
    - [SynthNote](/AgentDocs/editor/models/synth.types.md)
    - [PresetListComponent](/AgentDocs/editor/components/sound-mixer/components/preset-list/preset-list.component.md)
    - [OscilloscopeComponent](/AgentDocs/editor/components/sound-mixer/components/oscilloscope/oscilloscope.component.md)
    - [SoundDesignerComponent](/AgentDocs/editor/components/sound-mixer/sound-designer/sound-designer.component.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [SoundMixerPlaybackService](/AgentDocs/editor/components/sound-mixer/sound-mixer.service.md)
- **External Packages**: `@angular/core`