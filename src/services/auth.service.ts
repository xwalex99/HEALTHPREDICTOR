import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { User } from '../models/user.model';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    username: string;
    created_at?: Date | string;
  };
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = API_URL;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private authUserSubject = new BehaviorSubject<User | null>(this.loadStoredUser());
  readonly authUser$ = this.authUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, payload);
  }

  logout(): void {
    this.clearSession();
  }

  setSession(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
    }
    if (response.user) {
      const user = new User(response.user);
      localStorage.setItem(this.USER_KEY, JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
        created_at: user.created_at
      }));
      this.authUserSubject.next(user);
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getStoredUser(): User | null {
    return this.authUserSubject.value;
  }

  private loadStoredUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      return new User(data);
    } catch {
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }
}

