## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | GizmosBoxBehaviour |
| Source file | gizmos-behaviour.ts |

The **GizmosBoxBehaviour** is a specialized rendering and interaction component responsible for providing visual manipulation handles (gizmos) within the 3D scene editor. It enables users to perform precise transformationstranslation, rotation, and scalingon selected entities by rendering interactive geometric primitives (cones, tori, planes, and boxes) that respond to mouse input.

**Functional Mission**
The primary mission of **GizmosBoxBehaviour** is to bridge the gap between 2D screen-space mouse interactions and 3D world-space transformations. It solves the problem of intuitive object manipulation by providing a visual interface that represents the entity's local or world axes, handling complex raycasting logic to determine how mouse movement should translate into mathematical changes in position, rotation, or scale.

**System Context & Integration**
This component acts as a high-level interaction layer within the scene editor. It subscribes to state changes from the [EditorService](/AgentDocs/editor/services/editor.service.md) to synchronize the current `GizmoMode` and `TransformSpace`. During the render loop, it utilizes a secondary "picking" passrendering invisible, color-coded geometry to a textureto identify which specific handle the user is interacting with. Once an interaction is validated, it directly modifies the `Transform` properties of the [SceneEntity](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md) (via the engine's transform system), effectively driving the spatial state of the scene.

- **INTERNAL REFERENCES**: [GizmoMode](/AgentDocs/editor/behaviours/scene-editor/gizmo-mode.enum.md), [TransformSpace](/AgentDocs/editor/behaviours/scene-editor/transform-space.enum.md), [EditorService](/AgentDocs/editor/services/editor.service.md), [Raycast](/AgentDocs/editor/behaviours/scene-editor/raycast.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The WebGL2 rendering context used for all drawing operations.
- `editorService.gizmoMode` (via `constructor`)  Observable stream providing the current active mode (Translate, Rotate, Scale).
- `editorService.transformSpace` (via `constructor`)  Observable stream providing the coordinate system (Local vs World).

**Hardcoded Constants:**
- `HANDLE_ID_TRANSLATE_X` (Default: `1`)  Unique identifier for X-axis translation handle.
- `HANDLE_ID_TRANSLATE_Y` (Default: `2`)  Unique identifier for Y-axis translation handle.
- `HANDLE_ID_TRANSLATE_Z` (Default: `3`)  Unique identifier for Z-axis translation handle.
- `HANDLE_ID_SCALE_X` (Default: `4`)  Unique identifier for X-axis scale handle.
- `HANDLE_ID_SCALE_Y` (Default: `5`)  Unique identifier for Y-axis scale handle.
- `HANDLE_ID_SCALE_Z` (Default: `6`)  Unique identifier for Z-axis scale handle.
- `HANDLE_ID_ROTATE_X` (Default: `7`)  Unique identifier for X-axis rotation handle.
- `HANDLE_ID_ROTATE_Y` (Default: `8`)  Unique identifier for Y-axis rotation handle.
- `HANDLE_ID_ROTATE_Z` (Default: `9`)  Unique identifier for Z-axis rotation handle.
- `HANDLE_ID_TRANSLATE_XY` (Default: `10`)  Unique identifier for XY plane translation handle.
- `HANDLE_ID_TRANSLATE_XZ` (Default: `11`)  Unique identifier for XZ plane translation handle.
- `HANDLE_ID_TRANSLATE_YZ` (Default: `12`)  Unique identifier for YZ plane translation handle.
- `dragThreshold` (Default: `3`)  Pixel distance required to transition from a click to a drag state.
- `gizmoSize` (Default: `1.0`)  Base scale for the visual gizmo elements.
- `gizmoScale` (Default: `1.5`)  Multiplier for the scale of the handle geometry.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `setTargetEntity` | Method | Sets the entity currently targeted for gizmo rendering and manipulation. |
| `setHoveredEntity` | Method | Sets the entity currently being hovered by the mouse for bounding box highlighting. |
| `draw` | Method | The main render loop entry point; handles interaction logic and draws bounding boxes and gizmos. |
| `updateEditor` | Method | Processes keyboard input for mode switching and transform space toggling. |
| `setMatrices` | Method | Utility to upload model and world matrices to a specific shader. |
| `drawBoundingBox` | Method | Renders a wireframe box around an entity's bounds. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Initializes standard and picking shaders.
    2. Creates a `pickingTexture` for off-screen color-based picking.
    3. Instantiates helper classes: `ConeHelper`, `CubeHelper`, `PlaneHelper`, `TorusHelper`, and `ScaleBoxHelper`.
    4. Subscribes to `EditorService` for real-time updates to `gizmoMode` and `transformSpace`.
- **Data Path (Interaction Loop)**:
    1. **Input**: Mouse movement or button clicks are captured via `Mouse` and `Keybord` globals.
    2. **Picking (Processing)**: If the mouse moves, a hidden pass renders the gizmo handles to `pickingTexture` using `pickingShader`, where each handle is assigned a unique integer ID encoded as a color.
    3. **Identification**: `readPixels` retrieves the color at the mouse coordinate, which is converted back into a `HANDLE_ID`.
    4. **Transformation (Output)**: Based on the `activeHandle`, the component calculates a delta (via `Raycast.intersectRayWithPlane`) and applies the resulting translation, rotation, or scale to the `selectedEntity.transform`.
- **Conditional Branching**:
    - **Transform Space**: Logic branches between `TransformSpace.World` (using global axes) and `TransformSpace.Local` (using entity-relative axes).
    - **Gizmo Mode**: The `draw` and `drag` methods switch logic paths based on whether the mode is `Translate`, `Scale`, or `Rotate`.
    - **Planar vs. Axial**: In translation, the logic branches if the handle is a 2D plane (planar movement) or a 1D axis (axial movement).

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (math operations).
- **Internal Modules**: 
    - [ConeHelper](/AgentDocs/editor/behaviours/scene-editor/cone.helper.md)
    - [CubeHelper](/AgentDocs/editor/behaviours/scene-editor/cube.helper.md)
    - [PlaneHelper](/AgentDocs/editor/behaviours/scene-editor/plane.helper.md)
    - [TorusHelper](/AgentDocs/editor/behaviours/scene-editor/torus.helper.md)
    - [ScaleBoxHelper](/AgentDocs/editor/behaviours/scene-editor/scale-box.helper.md)
    - [Raycast](/AgentDocs/editor/behaviours/scene-editor/raycast.md)
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [GizmoMode](/AgentDocs/editor/behaviours/scene-editor/gizmo-mode.enum.md)
    - [TransformSpace](/AgentDocs/editor/behaviours/scene-editor/transform-space.enum.md)
- **External Packages**: `omega-game-engine` (Core engine primitives and types).