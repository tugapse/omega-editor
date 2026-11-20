## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SoundMixerComponent | editor/components/sound-mixer/sound-mixer |

This component serves as the central user interface for the sound design and sequencing module within the editor. Its primary responsibility is to visualize, manipulate, and control musical sequences, allowing users to drag, drop, and edit sound events across multiple tracks. It manages the state for preset selection, timeline navigation, and the interaction between sound definitions and the playback engine.

Architecturally, `SoundMixerComponent` acts as a high-level UI controller that orchestrates interactions between several specialized sub-components and services. It utilizes the [SoundMixerPlaybackService](/editor/components/sound-mixer/sound-mixer.md) to manage playback state, integrates [PresetListComponent](/editor/components/preset-list/preset-list.md) for preset browsing, and provides visual feedback via [OscilloscopeComponent](/editor/components/oscilloscope/oscilloscope.md) and [SoundDesignerComponent](/editor/components/sound-designer/sound-designer.md) when editing specific elements.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `pixelsPerSecond()` | Signal | Getter for the current time resolution in pixels per second. |
| `trackHeight` | Constant | Defines the vertical height allocated for a single audio track. |
| `rulerHeight` | Constant | Defines the vertical height of the timeline ruler area. |
| `trackHeaderWidth` | Constant | Defines the fixed width reserved for track headers. |
| `numTracks` | Constant | The total number of audio tracks available in the mixer. |
| `snapResolution` | Constant | The granularity (in seconds) to which note start times are snapped during drag/drop. |
| `tracks` | Signal | An array representing the available tracks in the mixer. |
| `trackFrequencies` | Readonly Array | An array mapping track indices to default base frequencies (Hz). |
| `presetColors` | Readonly Array | An array of CSS classes used to color-code different preset types. |
| `presets()` | Signal | The current collection of available `SynthPreset` definitions. |
| `isDesignerOpen()` | Signal | Boolean indicating whether the sound designer modal/panel is currently active. |
| `editingPresetId()` | Signal | The ID of the preset currently being edited in the designer. |
| `editingTimelineNoteId()` | Signal | The ID of the timeline note currently being edited in the designer. |
| `designerDraft()` | Signal | The current draft state of the preset or note being edited. |
| `dragIndicator()` | Signal | Holds the calculated position and dimensions of the element being dragged. |
| `timelineWidth()` | Computed | Calculates the total required width of the timeline view based on playback duration and zoom level. |
| `rulerTicks()` | Computed | Generates an array representing the time markers (ticks) for the timeline ruler. |
| `updateZoom(event)` | Method | Updates the `pixelsPerSecond` signal based on user input from a zoom control element. |
| `getDefaultPreset()` | Method | Creates and returns a default, randomized `SynthPreset` object for new creation. |
| `openDesigner(preset?)` | Method | Opens the sound designer, either starting from a provided preset or a new default. |
| `openDesignerForTimelineNote(note)` | Method | Opens the sound designer pre-filled with the properties of an existing `SynthNote`. |
| `closeDesigner()` | Method | Closes the sound designer interface and resets editing states. |
| `savePreset(draft)` | Method | Persists the changes from the designer draft, either updating an existing preset/note or adding a new one. |
| `onDragStartPreset(event, preset)` | Method | Initiates a drag operation for creating a new note from a preset. |
| `onDragStartExistingNote(event, note)` | Method | Initiates a drag operation for moving an existing note. |
| `onDragOver(event)` | Method | Handles the drag-and-drop event to calculate the target position and display the drag indicator. |
| `onDragLeave()` | Method | Clears the drag indicator when the mouse leaves the drop zone. |
| `onDrop(event)` | Method | Finalizes the drag-and-drop operation, creating or moving a note based on the payload. |
| `onRulerClick(event)` | Method | Triggers playback seeking to the time corresponding to the ruler click position. |
| `triggerPlay()` | Method | Starts the playback sequence managed by the service. |
| `removeNote(id)` | Method | Removes a specific note from the playback sequence by its ID. |
| `clearTimeline()` | Method | Clears all notes from the sequence after user confirmation. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component manages complex state transitions related to editing (preset vs. timeline note) using `editingPresetId` and `editingTimelineNoteId`. Drag-and-drop functionality calculates target time and track indices by mapping screen coordinates (`event.clientX`, `event.clientY`) to time/track coordinates using `pixelsPerSecond` and `snapResolution`. When dropping, it either creates a new `SynthNote` based on a preset or updates an existing note's position and track. Playback synchronization is handled by listening to frame updates from the [SoundMixerPlaybackService](/editor/components/sound-mixer/sound-mixer.md) to position the playhead element.

- **Side Effects:** The component interacts heavily with external state: it calls `this.playback.loadDemoSong()` in `ngAfterViewInit` to initialize the sequence, and it calls `this.playback.playSequence()` and `this.playback.seekTo()` to control the audio playback engine. It also mutates the internal `presets` signal and the `playback.sequence` array upon saving or dropping notes.

- **Error Handling:** The `clearTimeline` method uses a standard JavaScript `confirm()` dialog to prevent accidental data loss before clearing the sequence. The drag-and-drop logic includes checks (`if (!this.dragPayload || !this.timelineRef) return;`) to prevent runtime errors if the necessary DOM references are unavailable.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `crypto` (for UUID generation).
- **Internal:** [PresetListComponent](/editor/components/preset-list/preset-list.md), [OscilloscopeComponent](/editor/components/oscilloscope/oscilloscope.md), [SoundDesignerComponent](/editor/components/sound-designer/sound-designer.md), [Icon](/src/app/components/icon/icon.md), [SoundMixerPlaybackService](/editor/components/sound-mixer/sound-mixer.md).