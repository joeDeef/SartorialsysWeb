import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  selectedSection: string = 'miCuenta';
  user = { 
    id: '67a01e595d1b36c80c89d729',  // El ID del usuario que probablemente obtienes al hacer login
    name: 'Juan',
    last_name: 'Pérez',
    email: 'juan.perez@example.com'
  };
  orders: Order[] = [];  // Asegúrate de que orders sea siempre un array vacío por defecto
  selectedOrder: any = null;  // Inicializa como null

  constructor(private orderService: OrderService, private authService:AuthService) {}

  ngOnInit(): void {
    // Obtener la información del usuario logueado
    this.user = this.authService.getUser();  // Usamos el método getUser() de AuthService

    // Si el usuario está autenticado, obtener los pedidos
    if (this.user && this.user.id) {
      this.orderService.getOrders(this.user.id).subscribe(response => {
        this.orders = response.orders;  // Asignamos los pedidos a la variable 'orders'
      });
    }
  }

  selectSection(section: string): void {
    this.selectedSection = section;
  }

  // Al hacer clic en "Ver Detalles", se selecciona el pedido y se muestra el modal
  viewOrderDetails(order: any): void {
    this.selectedOrder = order;
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.selectedOrder = null;  // Resetea la variable para cerrar el modal
  }
}
