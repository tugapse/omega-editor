## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EngineLogger | engine/logger.md |

This component provides a centralized, singleton logging mechanism for the application. Its primary responsibility is to capture, format, and store various levels of operational messagessuch as debug, info, and errorensuring that logs are consistently recorded throughout the system's lifecycle. It manages an internal buffer to prevent unbounded memory growth by automatically discarding the oldest entries when the maximum log limit is reached.

EngineLogger functions as a core utility service within the application architecture. By implementing the Singleton pattern, it guarantees a single point of truth for logging operations across all modules. It interfaces directly with the console for immediate output while persisting structured data internally, allowing other components to retrieve historical logs via the [getLogs](/engine/logger.md) method.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| log | Static Method | Logs a general message. Accepts optional parameters which can be serialized or processed as errors/stacks. |
| debug | Static Method | Logs a debug-level message. Accepts optional parameters which can be serialized or processed as errors/stacks. |
| error | Static Method | Logs an error-level message. Accepts optional parameters which can be serialized or processed as errors/stacks. |
| getLogs | Static Method | Returns the current array of stored log entries. |
| clear | Static Method | Resets the internal log buffer to an empty state. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The logger uses a private static instance to enforce the Singleton pattern. When logging, it processes optional parameters: if an argument is an `Error`, it extracts the message and sanitizes the stack trace; if it's a string containing "at ", it sanitizes it as a stack trace; otherwise, it stringifies objects or converts primitives to strings. All processed entries are pushed to the internal `logs` array, which is capped at `maxLogs` by shifting the oldest entry if the limit is exceeded.

- **Side Effects:** Mutates internal state (the `logs` array) and interacts with the standard console output (`console.log`, `console.debug`, `console.error`).

- **Error Handling:** Errors passed as parameters are captured, and their stack traces are sanitized using `sanitizeStack` before being stored.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None