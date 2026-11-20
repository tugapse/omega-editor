## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | RegisterComponent |
| Source file | register.ts |

The **RegisterComponent** serves as the user onboarding gateway for the Omega Editor application. It provides a structured interface for new users to create accounts by capturing essential credentials including username, email, and password through a reactive form implementation.

**Functional Mission**
The primary responsibility of the **RegisterComponent** is to facilitate the user registration process. It validates user input locally to ensure data integrity before attempting to persist the new user identity via the authentication service, effectively acting as the entry point for new user lifecycle management.

**System Context & Integration**
This component acts as a consumer of the `AuthService` to communicate with the backend API. Upon successful registration, it manages the application state transition by providing visual feedback via signals and orchestrating a timed navigation to the login view using the `Router`. It is a critical component in the authentication flow, sitting upstream from the `LoginComponent` and protected by the `AuthGuard`.

- **INTERNAL REFERENCES**: [AuthService](/AgentDocs/app/api/services/auth.service.md), [Router](/AgentDocs/app/app.routes.md), [RegisterComponent](/AgentDocs/app/components/register/register.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `2000` (Default: `2000`)  Delay in milliseconds before redirecting to the login page after successful registration.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `registerForm` | FormGroup | Holds and validates the state of the registration input fields (username, email, password). |
| `registerError` | signal<string \| null> | Reactive signal containing error messages returned from the authentication service. |
| `registerSuccess` | signal<string \| null> | Reactive signal containing success messages to be displayed to the user. |
| `register()` | Method | Orchestrates the form submission, service call, and subsequent navigation logic. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Injects `FormBuilder`, `AuthService`, and `Router`.
    - Initializes `registerForm` with `username`, `email` (with email validation), and `password` fields, all marked as required.
    - Sets up empty signals for `registerError` and `registerSuccess`.
- **Data Path**: 
    - **Input**: User enters text into the `registerForm` fields.
    - **Processing**: `register()` checks `registerForm.valid`. If valid, `authService.register()` is called with `this.registerForm.value`.
    - **Output**: On success, `registerSuccess` signal is updated; on error, `registerError` signal is updated with the error message.
- **Conditional Branching**:
    - **Form Validity**: If `registerForm.valid` is false, the registration logic is aborted.
    - **API Success (`next`)**: Updates success signal $\rightarrow$ triggers `setTimeout` $\rightarrow$ navigates to `/login`.
    - **API Error (`error`)**: Extracts `err.error?.message` or defaults to 'Registration failed' $\rightarrow$ updates error signal.

## 5. Resource Dependencies
- **Standard Libraries**: `inject`, `signal` (from `@angular/core`), `FormBuilder`, `FormGroup`, `ReactiveFormsModule`, `Validators` (from `@angular/forms`), `Router`, `RouterModule` (from `@angular/router`), `CommonModule` (from `@angular/common`).
- **Internal Modules**: 
    - [AuthService](/AgentDocs/app/api/services/auth.service.md)
- **External Packages**: `@angular/core`, `@angular/forms`, `@angular/router`, `@angular/common`