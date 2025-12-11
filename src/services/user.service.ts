import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { API_URL } from '../config/api.config';
import { AuthService, UserResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = API_URL;
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getProfile(): Observable<UserResponse> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('No auth token available'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<UserResponse>(`${this.baseUrl}/auth/profile`, { headers });
  }
}
