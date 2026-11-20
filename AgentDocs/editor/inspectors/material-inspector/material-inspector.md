## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | MaterialInspector |
| Source file | material-inspector.ts |

The **MaterialInspector** component is a specialized UI controller within the editor's inspection system, specifically designed to provide a granular interface for modifying `ColorMaterial` properties. It acts as a bridge between the raw engine material data and the user interface, allowing real-time manipulation of visual properties such as colors, ranges, and textures.

**Functional Mission**
The primary responsibility of **MaterialInspector** is to dynamically generate and manage a list of editable property view models derived from a `ColorMaterial` instance. It solves the problem of heterogeneous property types (textures vs. scalar/color values) by categorizing them and ensuring they are rendered using the appropriate specialized inspector components.

**System Context & Integration**
This component extends the [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md) and is integrated into the editor's inspection workflow. When a material is selected, it populates its internal property list by filtering and mapping the object's keys. It handles data synchronization via the `onDefaultChanged` method, which pushes UI updates back to the underlying engine material. It relies on [TextureInspector](/AgentDocs/editor/inspectors/texture-inspector/texture-inspector.md) for texture-based properties and [DefaultInspector](/AgentDocs/editor/inspectors/default-inspector/default-inspector.md) for standard values, while utilizing [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md) for UI layout control.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `material` | `@Input` setter | Receives a `ColorMaterial`, initializes the `_selectedObject` metadata, and triggers property loading. |
| `loadProperties` | Method (Override) | Iterates through `ColorMaterial` keys, validates them, and categorizes them into `textures` and `others` for prioritized rendering. |
| `onDefaultChanged` | Method | Receives updates from child inspector components and applies the new value directly to the `_material` instance. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `material` setter is invoked with a `ColorMaterial` instance.
    2. `_selectedObject` is constructed with `key: value.className`, `type: 'material'`, and the material instance as the `property`.
    3. `_material` is assigned the reference.
    4. `loadProperties()` is called.
- **Data Path**: 
    1. **Input**: `ColorMaterial` object.
    2. **Processing**: `loadProperties` uses `Object.keys()` $\rightarrow$ `isPropertyValid()` filter $\rightarrow$ `createPropertyViewModel()` mapping $\rightarrow$ Type-based partitioning (textures vs. others).
    3. **Output**: `_properties` array containing a sorted list of view models (textures first, then others).
- **Conditional Branching**:
    - **Property Validation**: If `_selectedObject.property` is null/undefined, `_properties` is reset to an empty array.
    - **Type Sorting**: Properties are split into two groups (`textures` and `others`) and recombined to ensure textures appear at the top of the inspector list.
    - **Event Guard**: In `onDefaultChanged`, if the incoming `value` is an instance of `Event`, the update is aborted to prevent accidental corruption from DOM events.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [DefaultInspector](/AgentDocs/editor/inspectors/default-inspector/default-inspector.md)
    - [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)
    - [TextureInspector](/AgentDocs/editor/inspectors/texture-inspector/texture-inspector.md)
- **External Packages**: 
    - `@angular/core`
    - `omega-game-engine` (provides `Color`, `ColorMaterial`, `NumberRange`)