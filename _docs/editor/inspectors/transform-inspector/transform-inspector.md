## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TransformInspector | editor/inspectors/transform-inspector/transform-inspector |

This component is responsible for providing a user interface panel that allows developers to inspect and manipulate the transformation properties (position, rotation, and scale) of a `SceneEntity` within the editor environment. It handles user input, such as dragging handles or modifying input fields, to translate these changes into direct updates on the entity's underlying `Transform` object.

Architecturally, `TransformInspector` functions as a specialized UI component within the editor framework. It consumes a `SceneEntity` via an `@Input()` to gain access to its `Transform`. It relies on services like [ConfirmationService](/src/app/services/confirmation.service.md) for user confirmations and utilizes directives like [DragHandleDirective](/editor/directives/mouse-drag.directive.md) to manage interactive manipulation of the entity's properties.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| entity | Input | The `SceneEntity` whose transform properties are to be inspected and modified. |
| collapsed | Input | A boolean flag determining the visibility state of the inspector panel. |
| onSpanDrag | Method | Handles drag events, applying delta values to translate, rotate, or scale the entity based on the drag side. |
| performAction | Method | Executes the specific transformation action (translate, rotate, or scale) on the `Transform` object based on the provided index. |
| onPositionChanged | Method | Updates the local position of the transform when a position input field changes. |
| onRotationChanged | Method | Updates the local rotation of the transform when a rotation input field changes. |
| onScaleChanged | Method | Updates the local scale of the transform when a scale input field changes. |
| onReset | Method | Prompts the user to confirm a reset action, which sets the entity's local position, rotation, and scale back to identity values. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component manages three primary modes of transformation manipulation: direct input binding (via `onPositionChanged`, `onRotationChanged`, `onScaleChanged`), interactive dragging (via `onSpanDrag`), and a global reset function. When an entity is bound via the `entity` input, the component initializes its internal `Transform` reference and synchronizes its local scale values. All modifications are applied to the `Transform` object, which then calls `updateMatrices()` to reflect the changes in the scene graph.
- **Side Effects:** The code mutates the state of the `Transform` object associated with the bound `SceneEntity`. It also interacts with the `ConfirmationService` to trigger user prompts.
- **Error Handling:** The `onReset` method uses the `ConfirmationService` to guard against accidental state mutation, ensuring that transformation resets only occur upon explicit user confirmation.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [CommonModule](/angular/common.md) [InpectorTogglePanel](/editor/inspectors/inpector-toggle-panel/inpector-toggle-panel.md) [DragHandleDirective](/editor/directives/mouse-drag.directive.md) [Icon](/src/app/components/icon/icon.md) [ConfirmationService](/src/app/services/confirmation.service.md) [SceneEntity](/omega-game-engine/scene-entity.md) [Transform](/omega-game-engine/transform.md) [EngineLogger](/src/engine/logger.md)