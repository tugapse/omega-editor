## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EditorVectorGizmoComponent |
| Source file | vector-gizmo.ts |

The **EditorVectorGizmoComponent** is a specialized UI control designed for the visual manipulation of 3D vector data (X, Y, Z coordinates) within the editor's inspector interface. It provides a tactile, canvas-based interface that allows users to adjust spatial values through intuitive mouse gestures, specifically supporting "trackball" movement for positional offsets and "roll" movement for rotational (Z-axis) adjustments.

**Functional Mission**
The primary responsibility of the **EditorVectorGizmoComponent** is to abstract complex 3D coordinate manipulation into a simplified 2D circular interface. It solves the problem of precise vector editing by providing two distinct interaction modes: a central area for translating X and Y values via relative mouse movement, and an outer ring for rotating the Z-axis value based on angular displacement.

**System Context & Integration**
This component serves as a low-level input primitive within the inspector ecosystem. It is typically consumed by higher-level inspector modules, such as the [Vector Inspector](/AgentDocs/editor/components/inspector-components/vector-inspector/vector-inspector.md), to provide a visual way to edit numeric properties. When a user interacts with the canvas, the component emits `valueChange` events containing the specific index and new value, which are then propagated up the component tree to update the underlying data models or engine states.

- **INTERNAL REFERENCES**: [Vector Inspector](/AgentDocs/editor/components/inspector-components/vector-inspector/vector-inspector.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `sensitivity` (Default: `0.015`)  Scaling factor applied to mouse movement delta to determine the magnitude of value change.
- `canvas width/height` (Default: `80`)  Dimensions of the HTML5 canvas element.
- `outerRadius` (Default: `width / 2`)  The boundary for the 'roll' interaction mode.
- `innerRadius` (Default: `outerRadius * 0.75`)  The boundary for the 'trackball' interaction mode.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `x` | `@Input<number>` | The current X-axis value of the vector. |
| `y` | `@Input<number>` | The current Y-axis value of the vector. |
| `z` | `@Input<number>` | The current Z-axis value (rotation) of the vector. |
| `valueChange` | `@Output<EventEmitter>` | Emits `{ index: number, value: number }` to notify parent components of updates. |
| `onMouseDown` | Method | Determines the `dragMode` based on the click location relative to the canvas radii. |
| `onMouseMove` | Method | Calculates new vector values based on the active `dragMode` and mouse deltas. |
| `onMouseUp` | Method | Resets the dragging state and clears the active mode. |
| `drawGizmo` | Method | Renders the visual representation of the gizmo (rings and rotation indicator) on the canvas. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - `ngAfterViewInit`: Acquires the 2D rendering context from the canvas and performs the initial `drawGizmo` call.
    - `ngOnChanges`: Triggers a redraw whenever input properties (`x`, `y`, or `z`) change to ensure the visual indicator (the orange line) matches the data.
- **Data Path**: 
    - **Input**: Receives `x`, `y`, `z` values from the parent component.
    - **Processing**: 
        - *Trackball Mode*: Calculates `dx`/`dy` from `lastMouse` and applies `sensitivity` to update `x` and `y`.
        - *Roll Mode*: Calculates the angular difference between the current mouse position and the `initialAngle` to update `z`.
    - **Output**: Emits updated values via `valueChange` event.
- **Conditional Branching**:
    - **Interaction Mode Selection**: 
        - If `dist <= innerRadius` $\rightarrow$ `dragMode = 'trackball'`.
        - Else if `dist <= outerRadius` $\rightarrow$ `dragMode = 'roll'`.
        - Else $\rightarrow$ Abort interaction.
    - **Angle Normalization**: In `roll` mode, the angular difference is normalized within $[-\pi, \pi]$ to prevent sudden jumps when crossing the 0-degree threshold.

## 5. Resource Dependencies
- **Standard Libraries**: `Math` (for trigonometry and distance calculations).
- **Internal Modules**: 
    - None identified (imports are standard Angular core modules).
- **External Packages**: 
    - `@angular/core` (Component lifecycle, decorators, and event handling).