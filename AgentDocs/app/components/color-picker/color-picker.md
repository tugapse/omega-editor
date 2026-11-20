## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ColorPickerComponent |
| Source file | color-picker.ts |

The **ColorPickerComponent** is a specialized UI utility designed to provide a high-fidelity, interactive color selection interface. It enables users to manipulate color values across multiple coordinate systems, including HSV (Hue, Saturation, Value), RGB (Red, Green, Blue), HEX, CMYK, and HSL, through intuitive visual sliders and a 2D color area.

**Functional Mission**
The primary responsibility of the **ColorPickerComponent** is to abstract the complex mathematical conversions between different color models into a seamless user experience. It solves the problem of precise color selection by providing dedicated interaction zones for hue, saturation/value, and alpha (transparency) channels, ensuring that any visual manipulation is immediately translated into standardized data formats.

**System Context & Integration**
This component serves as a fundamental building block for various inspector modules within the editor. It is strategically positioned to be consumed by high-level inspection tools, such as the [Color Inspector](/AgentDocs/editor/inspectors/color-inspector/color-inspector.md), which rely on its ability to emit standardized RGBA and HEX data. By handling its own internal state and mathematical transformations, it reduces the computational burden on parent components and ensures consistent color manipulation behavior across the entire application.

## 2. Environment & Configuration
**Environment Lookups:**
- `NgZone` (via `constructor`)  Used to ensure that asynchronous mouse movement updates trigger Angular's change detection cycle.

**Hardcoded Constants:**
- `hue` (Default: `286`)  Initial hue angle in degrees.
- `saturation` (Default: `0.41`)  Initial saturation level (0-1).
- `value` (Default: `0.50`)  Initial brightness/value level (0-1).
- `alpha` (Default: `1`)  Initial opacity level (0-1).

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `color` | `@Input` | Setter that accepts an `{ r, g, b, a }` object to synchronize the component's internal HSV state with external data. |
| `colorChange` | `@Output` | Emits an object containing the updated `{ rgba, hex }` whenever the user interacts with the picker. |
| `onColorAreaMousedown` | Method | Initiates dragging logic for the 2D saturation/value color area. |
| `onHueSliderMousedown` | Method | Initiates dragging logic for the hue selection slider. |
| `onAlphaSliderMousedown` | Method | Initiates dragging logic for the alpha/transparency slider. |
| `onMouseMove` | `@HostListener` | Global listener that updates color values based on the active dragging state. |
| `onMouseUp` | `@HostListener` | Resets all dragging states to `false`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The component initializes internal HSV properties (`hue`, `saturation`, `value`, `alpha`).
    2. `ngOnInit` triggers `updateAllColors()` to establish the initial RGB/HEX/CMYK/HSL state.
    3. `ngAfterViewInit` calculates and sets the initial visual positions of the UI pointers (color, hue, and alpha pointers) based on the current state.
    4. A `ResizeObserver` is attached to the color area and hue slider to ensure pointer positions remain accurate if the component dimensions change.
- **Data Path**: 
    1. **Input**: An RGBA object is passed via the `color` input.
    2. **Processing**: The component converts RGB to HSV via `rgb01ToHsv`.
    3. **Interaction**: User mouse movements trigger `updateColorFromColorArea`, `updateHueFromHueSlider`, or `updateAlphaFromAlphaSlider`.
    4. **Transformation**: The updated HSV values are passed to `hsvToRgb01`, which produces the new RGBA. This is then branched into `rgb255ToHex`, `rgb255ToCmyk`, and `rgb01ToHsl`.
    5. **Output**: The final `rgba` and `hex` values are emitted via `colorChange`.
- **Conditional Branching**:
    - **Dragging State**: The `onMouseMove` handler uses a conditional ladder (`if/else if`) to determine which specific slider or area is currently being manipulated.
    - **Dimension Safety**: Methods like `updateColorPointerPosition` check for `clientWidth > 0` to prevent division-by-zero or invalid CSS positioning during the initial render or resize events.
    - **CMYK Edge Case**: In `rgb255ToCmyk`, if the key (black) component is 1 (pure black), the cyan, magenta, and yellow components are explicitly forced to 0 to avoid division by zero.

## 5. Resource Dependencies
- **Standard Libraries**: `Math` (for color conversions and clamping).
- **Internal Modules**: 
    - None identified (The component is self-contained and does not import other files from the provided MANIFEST).
- **External Packages**: 
    - `@angular/core` (Component, Lifecycle, EventEmitter, etc.)
    - `@angular/common` (CommonModule)