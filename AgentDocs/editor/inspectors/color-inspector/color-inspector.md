## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ColorInspector |
| Source file | color-inspector.ts |

The **ColorInspector** component serves as a specialized UI controller within the editor's inspection system, specifically designed to facilitate the manipulation of color data. It acts as a bridge between the raw `Color` data models used by the engine and the user interface, providing both a visual color picker and granular numerical input fields for RGBA components.

**Functional Mission**
The primary responsibility of **ColorInspector** is to provide a high-fidelity interface for selecting and fine-tuning color values. It solves the problem of translating abstract color objects into human-readable and editable formats (strings for UI inputs) and ensuring that any changes made via the UI are correctly synchronized back to the underlying engine state.

**System Context & Integration**
This component is integrated into the broader inspector ecosystem, likely residing within an inspector window or panel. It consumes color data via `@Input` and communicates modifications back to parent components (such as a material or entity inspector) via the `colorChange` `@Output`. It relies on [ColorPickerComponent](/AgentDocs/app/components/color-picker/color-picker.md) for visual selection and [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md) for structural UI layout.

- **INTERNAL REFERENCES**: [ColorPickerComponent](/AgentDocs/app/components/color-picker/color-picker.md), [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `YIQ_WEIGHTS` (via `textColor` getter)  Uses coefficients `299`, `587`, and `114` to calculate perceived luminance for high-contrast text rendering.
- `DEFAULT_TEXT_COLOR_DARK` (Default: `#111827`)  Used when background luminance is high.
- `DEFAULT_TEXT_COLOR_LIGHT` (Default: `#f9fafb`)  Used when background luminance is low.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `label` | `@Input` | String descriptor for the inspector section. |
| `selectedColor` | `@Input` | The current `Color` object being inspected. |
| `colorChange` | `@Output` | Emits the updated `Color` object after user modification. |
| `textColor` | Getter | Computes the optimal text color (black or white) for UI readability against the selected color. |
| `onColorChanged` | Method | Handles incoming color updates from the picker, updates local string representations, and emits changes. |
| `updateLocalStrings`| Private Method | Formats raw numeric RGBA values into fixed-point strings for UI display. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Upon `ngOnInit`, the component extracts the `r`, `g`, `b`, and `a` components from the `selectedColor` input.
    - `updateLocalStrings` is called to convert these numbers into two-decimal precision strings for the template.
- **Data Path**: 
    - **Input**: `selectedColor` (Color object) $\rightarrow$ `updateLocalStrings` $\rightarrow$ `r, g, b, a` (string properties).
    - **Processing**: User interacts with `ColorPickerComponent` $\rightarrow$ `onColorChanged` is triggered with new RGBA values.
    - **Output**: `onColorChanged` $\rightarrow$ `selectedColor.set(...)` $\rightarrow$ `colorChange.emit(selectedColor)`.
- **Conditional Branching**:
    - **Luminance Check**: Inside `textColor`, the YIQ formula calculates a brightness value. If `yiq >= 128`, it returns a dark hex code; otherwise, it returns a light hex code to ensure contrast.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [ColorPickerComponent](/AgentDocs/app/components/color-picker/color-picker.md)
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
- **External Packages**: 
    - `@angular/core` (Component, EventEmitter, Input, Output, etc.)
    - `omega-game-engine` (Color class)