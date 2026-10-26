## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | VectorInspector |
| Source file | vector-inspector.ts |

The **VectorInspector** component serves as a specialized UI controller within the editor's inspection system, designed to provide granular control over multi-dimensional vector data (Vector2, Vector3, or Vector4). It acts as a bridge between the raw mathematical data structures used by the `omega-game-engine` and the user interface, allowing for both direct numerical input and visual manipulation via gizmos.

**Functional Mission**
The primary responsibility of **VectorInspector** is to facilitate the precise editing of vector properties. It solves the problem of multi-axis data entry by providing a unified interface that can dynamically adapt to the dimensionality of the input vector (e.g., showing X, Y, Z, or W components) while ensuring data integrity through controlled numerical formatting and event emission.

**System Context & Integration**
This component is a sub-module of the broader inspector architecture. It integrates with [TextInputInspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md) for individual axis editing and [EditorVectorGizmoComponent](/AgentDocs/editor/components/inspector-components/vector-inspector/component/vector-gizmo.md) for spatial manipulation. When a user modifies a value, the component updates the underlying vector object and emits a `vectorChanged` event, which is typically consumed by higher-level inspector services or entity management modules to persist changes in the scene.

- **INTERNAL REFERENCES**: 
    - [TextInputInspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md)
    - [EditorVectorGizmoComponent](/AgentDocs/editor/components/inspector-components/vector-inspector/component/vector-gizmo.md)
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `vectorKeys` (Default: `['x', 'y', 'z', 'w']`)  Defines the default axis labels for the vector components.
- `scale` (Default: `0.1`)  A multiplier used for gizmo or visual scaling operations.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `vectorKeys` | `@Input` | Array of strings representing the component labels (e.g., 'x', 'y'). |
| `vector` | `@Input` | The target `Vector4`, `Vector3`, or `Vector2` object to be manipulated. |
| `label` | `@Input` | The display title for the inspector section. |
| `scale` | `@Input` | Numerical scale factor for visual components. |
| `vectorChanged` | `@Output` | Emits the updated vector object whenever a component is modified. |
| `onGizmoChanged` | Method | Handles updates originating from the visual gizmo component. |
| `onVectorChanged` | Method | Handles updates originating from text input fields, including numerical rounding. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Sets internal state: `isGizmoMode` (false), `showGizmo` (false), and `collapsed` (true).
    - Receives the target `vector` and `vectorKeys` via dependency injection/input binding.
- **Data Path**:
    - **Input**: User interacts with a text field or a visual gizmo.
    - **Processing (Text)**: `onVectorChanged` receives a value $\rightarrow$ converts to number $\rightarrow$ applies `.toFixed(3)` to ensure precision consistency $\rightarrow$ updates the specific index in `this.vector.vector`.
    - **Processing (Gizmo)**: `onGizmoChanged` receives an index and value $\rightarrow$ validates that the value is not a raw `Event` $\rightarrow$ updates `this.vector.vector[index]`.
    - **Output**: The modified `this.vector` is emitted via `vectorChanged.emit()`.
- **Conditional Branching**:
    - **Event Validation**: Both `onGizmoChanged` and `onVectorChanged` perform a check (`if (value instanceof Event) return;`) to prevent processing raw DOM events as numerical data.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [TextInputInspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md)
    - [EditorVectorGizmoComponent](/AgentDocs/editor/components/inspector-components/vector-inspector/component/vector-gizmo.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
- **External Packages**: 
    - `angular/core` (Component, EventEmitter, Input, Output)
    - `omega-game-engine` (Vector4, Vector3, Vector2)