## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ObjectInspector |
| Source file | object-inspector.ts |

The **ObjectInspector** component serves as a dynamic, polymorphic property editor within the Omega Editor. Its primary purpose is to provide a user interface for inspecting and modifying the internal properties of a selected object (typically a `SceneEntity` or its components) in real-time. It acts as a bridge between the raw data structures of the `omega-game-engine` and the editor's UI, translating complex engine types into human-readable and editable inspector widgets.

**Functional Mission**
The core mission of **ObjectInspector** is to automate the generation of an inspection interface based on the schema and data types of a target object's properties. It solves the problem of manual UI maintenance by using reflection-like logic to detect types (e.g., `Vector3`, `Color`, `Enum`) and mapping them to specialized sub-components, ensuring that any object selected in the scene can be manipulated without writing custom inspector code for every new class.

**System Context & Integration**
This component is a critical part of the inspector subsystem. It receives a `targetObject` via an `@Input` setter, which triggers a re-evaluation of the object's property schema. It interacts heavily with [EditorService](/AgentDocs/editor/services/editor.service.md) to emit changes that affect the global editor state and [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md) to maintain context. When a user modifies a value through a sub-component (like a `VectorInspector`), the component updates the underlying object and emits a `change` event, allowing the engine to react to the mutation.

- **INTERNAL REFERENCES**: 
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [TextInputInspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md)
    - [ColorInspector](/AgentDocs/editor/inspectors/color-inspector/color-inspector.md)
    - [VectorInspector](/AgentDocs/editor/components/inspector-components/vector-inspector/vector-inspector.md)
    - [BooleanInspector](/AgentDocs/editor/components/inspector-components/boolean-inspector/boolean-inspector.md)
    - [EnumInspector](/AgentDocs/editor/inspectors/enum-inspector/enum-inspector.md)
    - [NumberRangeInspector](/AgentDocs/editor/components/inspector-components/number-range-inspector/number-range-inspector.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `scene` (via `editorService.scene`)  Accesses the current active scene to facilitate updates.

**Hardcoded Constants:**
- `denyProperties` (Default: `['meshData', 'gl', 'mesh']`)  Prevents exposure of low-level engine/graphics data to the UI.
- `validTypes` (Default: `['string', 'boolean', 'number', 'shader', 'material', 'color', 'mesh', 'vetor234', 'range']`)  A whitelist of types allowed for display when `showAllProperties` is false.
- `fogType` (via `constructor`)  Pre-populates the enum mapping for fog configuration.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `targetObject` | `@Input` (Setter) | Receives the object to be inspected; triggers `loadProperties()`. |
| `allowProperties` | `@Input` | Whitelist of property keys to display. |
| `denyProperties` | `@Input` | Blacklist of property keys to hide. |
| `change` | `@Output` | Emits the updated property object when a value is modified. |
| `onValueChanged` | Method | Handles scalar/range changes (string, number, boolean, range). |
| `onVectorChanged` | Method | Handles vector-based changes (Vector2, Vector3, Vector4). |
| `onColorChanged` | Method | Handles color-specific changes. |
| `onEnumChange` | Method | Handles selection changes from dropdown menus. |
| `onRangeChange` | Method | Handles updates from the `NumberRange` component. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Injects `SceneTreeService` and `EditorService`.
    2. Initializes the `_enums` map with `FogType` mappings.
- **Data Path (Input  Processing  Output)**:
    1. **Input**: `targetObject` is set.
    2. **Processing**: 
        - `loadProperties()` iterates through keys of `targetObject.property`.
        - `isPropertyValid(key)` filters keys based on `allowProperties`, `denyProperties`, and privacy (underscore prefix).
        - `createPropertyViewModel(key, value)` determines the UI type via `getObjectType(value)`.
        - `getObjectType` performs `instanceof` checks and `className` lookups to categorize the data.
    3. **Output**: `_properties` array is populated with view models, which the template renders using specialized inspector components.
- **Conditional Branching**:
    - **Privacy Check**: If `showPrivateProperties` is false, keys starting with `_` are discarded.
    - **Type Validation**: If `showAllProperties` is false, only keys matching `validTypes` are processed.
    - **Property Filtering**: If `allowProperties` is non-empty, it overrides the default visibility logic.

## 5. Resource Dependencies
- **Standard Libraries**: `angular/core`
- **Internal Modules**: 
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [EditorService](/AgentDocs/editor/services/editor.service.md)
    - [SceneTreeService](/AgentDocs/editor/services/scene-tree.service.md)
    - [TextInputInspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md)
    - [ColorInspector](/AgentDocs/editor/inspectors/color-inspector/color-inspector.md)
    - [VectorInspector](/AgentDocs/editor/components/inspector-components/vector-inspector/vector-inspector.md)
    - [BooleanInspector](/AgentDocs/editor/components/inspector-components/boolean-inspector/boolean-inspector.md)
    - [EnumInspector](/AgentDocs/editor/inspectors/enum-inspector/enum-inspector.md)
    - [NumberRangeInspector](/AgentDocs/editor/components/inspector-components/number-range-inspector/number-range-inspector.md)
- **External Packages**: `omega-game-engine` (Provides `Transform`, `SceneEntity`, `Vector3`, etc.)