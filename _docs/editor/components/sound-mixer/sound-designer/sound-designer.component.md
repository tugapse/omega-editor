## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SoundDesignerComponent | editor/components/sound-mixer/sound-designer/sound-designer.component |

This component is responsible for providing a comprehensive, interactive user interface for designing and tweaking a synthesizer sound preset. It aggregates various parameterssuch as waveform, frequency, filter cutoff, effects mixes (reverb, delay, distortion), and modulation settings (LFO)into a single, cohesive modal view. Its primary responsibility is to allow users to manipulate these parameters in real-time via sliders and selectors, building up a draft configuration of a `SynthPreset`.

Architecturally, this component functions as a complex UI controller within the sound mixing module. It manages its state using Angular Signals (`designerDraft`) initialized from an input `SynthPreset`. It communicates its final state changes to parent components via `@Output` events (`save`, `preview`, `close`), effectively acting as a data producer that feeds finalized sound definitions back into the application's state management or timeline editor.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `preset` | Input | The initial `SynthPreset` object loaded into the designer for editing. |
| `title` | Input | The title displayed in the designer modal header. |
| `isEditingTimelineNote` | Input | Boolean flag indicating if the designer is being used in the context of a timeline note. |
| `isEditingPreset` | Input | Boolean flag indicating if the designer is being used for editing an existing preset. |
| `presetColors` | Input | An array of color strings used to render the track color palette. |
| `save` | Output | Emits the finalized `SynthPreset` when the user clicks 'Save'. |
| `close` | Output | Emits an empty event when the user closes the designer modal. |
| `preview` | Output | Emits the current `SynthPreset` draft for immediate audio preview. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component utilizes Angular Signals to maintain a mutable copy (`designerDraft`) of the input `SynthPreset`. User interactions (input events on range sliders or button clicks) trigger methods (`updateDraft`, `updateDraftNumber`, `updateDraftValue`) that update this signal. The `ngOnChanges` lifecycle hook ensures that if the input `preset` changes externally, the internal draft state is synchronized immediately.
- **Side Effects:** The component emits events (`save`, `preview`, `close`) to notify parent components of state changes or user actions, which constitutes interaction with the application's external state flow.
- **Error Handling:** No explicit error handling (try/catch blocks) is implemented for input validation or API calls within this component's logic.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`, `@angular/common`
- **Internal:** [SynthPreset](/editor/models/synth.types.md)