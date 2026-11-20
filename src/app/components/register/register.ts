import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../api/services/auth.service';
import { CommonModule } from '@angular/common';

/** Username rules; keep in sync with UserCreateDto in omega-api-cs. */
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const PASSWORD_MIN = 6;
export const PASSWORD_MAX = 72;

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly rules = { USERNAME_MIN, USERNAME_MAX, PASSWORD_MIN, PASSWORD_MAX };

  registerForm: FormGroup;
  registerError = signal<string[]>([]);
  registerSuccess = signal<string | null>(null);
  submitting = signal(false);

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(USERNAME_MIN),
        Validators.maxLength(USERNAME_MAX),
        Validators.pattern(USERNAME_PATTERN),
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(PASSWORD_MIN),
        Validators.maxLength(PASSWORD_MAX),
      ]],
    });
  }

  /** True when a field is invalid and the user has already interacted with it. */
  showError(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  register() {
    if (this.registerForm.invalid || this.submitting()) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.registerError.set([]);
    this.submitting.set(true);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.registerSuccess.set('Registration successful! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.registerError.set(this.extractErrors(err));
      },
    });
  }

  /**
   * Turns an API error into readable messages. Handles ASP.NET validation
   * problems ({ errors: { Field: [msg] } }), { detail } / { message } bodies
   * and an unreachable API.
   */
  private extractErrors(err: HttpErrorResponse): string[] {
    if (err.status === 0) {
      return ['Cannot reach the Omega API. Is it running?'];
    }
    const body = err.error;
    if (body?.errors && typeof body.errors === 'object') {
      const messages = Object.values(body.errors).flat().map(String);
      if (messages.length) return messages;
    }
    if (typeof body?.detail === 'string') return [body.detail];
    if (typeof body?.message === 'string') return [body.message];
    if (typeof body?.title === 'string') return [body.title];
    return [`Registration failed (HTTP ${err.status}).`];
  }
}
