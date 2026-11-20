## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| BoundingBoxGizmo | editor/behaviours/scene-editor/gizmos/bounding-box-gizmo |

This component is responsible for visually representing the wireframe of a three-dimensional bounding box within the scene editor environment. Its primary responsibility is to translate the mathematical properties of a `BoundingBox` object into a series of visible lines rendered by the engine's graphics system, allowing users to visualize the spatial extent of an entity.

The `BoundingBoxGizmo` acts as a presentation layer component within the scene editor's rendering pipeline. It depends on the `RendererBehaviour` to execute drawing commands, fitting into the broader architecture as a visual utility that consumes geometric data from entities managed elsewhere in the system, such as those defined in [omega-game-engine].

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| BoundingBoxGizmo | Class | Manages the drawing logic for a bounding box gizmo. |
| selectedBoundingBoxColor | Color | The color used for the bounding box lines when the entity is selected. |
| selectedBoundingBoxLineWidth | number | The thickness of the lines drawn for the selected bounding box. |
| drawBoundingBox | Method | Draws the wireframe representation of the provided `BoundingBox`, optionally applying padding. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `drawBoundingBox` method calculates the eight corner points of the bounding box, adjusted by a specified `spacing`. It then draws the twelve edges connecting these corners using `renderer.drawLine` to form the complete wireframe structure, separating the drawing into front/back quads and horizontal connections.

- **Side Effects:** Interacts with the external state managed by the `RendererBehaviour` by calling `this.renderer.drawLine()`, which results in rendering operations on the screen.

- **Error Handling:** No explicit error handling is implemented; it assumes valid `BoundingBox` and `RendererBehaviour` inputs.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [omega-game-engine](/omega-game-engine.md)