# Changelog

## Unreleased

### Fixed

- `SunBehaviour` and `RotateBehaviour` are registered again (they were only imported by the demo generator removed in 0.1.0). Scenes using them lost them when loaded, and saving such a scene dropped them for good.
- `SunBehaviour` fades the sun's own shadow (`Light.shadowStrength`) with the time of day, instead of the scene-wide strength the engine no longer has. The day strength defaults to 0.75.
- The "+" menu describes the cube and plane with their real sizes (2×2×2 and 10×10).

### Added

- The texture picker lists a "Cameras" group: the render textures of the scene's cameras (`Camera.targetTexture`, needs the engine's render to texture). The camera's `targetTexture`, `targetWidth` and `targetHeight` show in its inspector.

## 0.1.0 (2026-11-20)

Needs `omega-game-engine` 4.0.0. Until it is published to npm, install the local engine with `npm install --no-save ../omega-engine`.

### Added

- **Project templates:** the New Project dialog offers the API's templates (Empty, Sample). The sample scene and its textures now live in the project, not in the editor.
- **Code Editor button** on the project page. **Go to Editor** opens the latest scene, or creates "Main Scene" when the project has none.
- **Scene tree "+" menu:** Empty Object, Cube, Sphere, Plane, Quad, Cylinder and Torus. Cylinder and torus are generated in code.
- **Default lights:** new scenes start with an ambient and a directional light.
- **Texture slots in the material inspector**, like Unity's: pick a project or built-in texture, or drop one from the Asset Explorer. Empty slots show magenta, and slots show file names.
- **Inspector** docked in the right panel.
- **Resource loading** goes through the engine's `Resources` with an `EditorResourceLoader` that downloads `asset://<id>` with the user's token.

### Changed

- **Project scripts** are fetched with `Authorization: Bearer` and imported from a blob URL; the token is no longer in the URL. A project without compiled scripts is not an error.
- **API models** use the C# API's camelCase field names. "Last Modified" now shows, and renaming an asset works.
- **Removed:** the `?write-scene` demo generator, the user assets in `src/assets` (images, OBJ files, primitives), the shader copies and default textures (now built into the engine), the unused `OmegaEngineService` and `APISettings`, the `run-dev` script, the `debugger;` statements and the audio diagnostics run on every scene load.

### Fixed

- **Register form:** accepts `_` in usernames and shows the API's validation errors.
- **Scenes:** load with the engine's classes registered, and the parent/child hierarchy is restored.
- **Scene tree drag and drop:** matches nodes by id, not name. Parent and order changes are applied to the scene, and a node can't be dropped under its own descendant.
- **Scene tree updates:** were subscribed twice.
- **Project page:** the active status badge and the disabled Sign Up button are styled.
- **Unit tests:** all 15 specs pass.
