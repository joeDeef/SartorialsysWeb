import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Global } from '../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${Global.url}/users/login`;
  private tokenKey = 'authToken';
  private userKey = 'authUser';

  constructor(private http: HttpClient) {}

  // Enviar las credenciales al backend y recibir la respuesta
  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.saveToken(response.token);
          this.saveUser(response.user);
        }
      })
    );
  }

  // Guardar el token en localStorage
  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Guardar la información del usuario en localStorage
  saveUser(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Obtener la información del usuario desde localStorage
  getUser(): any {
    return JSON.parse(localStorage.getItem(this.userKey) || '{}');
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);  // Eliminar la información del usuario
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
