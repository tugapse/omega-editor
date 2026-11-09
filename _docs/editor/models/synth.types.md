## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SynthPreset | editor/models/synth.types |

This component defines the core data structures for musical synthesis parameters and note events within the application. It establishes the blueprint for a `SynthPreset`, which encapsulates all the necessary physical and sonic characteristics of a synthesizer patch, such as waveform, frequency, and modulation depths. It also defines `SynthNote`, which extends the preset to include temporal information necessary for playback sequencing.

These interfaces serve as the foundational data model for the audio engine and sequencer components of the application. They dictate the structure of data passed between the UI layer, the state management system, and the actual audio processing modules, ensuring type safety across the system.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SynthPreset | Interface | Defines the static parameters of a synthesizer patch, including waveform, modulation settings, and mixing levels. |
| SynthNote | Interface | Extends `SynthPreset` by adding temporal data (`startTime`) and positional data (`trackIndex`) required for scheduling a specific note event. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** None.