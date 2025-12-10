import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, AuthResponse, LoginPayload } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: LoginPayload = this.form.getRawValue();

    this.authService.login(payload).subscribe({
      next: (res: AuthResponse) => {
        this.authService.setSession(res);
        this.successMessage = res.message || 'Inicio de sesión exitoso.';
        this.isSubmitting = false;
        // Navegar al perfil después de un login exitoso
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ??
          err?.message ??
          'Error al iniciar sesión. Inténtalo de nuevo.';
        this.isSubmitting = false;
      },
    });
  }

}
