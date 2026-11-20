## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EngineStatsComponent | editor/components/engine-stats/engine-stats |

This component is responsible for displaying real-time performance metrics related to the editor's rendering and update cycles. It encapsulates the logic for receiving and presenting detailed statistics, such as FPS, frame time, and various timing measurements, allowing developers or users to monitor the application's performance health.

Architecturally, this component functions as a presentation layer UI component. It consumes the `EngineStats` interface data via an `@Input()` property and exposes a `closeRequested` event via `@Output()` to signal when it should be dismissed by its parent container. It relies on several internal directives and icons for its visual presentation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EngineStats | Interface | Defines the structure for performance metrics, including `fps`, `frameTimeMs`, `updateTimeMs`, `renderTimeMs`, and `browserTimeMs`. |
| EngineStatsComponent | Class | The main component responsible for displaying and managing the engine statistics view. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component is designed to be purely reactive, relying on Angular's change detection strategy set to `OnPush`. It receives the `EngineStats` object via an input binding and emits a `closeRequested` event when triggered.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [CommonModule](/common/common.md) [MovableDirective](/editor/directives/moveable.directive.md) [Icon](/app/components/icon/icon.md)