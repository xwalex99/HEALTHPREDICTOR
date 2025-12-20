import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { API_URL } from '../config/api.config';

interface UserApiResponse {
  id: string;
  email: string;
  username: string;
  created_at?: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  /**
   * Obtiene el perfil del usuario autenticado
   * @returns Observable con la instancia de User
   */
  getProfile(): Observable<User> {
    const token = this.authService.getToken();
    
    if (!token) {
      return throwError(() => new Error('No auth token available'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http
      .get<UserApiResponse>(`${API_URL}/auth/profile`, { headers })
      .pipe(map((data) => new User(data)));
  }
}
