import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Propiedades relacionadas con el modal y el scroll
  mostrarModal = false;
  lastScrollTop = 0;
  header = document.getElementById('header');

  // Propiedades de usuario
  userName: string = '';
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  cartID: string = '';
  menuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Se ejecuta al cargar el componente - Verificamos si el usuario está autenticado
  ngOnInit(): void {
    this.checkAuthentication();
  }

  // Escucha el evento de scroll de la ventana
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Ocultar el header si se está bajando y se ha desplazado más de 50px
    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      this.header?.classList.add('hidden');
    } 
    // Mostrar el header si se está subiendo o el desplazamiento es menor o igual a 50px
    else if (currentScroll < this.lastScrollTop || currentScroll <= 50) {
      this.header?.classList.remove('hidden');
    }

    // Actualizar la posición del scroll
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  // Método para verificar la autenticación del usuario
  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const user = this.authService.getUser();
      this.userName = user.name ? `${user.name} ${user.last_name}` : '';
      this.isAdmin = user.role === 'admin';  // Verificar si el usuario es admin
      this.cartID = user.cartID;
    }else{
      const user = this.authService.getUser();
      this.userName = '';
      this.isAdmin = false;
      this.cartID = '';
    }
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout();
    this.checkAuthentication();  // Actualizamos el estado después de hacer logout

    this.router.navigate(['/home']); // Asegúrate de que '/perfil' es la ruta correcta
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goToProfile() {
    this.menuOpen = false; // Cierra el menú
    this.router.navigate(['/account']); // Asegúrate de que '/perfil' es la ruta correcta
  }
}