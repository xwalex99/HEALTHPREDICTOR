import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FechaEsPipe } from '../../pipes/fecha-es.pipe';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FechaEsPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = false;
  errorMessage = '';

  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.loadProfile();
  }

  /**
   * Carga el perfil del usuario
   */
  private loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getProfile().pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        }
      }
    });
  }

  /**
   * Maneja errores de la petición
   */
  private handleError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.errorMessage = 'Tu sesión ha expirado o no estás autenticado. Por favor, inicia sesión.';
      this.authService.logout();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.errorMessage = error.error?.message || error.message || 'No se pudo cargar el perfil.';
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  /**
   * Navega a la página de login
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Navega a la página de registro
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
