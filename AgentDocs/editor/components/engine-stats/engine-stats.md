## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EngineStatsComponent |
| Source file | engine-stats.ts |

The **EngineStatsComponent** serves as a real-time diagnostic overlay designed to monitor the performance metrics of the underlying engine. It provides visual feedback regarding the execution health of the application, specifically focusing on frame rates and timing distributions.

**Functional Mission**
The primary responsibility of **EngineStatsComponent** is to act as a telemetry display unit. It solves the problem of performance visibility by consuming raw timing data and presenting it in a human-readable format, allowing developers to identify bottlenecks in rendering or logic updates.

**System Context & Integration**
This component functions as a passive consumer of performance data. It receives structured `EngineStats` objects via an `@Input` binding, likely provided by a high-level engine service or a main loop controller. It is designed to be highly performant itself, utilizing `ChangeDetectionStrategy.OnPush` to ensure that the UI only updates when new telemetry data is explicitly pushed into the component, preventing unnecessary re-renders that could skew the very metrics it is measuring. It also integrates with [MovableDirective](/AgentDocs/editor/directives/moveable.directive.md) to allow the user to reposition the overlay within the viewport and utilizes [Icon](/AgentDocs/app/components/icon/icon.md) for visual indicators.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `EngineStats` | Interface | Defines the schema for telemetry data: `fps`, `frameTimeMs`, `updateTimeMs`, `renderTimeMs`, and `browserTimeMs`. |
| `EngineStatsComponent` | Class | The Angular component responsible for rendering the performance statistics overlay. |
| `stats` | @Input | Receives the current `EngineStats` data object for display. |
| `closeRequested` | @Output | Emits a void event when the user triggers a request to dismiss the component. |

## 4. Execution Logic & Flow
- **Initialization**: The component initializes with `stats` set to `null`. It employs `ChangeDetectionStrategy.OnPush` to minimize overhead.
- **Data Path**: 
    1. External Engine/Service calculates timing metrics.
    2. Metrics are passed into the component via the `stats` `@Input`.
    3. Angular's change detection triggers a UI update because the input reference changes.
    4. The template renders the numeric values for FPS and various millisecond timings.
- **Conditional Branching**: 
    - If `stats` is `null`, the template logic (implied) handles the absence of data to prevent runtime errors.
    - User interaction with the close mechanism triggers the `closeRequested` event to notify the parent component to remove the overlay.

## 5. Resource Dependencies
- **Standard Libraries**: `@angular/core`, `@angular/common`
- **Internal Modules**: 
    - [MovableDirective](/AgentDocs/editor/directives/moveable.directive.md)
    - [Icon](/AgentDocs/app/components/icon/icon.md)
- **External Packages**: None identified.