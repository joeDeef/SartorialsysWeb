import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationService } from '../../services/validation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    name: '',
    last_name: '',
    email: '',
    password: ''
  };
  passwordFieldType: string = 'password';
  errorMessage: string = '';

  constructor(
    private userService: UserService, 
    private router: Router,
    private validationService: ValidationService) {}

  // Método para manejar el registro
  onRegister(): void {
    const fields = [
      { name: 'name', value: this.user.name, label: 'nombre' },
      { name: 'last_name', value: this.user.last_name, label: 'apellido' },
      { name: 'email', value: this.user.email, label: 'email' },
      { name: 'password', value: this.user.password, label:'contraseña' }
    ];

    // Validar todos los campos
    for (const field of fields) {
      if (!this.validationService.validateNotEmpty(field.value)) {
        this.errorMessage = `El campo ${field.label} es obligatorio.`;
        return;
      }
    }

    // Validación del email
    if (!this.validationService.validateEmail(this.user.email)) {
      this.errorMessage = 'Ingrese un correo electrónico válido.';
      return;
    }

    // Validación de la contraseña
    if (!this.validationService.validatePassword(this.user.password)) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    // Si todas las validaciones pasan, se hace el registro
    this.userService.register(this.user).subscribe(
      response => {
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error al crear cuenta', error);
        this.errorMessage = 'Hubo un error al crear la cuenta. Intenta de nuevo más tarde.';
      }
    );
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
