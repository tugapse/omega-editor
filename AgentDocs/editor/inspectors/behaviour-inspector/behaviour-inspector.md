## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | BehaviourInspector |
| Source file | behaviour-inspector.ts |

The **BehaviourInspector** is a specialized UI component designed to provide a granular interface for inspecting and modifying the properties of an `EntityBehaviour`. It extends the base `ObjectInspector` functionality to handle the specific complexities of game engine behaviours, such as rendering states, enum-based configurations, and boolean toggles.

**Functional Mission**
The primary responsibility of **BehaviourInspector** is to dynamically generate a property editing interface based on the metadata of a selected `EntityBehaviour`. It solves the problem of providing a unified, type-safe way for editors to manipulate complex engine properties (like `CullFace` or `RenderLayer`) without hardcoding every possible property field, instead using reflection-like mapping of enums and booleans.

**System Context & Integration**
This component acts as a specialized view within the inspector subsystem. It receives an `EntityBehaviour` via an `@Input` setter, which triggers a property loading sequence. It integrates with [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md) to handle standard object properties while overriding the `denyProperties` list to prevent the modification of protected engine state (like `active` or `parent`). It utilizes [ConfirmationService](/AgentDocs/app/services/confirmation.service.md) to safely handle destructive actions, such as removing a behaviour from an entity.

## 2. Environment & Configuration
**Environment Lookups:**
- `behaviour` (via `@Input` setter)  The target `EntityBehaviour` instance being inspected.

**Hardcoded Constants:**
- `drawingEnums`  A mapping of engine enums (`RenderLayer`, `CullFace`, `DephFunction`, `FaceWinding`) converted into UI-friendly dropdown structures.
- `renderBooleans`  A list of specific boolean property keys (`enableCullFace`, `enableDephTest`, etc.) that require specialized boolean inspector rendering.
- `denyProperties`  A list of property keys that are excluded from the standard inspector view to protect core engine logic.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `behaviour` | Input (Setter/Getter) | Sets the target behaviour and triggers `loadProperties()`. |
| `onEnumChanged` | Method | Updates the underlying behaviour property when a dropdown selection changes. |
| `onDefaultChanged` | Method | Updates the behaviour property for standard types (string, number, boolean, etc.). |
| `onRemoveBehaviourRequested` | Method | Triggers a confirmation dialog to delete the behaviour from its parent entity. |
| `loadProperties` | Method (Override) | Orchestrates the parsing of enums and booleans into `ITargetProperty` arrays for the template. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The component initializes `drawingEnums` by iterating through `omega-game-engine` enums and filtering out numeric keys to create key-value pairs for dropdowns.
    - `denyProperties` is constructed by combining hardcoded protected keys with the keys found in `drawingEnums` and `renderBooleans`.
- **Data Path**:
    1. **Input**: An `EntityBehaviour` is passed to the `behaviour` setter.
    2. **Processing**: `loadProperties()` is called.
        - It iterates through `drawingEnums` to find matching values on the behaviour and creates `ITargetProperty` objects of type `enum`.
        - It iterates through `renderBooleans` to find matching values and creates `ITargetProperty` objects of type `boolean`.
    3. **Output**: The `_renderProperties` and `_renderEnable` arrays are populated, which the HTML template uses to render [TextInputInspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md), [BooleanInspector](/AgentDocs/editor/components/inspector-components/boolean-inspector/boolean-inspector.md), and [EnumInspector](/AgentDocs/editor/inspectors/enum-inspector/enum-inspector.md).
- **Conditional Branching**:
    - **Enum Selection**: If `onEnumChanged` is triggered, the value is applied directly to the behaviour.
    - **Removal Logic**: `onRemoveBehaviourRequested` branches based on the `ConfirmationService` subscription; if `confirmed` is true, the behaviour is removed from `this.behaviour.parent`.

## 5. Resource Dependencies
- **Standard Libraries**: `Angular Core` (Component, Input)
- **Internal Modules**: 
    - [InpectorTogglePanel](/AgentDocs/editor/components/inpector-toggle-panel/inpector-toggle-panel.md)
    - [BooleanInspector](/AgentDocs/editor/components/inspector-components/boolean-inspector/boolean-inspector.md)
    - [TextInputInspector](/AgentDocs/editor/components/inspector-components/text-input-inspector/text-input-inspector.md)
    - [DropdownItem](/AgentDocs/app/components/dropdown/dropdown.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
    - [ConfirmationService](/AgentDocs/app/services/confirmation.service.md)
    - [DefaultInspector](/AgentDocs/editor/inspectors/default-inspector/default-inspector.md)
    - [EnumInspector](/AgentDocs/editor/inspectors/enum-inspector/enum-inspector.md)
    - [ObjectInspector](/AgentDocs/editor/inspectors/object-inspector/object-inspector.md)
    - [ShaderInspector](/AgentDocs/editor/inspectors/shader-inspector/shader-inspector.md)
- **External Packages**: `omega-game-engine` (Provides `EntityBehaviour`, `RenderLayer`, `CullFace`, `DephFunction`, `FaceWinding`, `Color`, `NumberRange`)