## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EngineAssetType | editor/models/asset-types.md |

This component defines a strongly typed enumeration, `EngineAssetType`, which serves as a canonical registry for all distinct types of assets managed within the editor system. Its primary responsibility is to provide a fixed, exhaustive set of identifiers that categorize assets such as textures, materials, scenes, and shaders, ensuring type safety across the application.

This enumeration functions as a core data model within the editor's asset management subsystem. It dictates how the system classifies and handles various resources loaded into the engine, providing a stable contract for components that interact with the asset pipeline, such as the [AssetManager](/editor/models/asset-manager.md) or the [SceneLoader](/editor/loaders/scene-loader.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EngineAssetType | Enum | Defines the set of recognized asset types used throughout the engine. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** None.