import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {

  // Valida el email con una expresión regular
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    // Comprobamos que la contraseña no esté vacía y que tenga al menos 8 caracteres
    return password != null && password.length >= 6;
  }

  validateNotEmpty(value: string): boolean {
    return value != null && value.trim().length > 0;
  }
}
