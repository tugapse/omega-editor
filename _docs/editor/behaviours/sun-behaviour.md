## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SunBehaviour | /editor/behaviours/sun-behaviour.md |

This component is responsible for simulating the celestial mechanics of a day/night cycle within the game engine environment. Its primary responsibility is to dynamically control the position, color, and intensity of the primary directional light (the sun) based on an internal time-of-day clock. It also manages an optional secondary light source (the moon) and updates associated visual elements like skybox colors, cloud movement, and starfield intensity to create a cohesive atmospheric simulation.

As an `EntityBehaviour`, this component acts as a sophisticated controller or service layer attached to a scene entity. It interfaces heavily with the scene's rendering pipeline, specifically interacting with the [SkyboxRenderer](/editor/behaviours/skybox-renderer.md) to drive visual changes, and directly manipulates the properties of the scene's directional lights and scene fog to reflect the current time state.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SunBehaviour | Class | Controls the sun's position, color, and the day/night cycle in the scene. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component uses a time-based system where `timeOfDay` progresses based on `elapsed` time. It calculates the sun's 3D position using trigonometric functions based on the time, simulating an arc path defined by `sunHeight`. It uses `getInterpolationData` to determine the correct color and visual state (e.g., sunrise, noon, night) and then interpolates between defined color palettes (`lighColor`, `dayPhaseColors`) using a `delta` factor. The `_calculateShadowStrength` method manages the transition of shadow intensity between day and night phases.
- **Side Effects:** Mutates external/global state by directly modifying the properties of the scene's directional lights (color, position, active state), the scene's ambient properties (`scene.clearColor`, `scene.sceneFog.color`), and the uniforms of the [SkyboxShader](/editor/behaviours/skybox-shader.md) via the [SkyboxRenderer](/editor/behaviours/skybox-renderer.md).
- **Error Handling:** The `initialize` method checks for the existence of the scene and the `SkyboxRenderer`, falling back to searching the scene objects if the direct parent reference fails. The `update` loop includes checks (`if (!this.parent?.scene) return;`) to prevent runtime errors if the scene context is lost.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [omega-game-engine](/omega-game-engine.md)