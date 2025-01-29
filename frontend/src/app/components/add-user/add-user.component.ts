import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.services';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  user: User = {
    name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'user'
  };

  constructor(private userService: UserService) {}

  onSubmit() {
    this.userService.addUser(this.user).subscribe({
      next: (response) => {
        console.log('Usuario agregado:', response.user);
        alert('Usuario agregado con éxito');
      },
      error: (error) => {
        console.error('Error al agregar usuario:', error);
        alert('Hubo un error al agregar el usuario');
      }
    });
  }
}