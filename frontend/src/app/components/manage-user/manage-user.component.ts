import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Asegúrate de importar ActivatedRoute
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.services';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  user: User = {
    _id: '',
    name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'user',
    cart: ''
  };
  errorMessage: string = '';
  passwordFieldType = 'password';

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router, private validatorService: ValidationService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.userService.getUserDetails(userId).subscribe({
          next: (response) => {
            this.user = response;
          },
          error: (error) => {
            console.error('Error al obtener detalles del usuario:', error);
          }
        });
      }
    });
  }

  // Método para actualizar la información del usuario
  updateUser() {
    if (!this.user.password) {
      delete this.user.password;
    }

    const fields = [
      { name: 'name', value: this.user.name, label: 'nombre' },
      { name: 'last_name', value: this.user.last_name, label: 'apellido' },
      { name: 'email', value: this.user.email, label: 'email' },
    ];

    // Validar todos los campos
    for (const field of fields) {
      if (!this.validatorService.validateNotEmpty(field.value)) {
        this.errorMessage = `El campo ${field.label} es obligatorio.`;
        return;
      }
    }

    if(!this.validatorService.validateEmail(this.user.email)){
      this.errorMessage = 'Ingrese un email válido.';
      return;
    }

    if (this.user.password && !this.validatorService.validatePassword(this.user.password)) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }  
    this.userService.updateUser(this.user).subscribe({
      next: () => {
        alert('Usuario actualizado correctamente');
        this.router.navigate(['/administration/users']);  // Redirigir después de la actualización
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
      }
    });
  }

  // Método para eliminar el usuario
  deleteUser() {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      if (this.user._id) {  // Verificación de que el ID no sea undefined
        this.userService.deleteUser(this.user._id).subscribe({
          next: () => {
            alert('Usuario eliminado correctamente');
            this.router.navigate(['/administration/users']);  // Redirigir después de eliminar
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
          }
        });
      } else {
        console.error('ID de usuario no encontrado');
      }
    }
  }
}
