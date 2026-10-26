## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ShaderSources |
| Source file | shader-sources.ts |

**ShaderSources** serves as a centralized, static registry for all shader asset paths within the engine. It acts as a single source of truth for mapping logical shader identifiers (such as `skybox`, `default_lit`, or `entity_picker`) to their corresponding physical file paths within the assets directory.

**Functional Mission**
The primary mission of **ShaderSources** is to decouple the engine's shader logic from hardcoded string paths. By providing a structured, type-safe interface for accessing shader files, it prevents path duplication errors and simplifies the management of shader assets across different rendering stages, including vertex processing and fragment shading.

**System Context & Integration**
This component functions as a configuration provider for the rendering pipeline. Downstream modules, such as material systems or shader loaders, consume these static mappings to fetch the correct `.vert` and `.frag` files. It is a foundational utility used by the engine to ensure that when a specific visual effect is requested (e.g., a shadow caster or a post-processing effect), the correct source code is retrieved from the filesystem.

- **INTERNAL REFERENCES**: [ShaderSources](/AgentDocs/engine/shaders/shader-sources.md)

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
- `frag.entity_picker` (Default: `'assets/shaders/editor/entity-picker.frag'`)  Path to the entity picker fragment shader.
- `frag.handle` (Default: `'assets/shaders/editor/handle/handle.frag'`)  Path to the handle fragment shader.
- `frag.entity` (Default: `'assets/shaders/editor/picker/entity.frag'`)  Path to the entity picker fragment shader.
- `frag.color` (Default: `'assets/shaders/frag/color.frag'`)  Path to the color fragment shader.
- `frag.default_lit` (Default: `'assets/shaders/frag/default-lit.frag'`)  Path to the default lit fragment shader.
- `frag.default_unlit` (Default: `'assets/shaders/frag/default-unlit.frag'`)  Path to the default unlit fragment shader.
- `frag.depth_only` (Default: `'assets/shaders/frag/depth-only.frag'`)  Path to the depth-only fragment shader.
- `frag.screen_blit` (Default: `'assets/shaders/frag/screen-blit.frag'`)  Path to the screen blit fragment shader.
- `frag.skybox` (Default: `'assets/shaders/frag/skybox.frag'`)  Path to the skybox fragment shader.
- `frag.fog` (Default: `'assets/shaders/functions/fog.frag'`)  Path to the fog function fragment shader.
- `frag.functions` (Default: `'assets/shaders/functions/functions.frag'`)  Path to the general functions fragment shader.
- `frag.light_header` (Default: `'assets/shaders/functions/light-header.frag'`)  Path to the light header fragment shader.
- `frag.light` (Default: `'assets/shaders/functions/light.frag'`)  Path to the light fragment shader.
- `frag.light_old` (Default: `'assets/shaders/functions/light_old.frag'`)  Path to the legacy light fragment shader.
- `frag.retro` (Default: `'assets/shaders/post-processing/retro.frag'`)  Path to the retro post-processing fragment shader.
- `frag.bitangent` (Default: `'assets/shaders/tools/bitangent.frag'`)  Path to the bitangent tool fragment shader.
- `frag.normal` (Default: `'assets/shaders/tools/normal.frag'`)  Path to the normal tool fragment shader.
- `frag.tangent` (Default: `'assets/shaders/tools/tangent.frag'`)  Path to the tangent tool fragment shader.
- `frag.uv` (Default: `'assets/shaders/tools/uv.frag'`)  Path to the UV tool fragment shader.
- `vertex.handle` (Default: `'assets/shaders/editor/handle/handle.vert'`)  Path to the handle vertex shader.
- `vertex.entity` (Default: `'assets/shaders/editor/picker/entity.vert'`)  Path to the entity picker vertex shader.
- `vertex.default` (Default: `'assets/shaders/vertex/default.vert'`)  Path to the default vertex shader.
- `vertex.fullscreen` (Default: `'assets/shaders/vertex/fullscreen.vert'`)  Path to the fullscreen vertex shader.
- `vertex.screen_quad` (Default: `'assets/shaders/vertex/screen-quad.vert'`)  Path to the screen quad vertex shader.
- `vertex.shadow_caster` (Default: `'assets/shaders/vertex/shadow-caster.vert'`)  Path to the shadow caster vertex shader.
- `vertex.skybox` (Default: `'assets/shaders/vertex/skybox.vert'`)  Path to the skybox vertex shader.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ShaderSources` | Class | Static container for shader asset path mappings. |
| `ShaderSources.frag` | Object | Read-only mapping of fragment shader identifiers to file paths. |
| `ShaderSources.vertex` | Object | Read-only mapping of vertex shader identifiers to file paths. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None
- **Internal Modules**: None
- **External Packages**: None