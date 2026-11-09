## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Raycast | editor/behaviours/scene-editor/raycast |

This component provides mathematical utilities for performing raycasting operations within the 3D scene environment. Its primary responsibility is to translate 2D screen coordinates into 3D world-space rays, and to calculate the precise intersection point between a given ray and a defined plane.

This utility class functions as a core mathematical service layer within the scene editor. It relies on camera and viewport data to correctly map screen space to world space, fitting into the geometric calculation pipeline that supports user interaction and object selection within the [Camera](/editor/behaviours/scene-editor/camera.md) context.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| Raycast.screenPointToRay | Static Method | Converts a 2D screen point (relative to the viewport) into a normalized 3D ray direction vector originating from the camera's position. |
| Raycast.intersectRayWithPlane | Static Method | Calculates the intersection point between a ray (defined by origin and direction) and an infinite plane (defined by origin and normal). Returns null if the ray is parallel to the plane. |

## 3. Implementation Details & Side Effects
- **Core Logic:** `screenPointToRay` uses inverse projection and inverse view matrices to transform clip-space coordinates derived from screen coordinates back into world space, yielding the ray direction. `intersectRayWithPlane` uses the standard formula for line-plane intersection, solving for the parameter $t$ where the ray intersects the plane.
- **Side Effects:** None.
- **Error Handling:** `intersectRayWithPlane` handles the case where the ray direction is parallel to the plane by checking if the dot product of the ray direction and plane normal is near zero, returning `null` in that scenario.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [Camera](/editor/behaviours/scene-editor/camera.md), [CanvasViewport](/editor/behaviours/scene-editor/canvas-viewport.md), [Mouse](/editor/behaviours/scene-editor/mouse.md)