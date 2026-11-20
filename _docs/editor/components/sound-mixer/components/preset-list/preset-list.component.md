## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PresetListComponent | editor/components/sound-mixer/components/preset-list/preset-list.component |

This component is responsible for rendering a list of available synthesizer presets to the user. It displays essential information for each preset, such as its name, waveform, and frequency, and provides interactive elements for user actions like previewing, editing, and adding new presets.

Architecturally, `PresetListComponent` functions as a presentation layer UI component within the sound mixer module. It consumes an array of `SynthPreset` data via an input and emits events (`add`, `edit`, `preview`, `dragStart`) to notify parent components about user interactions or data changes, integrating it with the application's state management flow.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| presets() | Input | Required array of `SynthPreset` objects to be displayed in the list. |
| add() | Output | Emitted when the user clicks the "+ Add" button. |
| edit() | Output | Emitted when a specific preset is selected for editing, carrying the `SynthPreset` object. |
| preview() | Output | Emitted when a specific preset is clicked to preview its sound, carrying the `SynthPreset` object. |
| dragStart() | Output | Emitted when a preset item begins a drag operation, carrying the event and the `SynthPreset` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component iterates over the `presets` input using Angular's `@for` loop to render individual `preset-item` divs. It handles user interactions by binding click and drag events to output emitters.
- **Side Effects:** None. The component is purely declarative, emitting events rather than performing side effects like network calls or DOM manipulation outside of standard Angular change detection.
- **Error Handling:** None explicitly implemented; relies on Angular's input validation for required data.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [SynthPreset](/editor/models/synth.types.md)