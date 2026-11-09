## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TextureInspector | editor/inspectors/texture-inspector/texture-inspector |

This component is responsible for providing a dedicated inspection panel for `Texture` objects within the editor environment. It allows developers to view and modify the various parameters associated with a texture, such as filtering modes (`minFilter`, `magFilter`) and wrapping modes (`wrapS`, `wrapT`). It extends `ObjectInspector` to inherit base inspection functionality while specializing in texture-specific controls.

Architecturally, `TextureInspector` functions as a specialized UI component within the editor's inspection system. It relies on `ObjectInspector` for general object handling and utilizes `InpectorTogglePanel`, `DefaultInspector`, and `EnumInspector` to render the specific controls for texture properties. It interacts with the `editorService` to trigger canvas resizing upon parameter changes.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| TextureInspector | Class | Extends ObjectInspector to manage and display texture properties. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by setting up enumerations for texture modes (`TextureFilterMode`, `TextureWrapMode`) and defining properties that should be denied direct editing. The `onDefaultChanged` method updates the texture property when a standard value changes, triggering a texture rebuild if an enum property is modified. The `onTextureEnumChange` method handles changes to filter or wrap modes by calling specific setter methods on the texture object and then requesting a canvas resize.

- **Side Effects:** Mutates the state of the selected `Texture` object via its setters (`setMagFilter`, `setMinFilter`, etc.). It also calls `this.editorService.requestCanvasResize()`, which implies interaction with a global editor service state.

- **Error Handling:** The `onDefaultChanged` method includes a guard clause (`if ($event instanceof Event) return;`) to prevent processing non-data events.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [InpectorTogglePanel](/editor/inspectors/texture-inspector/inpector-toggle-panel.md) [ObjectInspector](/editor/inspectors/object-inspector/object-inspector.md) [DefaultInspector](/editor/inspectors/default-inspector/default-inspector.md) [EnumInspector](/editor/inspectors/enum-inspector/enum-inspector.md) [DropdownItem](/src/app/components/dropdown/dropdown.md)