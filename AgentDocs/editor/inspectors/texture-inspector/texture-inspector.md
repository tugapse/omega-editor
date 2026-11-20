## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | TextureInspector |
| Source file | texture-inspector.ts |

The **TextureInspector** component is a specialized UI module within the editor's inspection system designed to provide granular control over `Texture` objects. It extends the base object inspection logic to handle texture-specific properties such as filtering modes and wrapping behaviors, ensuring that changes made in the UI are correctly propagated to the underlying engine texture instance.

**Functional Mission**
The primary responsibility of **TextureInspector** is to expose the configuration parameters of a selected `Texture` (from `omega-game-engine`) to the user via an interactive interface. It solves the problem of providing a type-safe, user-friendly way to modify low-level GPU texture stateslike minification/magnification filters and UV wrapping modeswithout requiring manual code changes.

**System Context & Integration**
This component operates as a specialized view within the broader inspector hierarchy. It inherits from [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md) and integrates several sub-components to render its interface. When a user modifies a value, the component updates the `Texture` object's state and triggers a `rebuild()` or `setTextureParameters()` call to synchronize the engine's state. It also communicates with the `editorService` to request canvas resizes, ensuring that visual changes (like texture wrapping) are immediately reflected in the viewport.

- **INTERNAL REFERENCES**: 
    - [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [DefaultInspector](/AgentDocs/editor/inspectors/default-inspector/default-inspector.md)
    - [EnumInspector](/AgentDocs/editor/inspectors/enum-inspector/enum-inspector.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `this.editorService.requestCanvasResize()`  Triggers a viewport update in the editor to reflect texture parameter changes.

**Hardcoded Constants:**
- `denyProperties` (Default: `["isLoading", "isLoaded", "image", "textureUri", "minFilter", "magFilter", "wrapS", "wrapT"]`)  Prevents the default inspector from attempting to render or edit these internal/read-only texture properties directly.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `texture` | Getter | Retrieves the `Texture` instance from the currently selected object property. |
| `onDefaultChanged` | Method | Handles updates from standard property inspectors, applying values to the texture and triggering a rebuild if enum-based properties change. |
| `onTextureEnumChange` | Method | Specialized handler for texture-specific dropdowns (wrap/filter) that applies values via setter methods and updates texture parameters. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Calls `super()` to initialize the base `ObjectInspector`.
    2. Maps `TextureFilterMode` and `TextureWrapMode` enums to internal enum objects for UI rendering.
    3. Populates `denyProperties` to exclude non-editable or internal texture metadata from the standard inspection list.
- **Data Path**: 
    - **Input**: User interaction via `DropdownItem` or `ITargetProperty` change.
    - **Processing**: 
        - For standard properties: Direct assignment to `this.texture[key]`.
        - For enums: Conversion of string/dropdown values to numeric types via the unary `+` operator.
    - **Output**: Execution of `texture.rebuild()`, `texture.setTextureParameters()`, and `editorService.requestCanvasResize()`.
- **Conditional Branching**:
    - In `onDefaultChanged`: Checks if the changed property key exists within the `_enums` map; if so, it triggers `texture.rebuild()` to ensure the engine recognizes the change.
    - In `onTextureEnumChange`: Branches based on whether the key is `"filter"` (updating both Mag and Min filters) or a wrap mode (updating both S and T axes).

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)
    - [DefaultInspector](/AgentDocs/editor/inspectors/default-inspector/default-inspector.md)
    - [EnumInspector](/AgentDocs/editor/inspectors/enum-inspector/enum-inspector.md)
- **External Packages**: 
    - `@angular/core`
    - `omega-game-engine` (Provides `Texture`, `TextureFilterMode`, `TextureWrapMode`, `Color`, `NumberRange`)