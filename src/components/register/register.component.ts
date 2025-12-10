import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, AuthResponse, RegisterPayload } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { confirmPassword: _cp, ...rest } = this.form.getRawValue();
    const payload: RegisterPayload = rest;

    this.authService.register(payload).subscribe({
      next: (res: AuthResponse) => {
        this.authService.setSession(res);
        this.successMessage = res.message || 'Registro exitoso.';
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ??
          err?.message ??
          'Error al registrarse. Inténtalo de nuevo.';
        this.isSubmitting = false;
      },
    });
  }

}
