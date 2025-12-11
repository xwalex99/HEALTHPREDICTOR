import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService, UserResponse } from '../../services/auth.service';
import { FechaEsPipe } from '../../pipes/fecha-es.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FechaEsPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: UserResponse | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ??
          err?.message ??
          'No se pudo cargar el perfil.';
        this.isLoading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
