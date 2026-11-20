# Plan: texture slots in the material inspector

Goal (Unity-style): every texture of a mesh renderer's material (`mainTex`, `normalTex`, …) shows a slot in the Inspector. Click the slot to pick any texture of the project, or drag a texture from the Asset Explorer onto it. The choice survives save and reload.

## How it works today (analysis)

| Piece | Current behaviour | Problem for this feature |
| :-- | :-- | :-- |
| `TextureInspector` (`src/editor/inspectors/texture-inspector`) | Shows preview, filter and wrap for a texture **that already exists**. | No way to change or clear the texture. Empty slots (`null`) are not detected as textures (`ObjectInspector` checks `value instanceof Texture`), so they never show. |
| `MaterialInspector` | Lists texture properties first, then the rest. | Same: only non-null textures. |
| Asset Explorer (`src/editor/components/asset-explorer`) | Floating window (main menu → Asset Explorer). The grid lists assets with click, double-click and context menu. | Items are not draggable. |
| `AssetService.listAssets(projectId, type)` | Lists assets by type (`EngineAssetType.Texture = 'texture'`). | OK as is. |
| `GET /api/projects/{p}/assets/{id}` (omega-api-cs) | Streams the file. **Requires the JWT header.** | `<img src>` cannot send headers. |
| `Texture.load()` (engine) | `image.src = this.textureUri`. The same `textureUri` is what `toJsonObject()` saves as `url`. | The loading URL and the saved URL are the same string. A blob URL loads but would be saved; a stable reference is saved but cannot load. |
| `EngineCache.getTexture2D(uri, gl)` (engine) | Caches `Texture` by URI. `SceneManager.loadScene` calls `EngineCache.clear()` first, then loads `textureMaps` URLs; `LitMaterial`/`UnlitMaterial.fromJson` call `getTexture2D(url)` **without `gl`**. | No hook to resolve a URI before loading, so the editor cannot inject auth. |

**Conclusion:** the editor-side UI is self-contained, but loading project textures needs a small change in the engine's `EngineCache`/`Texture`: separate *the URI that is saved* from *the URL that is loaded*.

## Proposed engine change (omega-engine)

1. `EngineCache.setUriResolver(resolver: (uri: string) => Promise<string> | string)`, default identity.
2. `Texture.load()` keeps `textureUri` for serialisation and sets `image.src = await EngineCache.resolveUri(this.textureUri)`.
3. Optional, same hook: `getMeshDataFromObj` and `loadShaderSource` resolve their URI before `fetch` (project meshes/shaders later).
4. Check that `LitMaterial`/`UnlitMaterial.fromJson` pass `gl` to `getTexture2D` (today they don't). Otherwise textures created during scene load have no GL context.

Delivery: the editor uses `omega-game-engine@3.0.3` from npm. Either publish `3.0.4`, or use `npm link ../omega-engine` while developing. **Your call.**

## Editor work

1. **Stable texture reference.** Project textures are saved as `asset://<assetId>`. Bundled files (`assets/images/...`) keep their relative path.
2. **Resolver** (`src/editor/services/asset-url-resolver.ts`): on `asset://<id>`, download the file with the JWT (`AssetService.getRawAssetContent`), turn it into an object URL (cached per asset id, revoked on project change), and register it with `EngineCache.setUriResolver` at editor start.
3. **Texture slot component** (`editor-texture-slot`): thumbnail + name + clear button. It is a drop target for `application/x-omega-asset` (texture only) and opens a searchable picker (reuse `searchable-menu`) with "None" + `listAssets(project, Texture)`.
4. **Inspector wiring.** `MaterialInspector` shows a slot for each texture property of the material, **including null ones**. The known keys per material class come from `ObjectInstanciator` metadata, or a small map: `LitMaterial: mainTex, normalTex`, `UnlitMaterial: mainTex`. `TextureInspector` keeps preview/filter/wrap under the slot.
5. **Assign.** `material[key] = await EngineCache.getTexture2D('asset://<id>', gl)`, then request a repaint. "None" sets the default white/normal texture instead of `null`, if the shaders need a bound texture (to verify).
6. **Drag source.** Asset grid items are `draggable` and set `application/x-omega-asset` = `{ id, type, name }`.
7. **Tests in the browser:** pick via the list, drag and drop, clear, save (Ctrl+S), reload. Check that the saved JSON has `asset://…`, never a `blob:` URL or a token.

## Order and commits

| Step | Repo | Commit |
| :-- | :-- | :-- |
| 1 | omega-engine | URI resolver in `EngineCache` + `Texture.load` (+ `gl` in materials) |
| 2 | omega-editor | `asset://` resolver service |
| 3 | omega-editor | Draggable asset grid items |
| 4 | omega-editor | Texture slot component + material inspector wiring |
| 5 | omega-editor | Browser test pass, BUGS.md update |

Steps 3–4 can start before the engine change, testing only with bundled textures (`assets/images/...`). Project textures need step 1.

## Open questions

1. Engine delivery: publish `3.0.4` or `npm link` during development?
2. Should "None" mean `null` or the default white texture? (Depends on what the lit shader does with an unbound sampler.)
3. Is there a project texture to test with? If not, I upload one through the Asset Explorer.
