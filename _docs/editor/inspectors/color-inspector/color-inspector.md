## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ColorInspector | editor/inspectors/color-inspector/color-inspector.md |

This component is responsible for providing a user interface element that allows developers to inspect, select, and modify a specific color value within the editor environment. It manages the state of the selected color, displaying its components (R, G, B, A) and providing a mechanism to emit changes when the color is altered via an integrated color picker.

Architecturally, `ColorInspector` functions as a specialized UI component within the editor's inspection panel system. It consumes a `Color` object via an `@Input()` and emits updates through a `colorChange` `@Output()`. It relies on `ColorPickerComponent` for the actual color selection interaction and `InpectorTogglePanel` for structural layout within the editor interface.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ColorInspector | Class | Manages color state, handles input/output events, and calculates UI presentation based on the selected color. |
| colorChange | EventEmitter | Emits the updated `Color` object whenever the user modifies the color selection. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by reading the input `Color` values and populating local string representations for R, G, B, and A. It features a `textColor` getter that uses the YIQ formula to determine if the background color is light or dark, thus selecting a high-contrast text color (`#111827` or `#f9fafb`). The `onColorChanged` method updates the internal `Color` object and emits the change event upon receiving data from the color picker.
- **Side Effects:** None. The component manages internal state and emits events but does not interact with the network or filesystem.
- **Error Handling:** The `textColor` getter includes a null check (`if (!this.selectedColor)`) to prevent runtime errors if the input color is not provided.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [ColorPickerComponent](/src/app/components/color-picker/color-picker.md), [InpectorTogglePanel](/src/editor/inspectors/color-inspector/components/inpector-toggle-panel/inpector-toggle-panel.md).