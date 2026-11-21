# Omega engine demo

A static page that runs the engine in the browser: the Showcase scene plus two
Mixamo characters (binary FBX, ASCII FBX and a COLLADA clip), served by GitHub
Pages from `docs/demo/`.

- `index.html`: the page (canvas and controls).
- `main.js`: the demo, using only the engine's public API.
- `omega-engine.js`: the engine bundled as one ES module.
- `assets/scene/showcase.scene`: the Showcase template scene (textures in `assets/Textures/`).
- `assets/models/`: the characters and animations.

## Rebuild the engine bundle

After changing the engine, from `omega-editor/`:

```sh
(cd ../omega-engine && npm run build)
../omega-code-service/node_modules/.bin/esbuild ../omega-engine/dist/index.js \
  --bundle --format=esm --minify --keep-names --target=es2020 \
  --outfile=docs/demo/omega-engine.js
```

## Run it locally

Modules and model files need a web server, not `file://`:

```sh
cd docs/demo && python3 -m http.server 8766
```

Then open http://localhost:8766/.

`npm run build-docs` (typedoc) writes into `docs/` too; it runs with
`--cleanOutputDir false` so it does not delete this folder.
