## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | OmegaLoggerPanelComponent |
| Source file | problems-panel.ts |

The **OmegaLoggerPanelComponent** serves as a real-time diagnostic interface within the editor, providing users with a visual stream of system logs, errors, and warnings. It acts as a dedicated monitoring station that allows developers to observe the internal state and execution health of the engine during runtime.

**Functional Mission**
The primary responsibility of **OmegaLoggerPanelComponent** is to aggregate, filter, and display log entries retrieved from the central engine logging system. It solves the problem of visibility into background processes by transforming raw log data into an interactive, expandable UI that distinguishes between standard messages and complex stack traces.

**System Context & Integration**
This component functions as a consumer of the [EngineLogger](/AgentDocs/engine/logger.md) service. It operates on a polling mechanism to ensure the UI stays synchronized with the engine's internal state without requiring a direct push-based subscription model. It is designed to be integrated into the editor's layout, likely within a panel or windowing system, providing critical feedback loops for debugging engine-level operations.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `250` (Default: `250`)  The polling interval in milliseconds used to refresh logs from the engine.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `logs` | Property (LogEntry[]) | Local cache of the current log entries retrieved from the engine. |
| `selectedLevel` | Property (string) | The active filter criteria (e.g., "all", "error", "warn") for log visibility. |
| `expandedIndices` | Property (Set<number>) | Tracks which log entries are currently expanded to show stack traces. |
| `refreshLogs()` | Method (private) | Synchronizes the local `logs` array with the data from [EngineLogger](/AgentDocs/engine/logger.md). |
| `filteredLogs` | Getter | Returns a subset of `logs` based on the `selectedLevel` filter. |
| `clearLogs()` | Method (public) | Triggers a global clear in [EngineLogger](/AgentDocs/engine/logger.md) and resets local state. |
| `toggleExpand(index)` | Method (public) | Toggles the expansion state of a specific log entry in the UI. |
| `hasStackTrace(message)` | Method (public) | Determines if a log message contains a stack trace pattern. |
| `getLogSummary(message)` | Method (public) | Extracts the primary message line, stripping the stack trace. |
| `getStackTrace(message)` | Method (public) | Extracts only the stack trace portion of a log message. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. On `ngOnInit`, the component performs an initial call to `refreshLogs()`.
    2. A `setInterval` is established to trigger `refreshLogs()` every 250ms.
- **Data Path**: 
    1. **Input**: `EngineLogger.getLogs()` provides the raw array of `LogEntry`.
    2. **Processing**: `refreshLogs()` compares the length of the new logs against the existing `logs` array. If a change is detected, the local array is updated via spread operator `[...currentLogs]`.
    3. **Output**: The `filteredLogs` getter processes the local array through a filter based on `selectedLevel`, which is then rendered by the template.
- **Conditional Branching**:
    - **Log Filtering**: If `selectedLevel` is `"all"`, the full array is returned; otherwise, a `filter` operation is applied to match the `log.level`.
    - **Stack Trace Detection**: Uses string pattern matching (`\n    at `) to decide whether to split a message into a summary and a stack trace.
    - **Expansion Logic**: Uses a `Set` to perform $O(1)$ lookups and toggles for UI expansion states.

## 5. Resource Dependencies
- **Standard Libraries**: `Set`
- **Internal Modules**: 
    - [EngineLogger](/AgentDocs/engine/logger.md)
- **External Packages**: 
    - `@angular/core`
    - `@angular/common`