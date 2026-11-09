## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| GizmosBoxBehaviour | editor/behaviours/scene-editor/gizmos-behaviour.md |

This component is responsible for rendering and managing the interactive gizmos (translation, rotation, scaling) that allow users to manipulate `SceneEntity` transformations within the editor viewport. It handles the complex logic of translating mouse input into geometric transformations, utilizing raycasting and picking textures to determine which gizmo handle the user is interacting with.

Architecturally, `GizmosBoxBehaviour` acts as a specialized `RendererBehaviour` within the scene editor context. It subscribes to state changes from [EditorService](/services/editor.service.md) to dynamically adjust its behavior based on the active [GizmoMode](/editor/behaviours/scene-editor/gizmo-mode.enum.md) and [TransformSpace](/editor/behaviours/scene-editor/transform-space.enum.md). It relies heavily on helper components like [ConeHelper](/editor/behaviours/scene-editor/cone.helper.md) and [ScaleBoxHelper](/editor/behaviours/scene-editor/scale-box.helper.md) for visual representation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `GizmosBoxBehaviour` | Class | Manages the rendering and interaction logic for scene entity gizmos. |
| `mouseClaimed` | Boolean | Indicates if the gizmo interaction system currently has control over mouse input. |
| `hoveredBoundingBoxColor` | Color | Color used to highlight the bounding box of the currently hovered entity. |
| `hoveredBoundingBoxLineWidth` | Number | Line width used for the bounding box of the currently hovered entity. |
| `hoveredBoundingBox` | BoundingBox | The bounding box of the currently hovered entity. |
| `hoveredEntity` | SceneEntity | The entity currently under the mouse hover. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component operates in two main phases: rendering and interaction. Rendering involves drawing the selected entity's bounding box and the active gizmo based on the current `GizmoMode` (Translate, Scale, Rotate). Interaction is driven by mouse movement and clicks. When the mouse moves, a picking pass is executed using a dedicated shader and texture to identify the clicked handle ID. If a handle is active, the component calculates the necessary transformation (translation, scaling, or rotation) by intersecting the camera ray with a plane defined by the gizmo handle's orientation, updating the entity's transform accordingly.
- **Side Effects:** Mutates external state by directly modifying the `Transform` component of the `SceneEntity` when dragging occurs. It also interacts with the rendering context (`_gl`) to perform drawing operations and read pixel data from the picking texture.
- **Error Handling:** Fallbacks are implemented when `selectedEntity` is null, preventing drawing or interaction logic from executing. The drag interaction includes checks to prevent division by zero or collapse to zero scale.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [EditorService](/services/editor.service.md), [Camera](/omega-game-engine.md), [CanvasViewport](/omega-game-engine.md), [Color](/omega-game-engine.md), [ColorMaterial](/omega-game-engine.md), [Colors](/omega-game-engine.md), [CubePrimitive](/omega-game-engine.md), [DephFunction](/omega-game-engine.md), [SceneEntity](/omega-game-engine.md), [Keybord](/omega-game-engine.md), [MeshData](/omega-game-engine.md), [Mouse](/omega-game-engine.md), [RendererBehaviour](/omega-game-engine.md), [Shader](/omega-game-engine.md), [ShaderSources](/omega-game-engine.md), [ShaderUniformsEnum](/omega-game-engine.md), [Texture](/omega-game-engine.md), [Transform](/omega-game-engine.md), [Vector3](/omega-game-engine.md), [ConeHelper](/editor/behaviours/scene-editor/cone.helper.md), [CubeHelper](/editor/behaviours/scene-editor/cube.helper.md), [PlaneHelper](/editor/behaviours/scene-editor/plane.helper.md), [Raycast](/editor/behaviours/scene-editor/raycast.md), [TorusHelper](/editor/behaviours/scene-editor/torus.helper.md), [ScaleBoxHelper](/editor/behaviours/scene-editor/scale-box.helper.md)