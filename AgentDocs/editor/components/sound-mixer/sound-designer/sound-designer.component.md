## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SoundDesignerComponent |
| Source file | sound-designer.component.ts |

The **SoundDesignerComponent** serves as a specialized modal interface for the granular manipulation of synthesizer parameters. It acts as a high-fidelity configuration layer that allows users to modify the properties of a `SynthPreset` without directly mutating the original source data until an explicit save action is triggered.

**Functional Mission**
The primary responsibility of the **SoundDesignerComponent** is to provide a controlled "drafting" environment for sound synthesis parameters. It solves the problem of accidental state mutation by maintaining an internal signal-based draft of the preset, enabling users to experiment with waveforms, frequencies, filter cutoffs, and various modulation effects (reverb, delay, chorus, etc.) before committing changes to the global application state.

**System Context & Integration**
This component functions as a leaf-node UI module within the sound mixer subsystem. It receives a `SynthPreset` via input, which is then decoupled into a local `designerDraft` signal. It interacts with the broader system through three primary output channels: `preview` (to trigger immediate auditory feedback), `save` (to persist changes to the underlying model), and `close` (to terminate the editing session). It is designed to be used within the context of the [Sound Mixer](/AgentDocs/editor/components/sound-mixer/sound-mixer.md) to refine individual sound assets.

- **INTERNAL REFERENCES**: [SynthPreset](/AgentDocs/editor/models/synth.types.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `waveform_options` (Implicit: `['sine', 'square', 'sawtooth', 'triangle', 'noise']`)  Available oscillator types for the generator.
- `frequency_range` (Default: `min: 20, max: 2000`)  Bounds for the frequency slider.
- `cutoff_range` (Default: `min: 200, max: 8000`)  Bounds for the filter cutoff slider.
- `duration_range` (Default: `min: 0.1, max: 4.0`)  Bounds for sound duration in seconds.
- `glide_range` (Default: `min: 0, max: 1`)  Bounds for portamento time in seconds.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `preset` | `@Input` | The source `SynthPreset` object to be edited. |
| `title` | `@Input` | The display string for the modal header. |
| `isEditingTimelineNote` | `@Input` | Boolean flag indicating if the context is a timeline note. |
| `isEditingPreset` | `@Input` | Boolean flag indicating if the context is a preset. |
| `presetColors` | `@Input` | Array of color strings for track color selection. |
| `save` | `@Output` | Emits the modified `SynthPreset` to the parent. |
| `close` | `@Output` | Emits a void signal to close the modal. |
| `preview` | `@Output` | Emits the current draft `SynthPreset` for audio playback. |
| `designerDraft` | `signal` | Internal reactive state holding the uncommitted changes. |
| `updateDraft` | `Method` | Handles string-based input updates (e.g., Name). |
| `updateDraftNumber` | `Method` | Handles numeric-based input updates (e.g., Frequency). |
| `updateDraftValue` | `Method` | Performs the atomic update of the `designerDraft` signal. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The component receives the `preset` input.
    2. The `designerDraft` signal is initialized with a copy of the `preset`.
    3. `ngOnChanges` monitors the `preset` input; if the input reference changes, the `designerDraft` signal is reset to the new value to ensure synchronization.
- **Data Path**: 
    1. **Input**: User interacts with a UI element (Range, Text, or Button).
    2. **Processing**: 
        - `updateDraft` or `updateDraftNumber` captures the event.
        - `updateDraftValue` uses the spread operator `{ ...draft, [key]: value }` to create a new immutable state object.
        - The `designerDraft` signal updates, triggering Angular's change detection.
    3. **Output**: 
        - On `preview.emit()`, the current `designerDraft` value is sent to the audio engine.
        - On `save.emit()`, the current `designerDraft` value is sent to the persistence layer.
- **Conditional Branching**:
    - `ngOnChanges` checks if the `preset` key specifically has changed and if the `currentValue` is truthy before updating the signal.
    - Template logic uses `@for` loops to dynamically render waveform buttons and color palettes based on provided arrays.

## 5. Resource Dependencies
- **Standard Libraries**: `Angular Core` (Component, Signal, OnChanges, SimpleChanges, EventEmitter, Input, Output), `Angular Common` (DecimalPipe).
- **Internal Modules**: 
    - [SynthPreset](/AgentDocs/editor/models/synth.types.md)
- **External Packages**: None identified.