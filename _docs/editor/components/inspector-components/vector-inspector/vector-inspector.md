## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| VectorInspector | editor/components/inspector-components/vector-inspector/vector-inspector.md |

This component is responsible for providing a user interface to inspect and modify vector data (Vector4, Vector3, or Vector2) within the editor environment. It manages the display of the vector's components, allowing users to interact with values either through dedicated text inputs or via a visual gizmo representation.

Architecturally, `VectorInspector` functions as a specialized UI component within the editor's inspection panel. It consumes vector data via `@Input()` properties and emits changes through the `@Output()` `vectorChanged` event, allowing parent components to react to modifications made to the underlying vector state. It relies on other specialized components like [TextInputInspector](/editor/components/inspector-components/text-input-inspector/text-input-inspector.md) and [EditorVectorGizmoComponent](/editor/components/inspector-components/vector-gizmo/vector-gizmo.md) to handle specific input mechanisms.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `vectorKeys` | Input | An array of strings defining the keys (e.g., 'x', 'y', 'z', 'w') associated with the vector components. |
| `vector` | Input | The actual vector data (Vector4, Vector3, or Vector2) being inspected and edited. |
| `label` | Input | A string used to provide a descriptive title for the inspector panel. |
| `scale` | Input | A numerical factor used to scale the visual representation of the vector, typically for the gizmo. |
| `vectorChanged` | Output | An event emitter that fires whenever the vector's value is successfully modified, passing the updated vector instance. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component manages two primary modes of interaction: direct text input modification via `onVectorChanged` or manipulation via a gizmo interface using `onGizmoChanged`. Both methods ensure that the input value is sanitized (e.g., fixed to three decimal places for text inputs) before updating the internal `this.vector` state and emitting the change event.
- **Side Effects:** Mutates the internal state of the `this.vector` object and emits events to notify external subscribers of data changes.
- **Error Handling:** Includes checks (`if ($event.value instanceof Event) return;` and `if (value instanceof Event) return;`) to prevent processing invalid event objects as data values.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `@angular/core`
- **Internal:** [TextInputInspector](/editor/components/inspector-components/text-input-inspector/text-input-inspector.md), [EditorVectorGizmoComponent](/editor/components/inspector-components/vector-gizmo/vector-gizmo.md), [Icon](/src/app/components/icon/icon.md), [InpectorTogglePanel](/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)