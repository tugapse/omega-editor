## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EntityPicker |
| Source file | entitypick.behaviour.ts |

The **EntityPicker** is a specialized rendering behaviour designed to facilitate object selection within the 3D scene editor. It operates by performing an off-screen render pass where every selectable entity is drawn into a dedicated texture, using its unique entity ID as its color value. This technique, often referred to as "color picking," allows for pixel-perfect selection of complex geometries that might be difficult to resolve with standard raycasting.

**Functional Mission**
The primary responsibility of **EntityPicker** is to translate 2D mouse coordinates into 3D entity references. It solves the problem of identifying which specific object a user has clicked on by leveraging the GPU to encode identity data into the color buffer, providing a high-performance and accurate selection mechanism.

**System Context & Integration**
This component acts as a bridge between user input (mouse clicks) and the scene state. It integrates deeply with the [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md) to emit selection events, notifying the rest of the editor when an entity is chosen. It also interacts with [GizmosBoxBehaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md) to update visual feedback (bounding boxes) for the selected entity. During its execution, it iterates through the scene's objects, utilizing their individual `RendererBehaviour` properties to perform the picking pass.

- **INTERNAL REFERENCES**: 
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)
    - [GizmosBoxBehaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `CanvasViewport.rendererWidth` (via `refreshTexture`)  Used to synchronize the picking texture dimensions with the current viewport.
- `CanvasViewport.rendererHeight` (via `refreshTexture`)  Used to synchronize the picking texture dimensions with the current viewport.
- `Mouse.mousePosition.x` (via `renderAndGetSelected`)  Retrieves the X coordinate for pixel reading.
- `Mouse.mousePosition.y` (via `renderAndGetSelected`)  Retrieves the Y coordinate for pixel reading.
- `Keybord.keyDown["control"]` (via `canSelectEntity`)  Checks for modifier key state to determine selection eligibility.

**Hardcoded Constants:**
- `renderTexture` size (Default: `1024x1024`)  Initial allocation size for the picking buffer.
- `_pickingPixel` (Default: `Uint8Array(4)`)  Buffer for reading RGBA data from the GPU.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `renderAndGetSelected` | Public Method | Executes the off-screen render pass, reads the pixel under the mouse, and updates the `selectedEntityId`. |
| `setMatrices` | Public Method | Updates the shader's model and world matrices using the provided `Transform`. |
| `draw` | Override Method | The main lifecycle hook that checks for mouse input and triggers the selection logic. |
| `canSelectEntity` | Private Method | Validates if a selection event should be processed based on keyboard modifiers and state changes. |
| `refreshTexture` | Private Method | Resizes the internal `renderTexture` if the viewport dimensions have changed. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Creates a 1024x1024 `renderTexture`.
    - Initializes a specialized `Shader` using `ShaderSources.frag.entity_picker`.
    - Sets up an empty `MeshData` for the internal mesh.
- **Data Path**: 
    - **Input**: Mouse click event + Scene Object list.
    - **Processing**: 
        1. Iterate through all scene objects.
        2. For each object, bind its position/index buffers.
        3. Set `u_entity_id` uniform to the current object count.
        4. Draw the object into the `renderTexture`.
        5. Use `readPixels` to extract the color at the mouse coordinate.
    - **Output**: `selectedEntityId` update and `sceneTreeService.onEntitySelected` emission.
- **Conditional Branching**:
    - `if (this.boundingBehaviour?.mouseClaimed)`: Aborts picking if a gizmo is currently capturing the mouse.
    - `if (Mouse.mouseButtonDown[0])`: Only triggers the picking logic on a left-click.
    - `if (this._pickingPixel[0] !== this.selectedEntityId)`: Only updates state and emits events if the clicked entity is different from the currently selected one.

## 5. Resource Dependencies
- **Standard Libraries**: `Uint8Array`
- **Internal Modules**: 
    - [RendererBehaviour](omega-game-engine)
    - [Texture](omega-game-engine)
    - [Shader](omega-game-engine)
    - [ColorMaterial](omega-game-engine)
    - [ShaderSources](omega-game-engine)
    - [MeshData](omega-game-engine)
    - [Mouse](omega-game-engine)
    - [Scene](omega-game-engine)
    - [Keybord](omega-game-engine)
    - [ShaderUniformsEnum](omega-game-engine)
    - [CanvasViewport](omega-game-engine)
    - [Transform](omega-game-engine)
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)
    - [GizmosBoxBehaviour](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md)
- **External Packages**: `omega-game-engine`