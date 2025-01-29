import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  // Método para manejar el registro
  onRegister(): void {
    this.authService.register(this.user).subscribe(
      response => {
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error al crear cuenta', error);
        // Aquí puedes mostrar un mensaje de error al usuario si es necesario
      }
    );
  }
}
