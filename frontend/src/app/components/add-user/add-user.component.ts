import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.services';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  passwordFieldType: string = 'password';
  errorMessage: string = '';
  user: User = {
    name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'user'
  };

  constructor(private userService: UserService, private router: Router, private validatorService: ValidationService) {}

  onSubmit() {
    if(!this.validatorService.validateEmail(this.user.email)){
      this.errorMessage = 'Ingrese un email válido.';
      return;
    }

    if (this.user.password && !this.validatorService.validatePassword(this.user.password)) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.userService.addUser(this.user).subscribe({
      next: (response) => {        
        alert('Usuario agregado con éxito');
        this.router.navigate(['/administration/users']);  // Cambia '/usuarios' a la ruta deseada
      },
      error: (error) => {
        alert('Hubo un error al agregar el usuario');
      }
    });
  }

  togglePassword() {
    // Alterna entre 'password' y 'text' para mostrar u ocultar la contraseña
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}