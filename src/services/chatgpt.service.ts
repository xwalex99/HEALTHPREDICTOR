import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../config/api.config';
import { AuthService } from './auth.service';

export interface ChatGptRequest {
  message: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatGptUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ChatGptResponse {
  response: string;
  model: string;
  usage?: ChatGptUsage;
}

@Injectable({
  providedIn: 'root'
})
export class ChatGptService {
  private readonly baseUrl = API_URL;
  private readonly endpoint = `${this.baseUrl}/chatgpt/chat`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  sendMessage(request: ChatGptRequest): Observable<ChatGptResponse> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError(() => new Error('No hay token de autenticación. Por favor, inicia sesión.'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Valores por defecto si no se proporcionan
    const payload: ChatGptRequest = {
      message: request.message,
      model: request.model || 'gpt-3.5-turbo',
      temperature: request.temperature !== undefined ? request.temperature : 0.7,
      ...(request.maxTokens && { maxTokens: request.maxTokens })
    };

    return this.http.post<ChatGptResponse>(this.endpoint, payload, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.status === 401) {
      errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      // Opcional: limpiar la sesión y redirigir al login
      this.authService.logout();
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Error en la petición. Verifica que el mensaje no esté vacío.';
    } else if (error.status === 0) {
      errorMessage = 'Error de conexión. Verifica que el servidor esté disponible.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}

