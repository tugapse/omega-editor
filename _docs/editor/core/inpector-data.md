## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| InspectorMapData | editor/core/inpector-data |

This component defines the `InspectorMapData` class, which serves as a structured container for metadata related to inspecting or configuring an object within the editor environment. Its primary responsibility is to hold configuration details such as which keys should be ignored (`blckedKeys`), the specific class type being inspected (`targetClassName`), and a list of properties that require inspection, along with their corresponding inspection types.

This class functions as a core data model within the editor's inspection system. It acts as a configuration payload that dictates how the inspector panel should render and behave when viewing an instance of a specific class. It is integral to the data flow between the editor's runtime object model and its presentation layer, potentially interacting with components like [InspectorService](/editor/core/inspector-service.md) to drive UI rendering.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| InspectorMapData | Class | Holds configuration data for object inspection, including blocked keys, target class name, and property definitions. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class is a simple data structure holding arrays and strings to define inspection metadata. It initializes with empty arrays and strings.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
None.