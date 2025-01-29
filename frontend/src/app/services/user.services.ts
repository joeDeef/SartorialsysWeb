import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${Global.url}/users`;

  constructor(private http: HttpClient) {}

  // Definir el tipo de la respuesta
  getUsers(): Observable<{ message: string, users: User[] }> {
    return this.http.get<{ message: string, users: User[] }>(this.apiUrl);
  }

  // Obtener detalles de un usuario por ID
  getUserDetails(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  addUser(user: User): Observable<{ message: string; user: User }> {
    return this.http.post<{ message: string; user: User }>(this.apiUrl, user);
  }

  // Actualizar usuario
  updateUser(user: User): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${user._id}`, user);
  }

  // Eliminar usuario
  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${userId}`);
  }
}
