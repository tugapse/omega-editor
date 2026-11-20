# Omega Editor

<p align="center">
  <a href="readme-assets/image.png" target="_blank">
    <img src="readme-assets/image.png" alt="Omega Editor Day Scene" width="400">
  </a>
  <a href="readme-assets/image1.png" target="_blank">
    <img src="readme-assets/image1.png" alt="Omega Editor Night Scene" width="400">
  </a>
</p>

**Omega Editor** is a web-based 2D/3D game engine and editor built with Angular and WebGL.

This is an ongoing personal project rather than a commercial product. I built it as a practical sandbox to apply and consolidate years of learning in Angular architecture, game systems design, and low-level engine development. While it is very much a work in progress, it already features a robust rendering pipeline supporting custom shaders, complex materials, dynamic lighting, and shadows. Beyond rendering, the editor provides deep visibility into the engine's state, allowing for live inspection of entities, components, and underlying engine code directly through the UI.

## 🌌 The Omega Ecosystem

The editor is one of four pieces. To use it locally you need **three processes running**: the editor, the API and the code service.

| Piece | Repository | Stack | Default port | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Omega Editor** (this repo) | [`tugapse/omega-editor`](https://github.com/tugapse/omega-editor) | Angular 20 | `4200` | UI, inspectors, scene management, Monaco code editor |
| **Omega API** | [`tugapse/omega-api-cs`](https://github.com/tugapse/omega-api-cs) | ASP.NET Core 8, EF Core (SQLite/PostgreSQL), JWT | `5000` | Gateway: auth, users, projects, assets; proxies code requests to the code service |
| **Omega Code Service** | [`tugapse/omega-code-service`](https://github.com/tugapse/omega-code-service) | Node.js, Express 5, esbuild, TypeScript API | `3000` | User script workspaces: file I/O, compile to `bundle.js`, emit `.d.ts` typings |
| **Omega Engine** | npm [`omega-game-engine`](https://www.npmjs.com/package/omega-game-engine) | TypeScript, WebGL | – | Rendering and ECS core; a dependency of both the editor and the code service |

> The older Python [`omega-api`](https://github.com/tugapse/omega-api) backend has been replaced by `omega-api-cs`.

### How the pieces talk

```
Browser ──► Omega Editor (:4200)
               │  HTTP + JWT (Authorization: Bearer …)
               ▼
            Omega API (:5000)  ── SQLite  Data/database.db
               │  /api/projects/{id}/code/*  →  forwarded with the user's id
               ▼
            Omega Code Service (:3000)
               │
               ▼
     shared storage root:  {OMEGA_PROJECTS_STORAGE_ROOT}/{userId}/projects/{projectId}/
                              ├── src/    user TypeScript (main.ts, behaviours…)
                              └── dist/   bundle.js, main.d.ts
```

* The editor **only ever talks to the API**. It never calls the code service directly.
* The API writes project and asset folders to the storage root. The code service reads and writes the same folders for scripts and builds. Both default to `~/omega-storage`; see [Shared storage](#3-shared-storage).

## ✨ Key Features

* **Entity-Component-System (ECS) and live inspection:** granular control over entities through a modular behaviour system. The editor lets you inspect and change entities, their components and raw engine code in real time.
* **WebGL2 rendering:** a forward pipeline with an off-screen scene target, HDR and tone mapping, a post-effect stack, custom shaders and materials, ambient/directional/point/spot lights and real-time shadows for directional, spot and point lights (one shadow atlas).
* **Custom user logic and scripting:** user TypeScript is edited in Monaco, compiled server-side by the code service and run live in the engine. The day/night cycle in the screenshots (with configurable moon phases and shadow transitions) is one example of a custom behaviour.
* **Editor tooling:**
  * Interactive 3D transform gizmos (translate, rotate, scale).
  * Real-time performance profiling (FPS, Update, Render and Idle ms).
  * Projects created from templates: **Empty** or **Sample** (a scene with lights, primitives and textures). User files live in the project, never in the editor.
  * Scene tree with an add menu (empty object, cube, sphere, plane, quad, cylinder, torus) and drag-and-drop parenting and ordering.
  * Inspector docked on the right, with Unity-style texture slots (pick from the project or drop from the Asset Explorer; empty slots show magenta).
  * Integrated asset and project management.
  * UI theming (e.g. "Autumn Rust" and "Default").

---

## 🚀 Getting Started

> **⚠️ WIP:** there is no unified start script yet. Start the three services by hand, in the order below.

### Prerequisites

| Tool | Version | Needed by |
| :--- | :--- | :--- |
| Node.js + npm | 18+ (developed on 26) | editor, code service |
| .NET SDK | 8.0+, with the **ASP.NET Core 8 runtime** (the project targets `net8.0`) | API |
| Angular CLI | 20 (optional: `npx ng` works too) | editor |

### 1. Clone the three repositories side by side

```bash
mkdir omega && cd omega
git clone https://github.com/tugapse/omega-api-cs.git
git clone https://github.com/tugapse/omega-code-service.git
git clone https://github.com/tugapse/omega-editor.git
```

### 2. Install dependencies

```bash
(cd omega-code-service && npm install)
(cd omega-editor && npm install)          # also pulls omega-game-engine
(cd omega-api-cs && dotnet restore)
```

### 3. Shared storage

The API and the code service must read and write the same project folders. Both default to `~/omega-storage`, so nothing is needed for local development. To use another folder, export the same value for both services:

```bash
export OMEGA_PROJECTS_STORAGE_ROOT="$HOME/omega-storage"   # ~ and $HOME are expanded by both
```

The code service also needs the engine's single-file typings, which `omega-game-engine@3.0.3` on npm doesn't have yet: run `npm install --no-save ../omega-engine` in `omega-code-service` (see its README).

### 4. Start the services (one terminal each)

```bash
# Terminal 1: code service on :3000
cd omega-code-service
export OMEGA_PROJECTS_STORAGE_ROOT="$HOME/omega-storage"
./run.sh                    # = npm run start (ts-node src/index.ts)

# Terminal 2: API on :5000
cd omega-api-cs
export OMEGA_PROJECTS_STORAGE_ROOT="$HOME/omega-storage"
./run.sh                    # = dotnet run (profile "http", Development)

# Terminal 3: editor on :4200
cd omega-editor
npm start                   # = ng serve
```

Open `http://localhost:4200/`, register a user, log in and create a project. The editor reloads on source changes.

### 5. Check that everything is up

```bash
curl http://localhost:5000/api/health                      # API
curl -I http://localhost:3000/api/compiler/engine-typings  # code service
```

In Development mode, the API also serves Swagger UI at `http://localhost:5000/swagger`.

---

## ⚙️ Configuration reference

### Omega Editor

| Where | Setting | Default |
| :--- | :--- | :--- |
| `src/environment.ts` | `apiUrl`: API base URL (the app appends `/api`) | `http://localhost:5000` |

### Omega API (`omega-api-cs`)

| Where | Setting | Default |
| :--- | :--- | :--- |
| `Properties/launchSettings.json` | Listen URL (profile `http`) | `http://localhost:5000` |
| `appsettings.json` → `DatabaseProvider` | `SQLite` or `PostgreSQL` | `SQLite` |
| `appsettings.json` → `ConnectionStrings` | SQLite file / PostgreSQL connection | `Data/database.db` (created on first run) |
| `appsettings.json` → `JwtSettings` | `SecretKey`, `Issuer`, `Audience`, `ExpirationMinutes` | dev key, 7 days. **Change `SecretKey` outside local dev.** |
| env `OMEGA_PROJECTS_STORAGE_ROOT` | Storage root | `~/omega-storage` |
| `appsettings.json` → `CodeService:BaseUrl` | Code service URL | `http://localhost:3000/api` |

### Omega Code Service

| Env variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Listen port (update the API's `CodeService:BaseUrl` to match) | `3000` |
| `OMEGA_PROJECTS_STORAGE_ROOT` | Storage root (must match the API) | `~/omega-storage` |
| `OMEGA_ENGINE_TYPINGS_PATH` | Single-file engine typings | `dist/omega-game-engine.d.ts` of the installed engine |

---

## 🛰️ API surface used by the editor

All routes are on the API (`:5000`). All except auth and health need `Authorization: Bearer <jwt>`.

| Area | Routes |
| :--- | :--- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` |
| Health | `GET /api/health` |
| User | `GET`/`PATCH /api/users/me`, `GET`/`PUT /api/users/me/preferences` |
| Projects | `GET`/`POST /api/projects` (optional `template`), `GET`/`PATCH`/`DELETE /api/projects/{id}`, `GET /api/project-templates` |
| Assets | `GET`/`POST /api/projects/{id}/assets`, `GET`/`PATCH`/`DELETE …/assets/{assetId}`, `GET`/`PUT …/assets/{assetId}/text` |
| Code (proxied to the code service) | `GET …/code/tree`, `GET`/`POST`/`PUT`/`DELETE …/code/files`, `GET …/code/engine-typings`, `GET …/code/workspace-typings`, `POST …/code/compile`, `GET …/code/bundle` |

---

## ⚠️ Known issues

The full, current list is in the bugs sheet (see `BUGS.md`).

---

## 🛠 Development commands (editor)

| Command | What it does |
| :--- | :--- |
| `npm start` | Dev server on `:4200` |
| `npm run build` | Production build into `dist/` |
| `npm run watch` | Development build in watch mode |
| `npm test` | Unit tests (Karma + Jasmine) |
| `npm run build-docs` | TypeDoc API docs into `docs/` |

`AgentDocs/` holds per-file architecture notes, written for AI agents and newcomers.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 20.1.3. Run `ng generate component <name>` to scaffold (also `directive`, `pipe`, `service`, `class`, `guard`, `interface`, `enum`, `module`). See the [Angular CLI reference](https://angular.dev/tools/cli).
