import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  passwordFieldType: string = 'password';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private validationService: ValidationService) {}

  onSubmit() {
    const fields = [
      { name: 'email', value: this.email, label: 'email' },
      { name: 'password', value: this.password, label:'contraseña' }
    ];

    // Validar todos los campos
    for (const field of fields) {
      if (!this.validationService.validateNotEmpty(field.value)) {
        this.errorMessage = `El campo ${field.label} es obligatorio.`;
        return;
      }
    }

    // Validaciones
    if (!this.validationService.validateEmail(this.email)) {
      this.errorMessage = 'Ingrese un email válido.';
      return;
    }
    
    //Loggearse
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']).then(() => {
          location.reload();
        });
      },
      error: (error) => {
        this.errorMessage = 'Error al iniciar sesión. Verifique sus credenciales.';
        console.error(error);
      }
    });
  }  

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}