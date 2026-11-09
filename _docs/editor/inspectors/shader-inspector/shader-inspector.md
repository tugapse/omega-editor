## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ShaderInspector | editor/inspectors/shader-inspector/shader-inspector.md |

This component is responsible for providing a dedicated inspection panel for `Shader` objects within the editor environment. Its primary function is to expose and manage the shader's properties, allowing users to modify shader parameters like fragment and vertex source URIs via dropdown selectors. It abstracts the complexity of shader source management, enabling direct manipulation of the shader instance.

As a specialized extension of [ObjectInspector](/editor/inspectors/object-inspector/object-inspector.md), the `ShaderInspector` acts as a specialized UI controller within the editor's property panel system. It integrates various UI components like [InpectorTogglePanel](/editor/components/inpector-toggle-panel/inpector-toggle-panel.md) and [DropdownComponent](/src/app/components/dropdown/dropdown.md) to present shader-specific controls, ensuring that the shader object's state is correctly synchronized with the editor view.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ShaderInspector | Class | Extends ObjectInspector to provide specialized property viewing for Shader objects. |
| shader | Getter/Setter | Provides read/write access to the underlying `Shader` instance. |
| selectedFrag | Getter | Returns the `DropdownItem` corresponding to the currently selected fragment shader URI. |
| selectedVert | Getter | Returns the `DropdownItem` corresponding to the currently selected vertex shader URI. |
| onDefaultChanged | Method | Handles changes to standard properties on the shader object. |
| onShaderSelected | Method | Updates the shader's URI based on a selection from the shader dropdowns and triggers recompilation. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by populating dropdown lists (`_shaderFraList` and `_shaderVertList`) by scanning `ShaderSources.frag` and `ShaderSources.vertex` keys, filtering out internal or ignored sources. When the `shader` input is set, it loads properties using the inherited `loadProperties` method, which filters properties based on validity. Changes are applied via `onDefaultChanged` or `onShaderSelected`, which directly mutates the `_shader` instance.
- **Side Effects:** The component mutates the state of the `Shader` object (`this._shader[item.key] = value;`) and explicitly calls `this._shader.recompile()` when a shader URI is selected, which implies an internal engine state change (recompilation).
- **Error Handling:** The `loadProperties` method includes a check (`if (!this._selectedObject?.property)`) to gracefully handle cases where the shader property is not yet available, setting properties to an empty array.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [MaterialInspector](/editor/inspectors/material-inspector/material-inspector.md), [InpectorTogglePanel](/editor/components/inpector-toggle-panel/inpector-toggle-panel.md), [DefaultInspector](/editor/inspectors/default-inspector/default-inspector.md), [ObjectInspector](/editor/inspectors/object-inspector/object-inspector.md), [DropdownComponent](/src/app/components/dropdown/dropdown.md)