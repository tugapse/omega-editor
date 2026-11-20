## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ShaderInspector |
| Source file | shader-inspector.ts |

The **ShaderInspector** component is a specialized UI controller within the editor's inspection system, designed to provide a graphical interface for manipulating `Shader` objects. It extends the base object inspection logic to handle the unique requirements of shader programming, specifically the selection of fragment and vertex source files and the real-time modification of shader uniform properties.

**Functional Mission**
The primary responsibility of **ShaderInspector** is to bridge the gap between the raw `Shader` data structures and the user interface. It solves the problem of shader configuration by providing dropdown menus for switching between predefined shader source templates (fragment and vertex) and dynamically generating property editors for the shader's internal parameters.

**System Context & Integration**
As a subclass of [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md), this component integrates into the broader inspector workflow. When a `Shader` is selected, it populates the inspector view by filtering available sources from `ShaderSources` and mapping shader properties to view models. It facilitates a feedback loop where user changes in the UI (via `onShaderSelected` or `onDefaultChanged`) trigger immediate updates to the `Shader` instance and command a recompile of the GPU program via `this._shader.recompile()`.

- **INTERNAL REFERENCES**: 
    - [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)
    - [MaterialInspector](/AgentDocs/editor/inspectors/material-inspector/material-inspector.md)
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [DefaultInspector](/AgentDocs/editor/inspectors/default-inspector/default-inspector.md)
    - [DropdownComponent](/AgentDocs/app/components/dropdown/dropdown.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `ignored` (Default: `['handle', 'entity', 'entity_picker', 'retro']`)  List of shader source keys to exclude from the dropdown selection lists.
- `debug` (Default: `false`)  Boolean flag for debugging logic (unused in current implementation).

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `shader` | `@Input` Setter/Getter | Receives the target `Shader` object, initializes the selection state, and populates the source dropdown lists. |
| `selectedFrag` | Getter | Returns the currently active fragment shader `DropdownItem` from the available list. |
| `selectedVert` | Getter | Returns the currently active vertex shader `DropdownItem` from the available list. |
| `onDefaultChanged` | Method | Updates a specific property on the `Shader` instance when a value is modified via the default inspector. |
| `onShaderSelected` | Method | Updates the `fragUri` or `vertexUri` of the shader and triggers a recompile. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The constructor calls `super()` and adds `fragUri` and `vertexUri` to the `denyProperties` array to prevent them from being treated as standard editable properties in the default property list.
- **Data Path**:
    1. **Input**: The `@Input() shader` is set.
    2. **Processing (Dropdowns)**: The component iterates through `ShaderSources.frag` and `ShaderSources.vertex`. It filters out keys containing `/tools/`, `/functions/`, or those present in the `ignored` list.
    3. **Processing (Properties)**: `loadProperties()` is called, which iterates through the `Shader` object keys, filters them via `isPropertyValid`, and converts them into view models using `createPropertyViewModel`.
    4. **Output**: The UI renders dropdowns for shader sources and a list of property editors for the shader's uniforms.
- **Conditional Branching**:
    - In `onDefaultChanged`, if the incoming `value` is an instance of `Event`, the update is aborted to prevent accidental state corruption from DOM events.
    - In `loadProperties`, if `this._selectedObject.property` is null/undefined, the properties list is cleared and execution halts.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [MaterialInspector](/AgentDocs/editor/inspectors/material-inspector/material-inspector.md)
    - [DefaultInspector](/AgentDocs/editor/inspectors/default-inspector/default-inspector.md)
    - [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)
    - [DropdownComponent](/AgentDocs/app/components/dropdown/dropdown.md)
- **External Packages**: 
    - `angular/core`
    - `omega-game-engine` (Provides `Color`, `EngineCache`, `NumberRange`, `Shader`, `ShaderSources`)