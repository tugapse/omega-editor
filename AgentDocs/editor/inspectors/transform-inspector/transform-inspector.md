## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | TransformInspector |
| Source file | transform-inspector.ts |

The **TransformInspector** component serves as a specialized UI controller within the editor's inspection system, specifically designed to manipulate the spatial properties of a `SceneEntity`. It provides a high-density interface for real-time adjustment of an entity's translation, rotation, and scale through both direct numerical input and interactive drag-based gestures.

**Functional Mission**
The primary responsibility of **TransformInspector** is to bridge the gap between the user's intent (via mouse drags or text input) and the underlying `Transform` data of a game object. It solves the problem of precise spatial manipulation by providing synchronized controls for position, rotation, and scale, ensuring that any changes made in the UI are immediately reflected in the engine's transformation matrices.

**System Context & Integration**
This component acts as a leaf node in the inspector hierarchy, typically rendered within an inspector window. It consumes a `SceneEntity` via an `@Input` and directly modifies its associated `Transform` object. It integrates with the `DragHandleDirective` for gesture-based adjustments and utilizes the `ConfirmationService` to prevent accidental resets. Changes propagated through this component trigger matrix updates within the `omega-game-engine`, which subsequently affects how the entity is rendered and processed in the physics/scene simulation.

- **INTERNAL REFERENCES**: 
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [DragHandleDirective](/AgentDocs/editor/directives/mouse-drag.directive.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [ConfirmationService](/AgentDocs/app/services/confirmation.service.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `confirmService` (via `inject(ConfirmationService)`)  Used to trigger user confirmation dialogs before destructive actions like resetting transforms.

**Hardcoded Constants:**
- `valueScale` (Default: `0.1`)  A multiplier used to scale the delta movement during drag operations to ensure smooth, controllable input.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `entity` | `@Input` (Setter) | Receives a `SceneEntity`, extracts its `Transform`, and synchronizes local scale properties. |
| `collapsed` | `@Input` | Controls the visual expansion/contraction state of the inspector section. |
| `onSpanDrag` | Method | Handles drag-based delta updates for translation, rotation, or scale based on the drag side and index. |
| `performAction` | Method | Executes the mathematical application of delta values to the `Transform` object and triggers matrix updates. |
| `onPositionChanged` | Method | Updates the entity's local position based on numerical input from the UI. |
| `onRotationChanged` | Method | Updates the entity's local rotation based on numerical input from the UI. |
| `onScaleChanged` | Method | Updates the entity's local scale based on numerical input from the UI. |
| `onReset` | Method | Triggers a confirmation flow to reset position to (0,0,0), rotation to (0,0,0), and scale to (1,1,1). |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Upon receiving an `entity` via the setter, the component extracts the `Transform` reference.
    - It forces a dirty state (`setDirty(true)`) and updates matrices to ensure the UI reflects the current engine state.
    - Local scale components (`scaleX`, `scaleY`, `scaleZ`) are synchronized with the entity's current `localScale`.
- **Data Path**: 
    - **Input**: User interacts via `onSpanDrag` (mouse delta) or `on[Property]Changed` (text input).
    - **Processing**: 
        - For drags: `delta * valueScale` is calculated and passed to `performAction`.
        - For inputs: The string value from the event target is cast to a number and applied to the transform array.
    - **Output**: The `Transform` object is modified, and `updateMatrices()` is called to propagate changes to the engine.
- **Conditional Branching**:
    - `onSpanDrag` uses a `switch` on `side` to determine if the drag affects X, Y, or Z axes.
    - `performAction` uses a `switch` on `index` to determine if the operation is a translation (0), rotation (1), or scale (2) operation.
    - `onReset` uses a subscription to the `ConfirmationService` to decide whether to apply the reset values based on user approval.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [DragHandleDirective](/AgentDocs/editor/directives/mouse-drag.directive.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [ConfirmationService](/AgentDocs/app/services/confirmation.service.md)
- **External Packages**: 
    - `@angular/common`
    - `@angular/core`
    - `omega-game-engine` (Provides `SceneEntity` and `Transform`)