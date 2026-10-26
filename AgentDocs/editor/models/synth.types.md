## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | synth.types |
| Source file | synth.types.ts |

The **synth.types** component serves as the foundational type definition layer for the synthesis engine within the Omega Editor. It establishes the structural contracts for sound generation parameters and musical note data, ensuring type safety across the audio processing pipeline.

**Functional Mission**
The primary responsibility of **synth.types** is to define the shape of synthesizer presets and musical notes. By providing strict interfaces for oscillator types, modulation parameters (LFO, Filter, Effects), and temporal data, it solves the problem of inconsistent state representation during sound design and sequencing.

**System Context & Integration**
This component acts as a data contract provider for downstream audio modules. It is heavily utilized by the [Sound Designer](/AgentDocs/editor/components/sound-mixer/sound-designer/sound-designer.component.md) for parameter manipulation and the [Sound Mixer](/AgentDocs/editor/components/sound-mixer/sound-mixer.md) for managing audio state. The interfaces defined here facilitate the transition of raw synthesis parameters into actionable instructions for the [Audio Service](/AgentDocs/editor/services/audio.service.md).

- **INTERNAL REFERENCES**: 
    - [Sound Designer](/AgentDocs/editor/components/sound-mixer/sound-designer/sound-designer.component.md)
    - [Sound Mixer](/AgentDocs/editor/components/sound-mixer/sound-mixer.md)
    - [Audio Service](/AgentDocs/editor/services/audio.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `SynthPreset` | Interface | Defines the complete set of synthesis parameters including waveform, frequency, filter cutoff, and various effect mix levels (delay, reverb, distortion, chorus). |
| `SynthNote` | Interface | Extends `SynthPreset` to include temporal and sequencing metadata such as `startTime` and `trackIndex`. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - None identified.
- **External Packages**: None identified.