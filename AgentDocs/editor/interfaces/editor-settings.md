## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EditorSettings |
| Source file | editor-settings.ts |

The **EditorSettings** class serves as the centralized data structure for managing the visual and structural configuration of the editor environment. It encapsulates user-specific preferences regarding the viewport appearance, UI layout visibility, and color schemes for various editor overlays.

**Functional Mission**
The primary responsibility of **EditorSettings** is to provide a serializable schema that defines the editor's stateful configuration. It solves the problem of maintaining consistent user preferences across sessions by implementing the `JsonSerializable` interface, allowing the editor's visual state to be easily persisted and restored.

**System Context & Integration**
This component acts as a data contract used by various services and UI components to determine how the editor should be rendered. It is heavily utilized by the [Workspace](/AgentDocs/editor/components/workspace/workspace.md) to manage panel visibility, the [Engine Stats](/AgentDocs/editor/components/engine-stats/engine-stats.md) to toggle debug information, and various [Gizmos](/AgentDocs/editor/behaviours/scene-editor/gizmos-behaviour.md) to determine selection and hover colors. It integrates with the serialization pipeline to ensure that settings can be passed through the [Editor Service](/AgentDocs/editor/services/editor.service.md) for storage.

- **INTERNAL REFERENCES**: [Workspace](/AgentDocs/editor/components/workspace/workspace.md), [Engine Stats](/AgentDocs/editor/components/engine-stats/engine-stats.md), [Editor Service](/AgentDocs/editor/services/editor.service.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `gridColor` (Default: `Colors.black`)  The default color for the editor grid.
- `selectedBoundingBoxColor` (Default: `Colors.aliceBlue`)  The default color for selected entity boundaries.
- `hoveredBoundingBoxColor` (Default: `Colors.aliceBlue`)  The default color for hovered entity boundaries.
- `viewportClearColor` (Default: `Colors.dimGray`)  The default background color of the viewport.
- `workspace.showLeftpanel` (Default: `true`)  Initial visibility state of the left panel.
- `workspace.showRightpanel` (Default: `false`)  Initial visibility state of the right panel.
- `workspace.showFooter` (Default: `false`)  Initial visibility state of the footer.
- `viewport.isEngineStatsVisible` (Default: `false`)  Initial visibility state of engine performance metrics.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `EditorSettings` | Class | Manages and serializes editor configuration state. |
| `toJsonObject` | Method | Converts the class instance into a `JsonSerializedData` object for persistence. |
| `fromJson` | Method | Populates the class instance properties from a `JsonSerializedData` object. |

## 4. Execution Logic & Flow
- **Initialization**: The constructor initializes the class with default color values (`Colors.black`, `Colors.aliceBlue`, `Colors.dimGray`) and sets the default visibility states for the `workspace` and `viewport` objects.
- **Data Path (Serialization)**: `toJsonObject` is called $\rightarrow$ invokes `serializeAutomatically()` $\rightarrow$ returns a `JsonSerializedData` object containing the current property values.
- **Data Path (Deserialization)**: `fromJson` is called with `JsonSerializedData` $\rightarrow$ invokes `super.fromJson(jsonObject)` $\rightarrow$ invokes `this.deserializeAutomatically(jsonObject)` to map JSON keys back to class properties.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [JsonSerializable](/AgentDocs/editor/interfaces/editor-settings.md) (via `omega-game-engine`)
    - [Color](/AgentDocs/editor/interfaces/editor-settings.md) (via `omega-game-engine`)
    - [Colors](/AgentDocs/editor/interfaces/editor-settings.md) (via `omega-game-engine`)
    - [JsonSerializedData](/AgentDocs/editor/interfaces/editor-settings.md) (via `omega-game-engine`)
- **External Packages**: `omega-game-engine`