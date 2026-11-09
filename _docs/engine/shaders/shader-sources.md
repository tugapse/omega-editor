## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ShaderSources | engine/shaders/shader-sources.md |

This component serves as a centralized registry for all shader file paths used throughout the rendering engine. It encapsulates static mappings for fragment and vertex shaders, allowing other parts of the application to reference specific shader programs by a descriptive key rather than hardcoding file paths. This abstraction is crucial for maintaining a clean separation of concerns between rendering logic and asset management.

Architecturally, `ShaderSources` acts as a configuration utility or a static resource map within the engine's rendering subsystem. It provides the necessary pointers to the actual shader assets, which are loaded and compiled by the graphics pipeline manager, ensuring that rendering components can reliably access the correct shader definitions for various visual effects like lighting, picking, and post-processing.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ShaderSources.frag | Object | A map containing string paths to various fragment shader files. |
| ShaderSources.vertex | Object | A map containing string paths to various vertex shader files. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component defines two static read-only objects, `frag` and `vertex`, which map symbolic names (e.g., `entity_picker`, `handle`) to their corresponding relative asset paths.
- **Side Effects:** None. The component only stores string constants.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** None.