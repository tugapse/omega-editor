## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EngineLogger |
| Source file | logger.ts |

The **EngineLogger** is a centralized, singleton-based logging utility designed to capture, format, and store system-level diagnostic information. It provides a unified interface for different logging severities (log, debug, error) while simultaneously mirroring these outputs to the standard system console.

**Functional Mission**
The primary responsibility of **EngineLogger** is to provide a persistent, in-memory audit trail of engine activities. It solves the problem of ephemeral console logs by maintaining a rolling buffer of recent events, allowing the system to retrieve historical diagnostic data for debugging or UI-based error reporting. It specifically handles the sanitization of complex objects and error stacks to ensure that stored logs remain readable and concise.

**System Context & Integration**
As a core utility, **EngineLogger** serves as a diagnostic backbone for the entire engine. It is intended to be consumed by various engine modules to track state transitions and errors. While it currently operates as a standalone utility, its output is critical for downstream components that might need to display system health or error reports, such as the [Problems Panel](/AgentDocs/editor/components/problems-panel/problems-panel.md) or [Engine Stats](/AgentDocs/editor/components/engine-stats/engine-stats.md).

- **INTERNAL REFERENCES**: [EngineLogger](/AgentDocs/engine/logger.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `maxLogs` (Default: `1000`)  Defines the maximum number of log entries to retain in the in-memory array before discarding the oldest entries.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `log` | static method | Records a standard informational message and outputs it to the console. |
| `debug` | static method | Records a debug-level message and outputs it to the console. |
| `error` | static method | Records an error-level message and outputs it to the console. |
| `getLogs` | static method | Returns the current array of stored log objects. |
| `clear` | static method | Flushes the entire in-memory log buffer. |
| `sanitizeStack` | private static method | Cleanses stack traces by removing file paths and URLs within parentheses for cleaner log storage. |
| `store` | private method | Handles the internal transformation, formatting, and rotation of log data. |
| `getInstance` | private static method | Implements the Singleton pattern to ensure a single source of truth for logs. |

## 4. Execution Logic & Flow
- **Initialization**: The class utilizes a private constructor and a `getInstance` method to ensure that only one instance of the `EngineLogger` exists throughout the application lifecycle. The `logs` array is initialized as an empty array.
- **Data Path**: 
    1. **Input**: A severity level, a primary message string, and optional parameters (objects, errors, or strings) are passed to a public static method.
    2. **Processing**: 
        - The `store` method iterates through `optionalParams`.
        - If a parameter is an `Error`, its message and a sanitized stack trace are extracted.
        - If a parameter is a string containing "at ", it is treated as a raw stack and sanitized.
        - Objects are converted to JSON strings; other primitives are cast to strings.
        - The message and formatted parameters are joined into a single string.
    3. **Output**: The formatted log entry is pushed to the `logs` array, and the original message is printed to the `console`.
- **Conditional Branching**:
    - **Log Rotation**: If `this.logs.length` exceeds `maxLogs`, the oldest entry is removed via `shift()`.
    - **Stack Sanitization**: The `sanitizeStack` method uses a Regular Expression (`/\s*\([^)]+\)/g`) to strip parenthetical metadata from stack trace lines.

## 5. Resource Dependencies
- **Standard Libraries**: None
- **Internal Modules**: 
    - No internal modules imported.
- **External Packages**: None