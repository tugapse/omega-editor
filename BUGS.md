# Known bugs

Bugs found while working on the editor that are **not fixed yet**. Remove an entry when it is fixed (the fix commit is the record).

Severity: **High** blocks a workflow · **Medium** wrong behaviour with a workaround · **Low** cosmetic or noise.

## Editor

| # | Severity | Area | Bug | Where |
| :-- | :-- | :-- | :-- | :-- |
| E1 | Medium | Runtime | A project with no compiled scripts has no `bundle.js`. Opening the editor requests it, gets a 404 and logs `CRITICAL: Dynamic runtime execution injection fault`. A missing bundle should be treated as "no user scripts". | `src/editor/services/editor.service.ts` `reloadEngineRuntime`, `src/app/services/omega-engine.service.ts` |
| E2 | Medium | Security | The JWT is sent in the bundle URL (`…/code/bundle?token=…`), so it ends up in server logs and browser history. | same as E1, `omega-api-cs` `AssetCodeController` |
| E3 | Medium | UI | After an entity is selected, the floating Inspector opens over the scene tree and covers its "+" button. You must close the Inspector to add another entity. | `editor-inpector` layout |
| E4 | Low | Scene tree | Drag and drop finds nodes by `name`, not `id`. Two entities with the same name get mixed up. | `src/editor/components/scene-tree/scene-tree.ts` `handleNodeDropped` / `findNodeAndParent` |
| E5 | Low | Scene tree | `onSceneUpdated` is subscribed twice in the `SceneTree` constructor, so the tree rebuilds twice per update. | `scene-tree.ts` constructor |
| E6 | Low | Scene | A new, empty scene has no light, so every lit mesh added to it renders black. | scene creation |
| E7 | Low | Audio | Every scene initialisation runs `AudioEngineDiagnostics.runDiagnosticSuite()`, and Chrome warns "AudioContext was not allowed to start" (no user gesture). | `src/app/app.ts` `initializeScene` |
| E8 | Low | Rendering | Console noise on scene load: "uniform1i: location is not from the associated program" (×20+, then "too many errors"), "glGenerateMipmap: zero-size texture", "Mesh data has no UVs". | engine / shaders |
| E9 | Low | Home | Project details: "Last Modified" is empty, and the "active" status is shown as a full-width grey bar. | `src/app/components/project-details` |
| E10 | Low | Register | The disabled "Sign Up" button has no background and looks like plain text. | `src/app/components/register/register.scss` |
| E11 | Low | Boot | Every page load logs one 404 near the .NET WebAssembly runtime start (file not identified yet). | `index.html` / WASM loader |
| E12 | Low | Tooling | `npm run run-dev` starts the old Python `omega-api`, which was replaced by `omega-api-cs`. | `package.json` |
| E13 | Low | Config | `APISettings.apiHost` in `src/editor/configs/editor.ts` hard-codes `http://localhost:5000/api/` next to `environment.apiUrl`. | `src/editor/configs/editor.ts` |
| E14 | Medium | Inspector | Clicking the chevron of the "Shader" panel inside MeshRendererBehaviour does not expand it (also with a real mouse click), so the material and its texture slots cannot be reached. | `inpector-toggle-panel` inside `shader-inspector` / `behaviour-inspector` |
| E15 | Low | Debug | Leftover `debugger;` statements: `AssetService.listAssets`, `TextureInspector.onTextureEnumChange`, `Editor.handleEngineReloaded` catch. They pause the app whenever DevTools is open. | `src/app/api/services/asset.service.ts`, `src/editor/inspectors/texture-inspector/texture-inspector.ts`, `src/editor/editor.ts` |
| E16 | High | Setup | The editor now needs the engine from `omega-engine` branch `feature/uri-resolver` (`EngineCache.setUriResolver`). It is linked locally with `npm install --no-save ../omega-engine`; `package.json` still says `omega-game-engine@^3.0.3`, so a fresh `npm install` breaks the build until a new engine version is published. | `package.json` |

## Omega API (`omega-api-cs`)

| # | Severity | Bug | Where |
| :-- | :-- | :-- | :-- |
| A1 | High | The default storage root (`./storage`) differs from the code service's (`./storage/projects`). Without the same `OMEGA_PROJECTS_STORAGE_ROOT` in both, scripts land outside the project folder. | `Services/PathResolveService.cs` |
| A2 | Low | The code-service URL `http://localhost:3000/api` is hard-coded in three places instead of coming from configuration. | `Services/AssetCodeService.cs`, `Services/OmegaCompilerService.cs`, `Services/OmegaScritpService.cs`, `Controllers/AssetCodeController.cs` |
| A3 | Low | Uploading with `virtual_path` set to a folder (e.g. `Textures`) fails with a misleading "Access to the path … is denied". It expects the full file path (`Textures/wood.jpg`). | `Services/AssetsService.cs` `UploadAssetAsync` |

## Omega Code Service

| # | Severity | Bug | Where |
| :-- | :-- | :-- | :-- |
| C1 | High | It expects `node_modules/omega-game-engine/dist/omega-game-engine.d.ts`, which `omega-game-engine@3.0.3` does not ship (it has `dist/index.d.ts`). `…/code/engine-typings` fails and compilation has no engine types. `compiler.ts` hard-codes the path and ignores `OMEGA_ENGINE_TYPINGS_PATH`. | `src/index.ts`, `src/compiler.ts` |
| C2 | Low | The README is out of date: routes are now `/api/compiler/:userUuid/projects/:projectUuid/...`, and `npm run dev` does not exist. | `README.md` |

## Engine (`omega-game-engine`)

| # | Severity | Bug | Where |
| :-- | :-- | :-- | :-- |
| G1 | Low | `PlanePrimitive` is not registered in `DependencyManager.registerDependencies()`, unlike the other primitives. | `managers/dependency-manager` |
| G2 | Medium | `SceneManager.loadScene` does not restore the parent/child hierarchy: the saved `transform.parent` uuid is never linked because `prepareTransforms` is not called. **Worked around in the editor** by `src/editor/scene/scene-loader.ts`; remove that wrapper once the engine calls `prepareTransforms` after instantiating the objects. | `managers/scene-manager` `instaciateSceneObjects` |

