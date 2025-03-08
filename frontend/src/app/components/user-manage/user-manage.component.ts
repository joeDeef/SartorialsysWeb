import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ValidationService } from 'src/app/services/validation.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
  user: User = {
    name: '',
    last_name: '',
    email: '',
    role: 'user'
  };
  errorMessage: string = '';
  passwordFieldType = 'password';

  constructor(
    private route: ActivatedRoute, 
    private userService: UserService, 
    private router: Router, 
    private validatorService: ValidationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // Obtener el ID de la URL
      this.route.paramMap.subscribe(paramMap => {
        var userId = paramMap.get('id');
  
        if (Object.keys(params).length) {
          // Si hay queryParams, usarlos como datos del usuario
          this.user = { 
            _id: userId || '',
            name: params['name'] || '',
            last_name: params['last_name'] || '',
            email: params['email'] || '',
            role: params['role'] || 'user'
          } as User;
        } else if (userId) {
          // Si no hay queryParams, cargar usuario desde el backend
          this.loadUser(userId);
        }
      });
    });
  }

  // Cargar usuario desde el backend
  private loadUser(userId: string) {
    this.userService.getUserDetails(userId).subscribe({
      next: (response) => {
        this.user = {
          _id: response._id,
          name: response.name,
          last_name: response.last_name,
          email: response.email,
          role: response.role,
          cart: response.cart || undefined  // Solo si existe
        };
      },
      error: (error) => {
        console.error('Error al obtener detalles del usuario:', error);
      }
    });
  }

  // Mostrar u ocultar contraseña
  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  // Actualizar usuario
  updateUser() {
    if (!this.user) return;

    if (!this.user.name || !this.user.last_name || !this.user.email) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (!this.validatorService.validateEmail(this.user.email)) {
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
        this.router.navigate(['/admin-panel/users']);
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
      }
    });
  }

  // Eliminar usuario
  deleteUser() {
    if (!this.user || !this.user._id) {
      console.error('ID de usuario no encontrado');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(this.user._id).subscribe({
        next: () => {
          alert('Usuario eliminado correctamente');
          this.router.navigate(['/admin-panel/users']);
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }
}
