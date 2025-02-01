import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Asegúrate de importar ActivatedRoute
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.services';

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

  passwordFieldType = 'password';

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

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
