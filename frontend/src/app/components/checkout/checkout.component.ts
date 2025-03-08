import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  public cart: Cart = { items: [], totalPrice: 0 };
  private cartId: string = '';

  constructor(private cartService: CartService, private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartId = this.getCartIdFromLocalStorage();
    if (!this.cartId) return;

    this.cartService.getCart(this.cartId).subscribe(
      (response) => {
        this.cart = response.data;
      },
      (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    );
  }

  getCartIdFromLocalStorage(): string {
    const userData = localStorage.getItem('authUser');
    if (!userData) {
      return '';
    } 
    return JSON.parse(userData).cartID;
  }

  processPayment() {  
    // Obtener los valores del formulario
    const fullName = (document.getElementById('name') as HTMLInputElement).value;
    const address = (document.getElementById('address') as HTMLInputElement).value;
    const city = (document.getElementById('city') as HTMLInputElement).value;
    const postalCode = (document.getElementById('zip') as HTMLInputElement).value;
    const cardName = (document.getElementById('card-name') as HTMLInputElement).value;
    const cardNumber = (document.getElementById('card-number') as HTMLInputElement).value;
    const expirationDate = (document.getElementById('expiry') as HTMLInputElement).value;
    const cvv = (document.getElementById('cvv') as HTMLInputElement).value;
  
    // Obtener el ID del carrito directamente desde this.cart (o de la respuesta del backend)
    const cartId = this.cartId || '';  // Asegúrate de que el cartId está disponible
  
    // Estructurar la información del pedido
    const order = {
      status: 'Pendiente',  // Puedes cambiar este valor según la lógica del negocio
      shippingInfo: {
        fullName: fullName,
        address: address,
        city: city,
        postalCode: postalCode,
      },
      paymentInfo: {
        cardName: cardName,
        cardNumber: cardNumber,
        expirationDate: expirationDate,
        cvv: cvv,
      },
      cartId: cartId,  // Enviar el cartId con el pedido
    };

    this.orderService.processOrder(this.cartId,order).subscribe(
      (response) => {
        alert('¡Pago procesado con éxito!');
        this.router.navigate(['/home']);
      },
      (error) => {
        alert('Hubo un error al procesar el pago. Inténtalo nuevamente.');
      }
    );
  }  
}
