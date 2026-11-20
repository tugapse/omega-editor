## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EntityPicker | editor/behaviours/scene-editor/entitypick.behaviour |

This component is responsible for implementing entity picking functionality within the scene editor. It achieves this by rendering the entire scene geometry into a texture buffer and then reading the color value at the mouse cursor's position. This pixel data is then used to determine which entity, if any, was clicked.

As a `RendererBehaviour`, it functions as a specialized rendering controller within the scene graph. It interacts heavily with the [SceneTreeService](/editor/services/scene-tree.service.md) to notify the application when an entity has been successfully selected, and it utilizes the [GizmosBoxBehaviour](/editor/behaviours/scene-editor/gizmos-behaviour.md) to manage selection state.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EntityPicker | Class | Extends RendererBehaviour to handle scene picking logic. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `renderAndGetSelected` method executes the picking process. It first renders all objects in the scene into an off-screen texture using a custom shader. During rendering, each object is assigned a unique ID (`u_entity_id`). After rendering, `_gl.readPixels` samples the texture at the mouse coordinates. The resulting pixel data is checked against the entity IDs rendered, and the `selectedEntityId` is updated accordingly. The `draw` method triggers this process upon a mouse button down event.

- **Side Effects:** Mutates external state by calling `this.sceneTreeService.onEntitySelected.emit(selectedEntity)` when a selection is made. It also mutates the internal state of the `GizmosBoxBehaviour` via `this.boundingBehaviour.setTargetEntity(entity)`.

- **Error Handling:** The component checks for the existence of necessary components (e.g., `this.shader?._shaderProgram`, `obs`) before attempting rendering or reading pixels to prevent runtime crashes.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `omega-game-engine` (WebGL2RenderingContext, Texture, Shader, Mouse, Keybord, etc.)
- **Internal:** [SceneTreeService](/editor/services/scene-tree.service.md), [GizmosBoxBehaviour](/editor/behaviours/scene-editor/gizmos-behaviour.md)