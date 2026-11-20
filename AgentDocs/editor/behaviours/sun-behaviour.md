## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SunBehaviour |
| Source file | sun-behaviour.ts |

The **SunBehaviour** is a high-level environmental controller responsible for simulating a dynamic day/night cycle within a 3D scene. It orchestrates the movement of celestial bodies (Sun and Moon), manages the color transitions of the skybox, and adjusts scene-wide lighting and shadow properties based on a temporal progression system.

By acting as a bridge between the simulation time and the visual rendering components, it ensures that the atmosphere, light direction, and shadow intensity evolve cohesively. It serves as a central authority for environmental aesthetics, driving the state of both directional lights and the skybox shader to create a unified sense of time.

**Functional Mission**
The primary mission of **SunBehaviour** is to automate the visual progression of time. It solves the problem of manual lighting management by calculating the mathematical arc of the sun/moon, interpolating color palettes for different times of day (sunrise, noon, sunset, night), and synchronizing these changes across the `SkyboxRenderer` and the scene's lighting system.

**System Context & Integration**
This component is an `EntityBehaviour` that must be attached to a `DirectionalLight` entity (representing the Sun). It integrates deeply with the following systems:
- **Lighting System**: It manipulates `DirectionalLight` entities to change their position (arc movement), color, and intensity (alpha/strength).
- **Skybox System**: It communicates with the `SkyboxRenderer` to update shader uniforms, including sky/horizon colors, sun/moon direction, and cloud/star parameters.
- **Scene Environment**: It modifies the `SceneEntity` properties, specifically `clearColor` and `sceneFog.color`, to ensure the ambient environment matches the celestial state.
- **Shadow System**: It dynamically adjusts the `shadowstrength` of the scene's shadow renderer based on the time of day.

- **INTERNAL REFERENCES**: 
    - [SkyboxRenderer](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md) (Note: Referenced via engine types)
    - [DirectionalLight](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [SkyboxShader](/AgentDocs/engine/shaders/shader-sources.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `this.parent.scene.isRunning`  Checks if the engine simulation is active before progressing time.
- `this.parent.scene.lights`  Accesses the scene's light collection to find or create the moon light.
- `this.parent.scene.shadowmap`  Accesses the shadow rendering configuration to adjust shadow strength.

**Hardcoded Constants:**
- `sunDistance` (Default: `1.0`)  The radius of the sun's orbital arc.
- `fadeDuration` (Default: `0.5`)  Hardcoded local variable for sun alpha fading (30 minutes).
- `nightDuration` (Calculated: `24 - night + sunrise`)  The temporal span of the night phase.
- `transitionDelta` (Calculated via `smoothstep`)  Used for non-linear color/alpha transitions.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `SunBehaviour` | Class | Main controller for day/night cycle and celestial movement. |
| `instanciate` | Static Method | Factory method for creating new instances of the behaviour. |
| `initialize` | Method | Sets up references to the `SkyboxRenderer` and ignores `moonLight` during serialization. |
| `update` | Method | The main execution loop; updates time, moon light, sun position, and light colors. |
| `updateTime` | Private Method | Increments `timeOfDay` and `moon.phase` based on `elapsed` time and `speed`. |
| `updateSunPosition` | Private Method | Calculates 3D coordinates for the sun and moon based on a tilted orbital arc. |
| `getInterpolationData` | Private Method | Determines the current color/sky state and the `delta` (0-1) for interpolation. |
| `updateLightColor` | Private Method | Manages the color, alpha, and shadow strength of the primary and moon lights. |
| `updateSkybox` | Private Method | Triggers the update of the `SkyboxRenderer` shader uniforms. |
| `_updateSkyboxShaderVariables` | Private Method | Directly maps behaviour properties (sun, moon, clouds, stars) to `SkyboxShader` uniforms. |
| `toJsonObject` | Method | Serializes the component state for persistence. |
| `fromJson` | Method | Deserializes the component state from JSON. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Validates parent scene existence.
    2. Locates the `SkyboxRenderer` on the parent or within the scene hierarchy.
    3. Performs an initial `update(0)` to set the starting state.
- **Data Path**: 
    1. **Input**: `elapsed` time (seconds) and user-defined `NumberRange` settings.
    2. **Processing**: 
        - `updateTime` $\rightarrow$ calculates current `timeOfDay`.
        - `getInterpolationData` $\rightarrow$ calculates color/sky interpolation factors.
        - `updateSunPosition` $\rightarrow$ converts time to 3D vector coordinates.
        - `_calculateShadowStrength` $\rightarrow$ calculates shadow intensity based on time.
    3. **Output**: Updates `DirectionalLight` (position, color, alpha), `Scene` (fog, clear color), `Shadowmap` (strength), and `SkyboxShader` (uniforms).
- **Conditional Branching**:
    - **Moon Light Management**: If `moon.useDirectionalLight` is true, it ensures a `MoonLight` entity exists and is active; otherwise, it deactivates it.
    - **Time Phase Logic**: `getInterpolationData` branches into four distinct temporal states: Sunrise $\rightarrow$ Noon, Noon $\rightarrow$ Sunset, Sunset $\rightarrow$ Night, and Night $\rightarrow$ Sunrise (handling the midnight wrap-around).
    - **Sun Visibility**: Calculates `sunAlpha` based on whether the time is within the `fadeDuration` of sunrise/sunset or if the sun is below the horizon.

## 5. Resource Dependencies
- **Standard Libraries**: `Math`
- **Internal Modules**: 
    - [EntityBehaviour](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [SkyboxRenderer](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [DirectionalLight](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [Color](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [SceneEntity](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [EntityType](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [Vector3](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [SkyboxShader](/AgentDocs/engine/shaders/shader-sources.md)
    - [Light](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [JsonSerializedData](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [ObjectInstanciator](/AgentDocs/editor/behaviours/sun-behaviour.md)
    - [ClassType](/AgentDocs/editor/behaviours/sun-behaviour.md)
- **External Packages**: `gl-matrix` (for `vec3` operations)