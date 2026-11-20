## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| MaterialInspector | editor/inspectors/material-inspector/material-inspector.md |

This component is responsible for providing a dedicated inspector panel for editing the properties of a `ColorMaterial` instance within the editor environment. It extends `ObjectInspector` to specialize its behavior, allowing users to view and modify material parameters like color, texture assignments, and numerical ranges specific to materials.

Architecturally, `MaterialInspector` functions as a specialized UI component within the editor's inspection system. It consumes a `ColorMaterial` object via its `@Input()` setter, which triggers the loading of relevant properties. It integrates with the broader inspection framework by utilizing `ObjectInspector` for property management and relies on `TextureInspector` for handling texture-specific inputs.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `material` | Setter | Sets the `ColorMaterial` object to be inspected. This triggers property loading and updates the internal state. |

## 3. Implementation Details & Side Effects
- **Core Logic:** When the `material` input is set, the component updates its internal state (`_material` and `_selectedObject`) and calls `loadProperties()`. This method iterates over the material's properties, filters them based on validity, and separates them into texture-based and general properties before populating the internal property list (`_properties`). The `onDefaultChanged` method handles updates by directly assigning the new value to the corresponding key in the `_material` object.

- **Side Effects:** None.

- **Error Handling:** The `loadProperties` method includes a check (`if (!this._selectedObject?.property)`) to gracefully handle cases where no property is available, setting `this._properties` to an empty array and returning early.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [DefaultInspector](/editor/inspectors/default-inspector/default-inspector.md) [InpectorTogglePanel](/editor/components/inpector-toggle-panel/inpector-toggle-panel.md) [ObjectInspector](/editor/inspectors/object-inspector/object-inspector.md) [TextureInspector](/editor/inspectors/texture-inspector/texture-inspector.md)