import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  public cart: Cart = { items: [], totalPrice: 0 };

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    const cartId = this.getCartIdFromLocalStorage();
    if (!cartId) return;

    this.cartService.getCart(cartId).subscribe(
      (response) => {
        this.cart = response.cart;
      },
      (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    );
  }

  getCartIdFromLocalStorage(): string {
    const userData = localStorage.getItem('authUser');
    if (userData) {
      const user = JSON.parse(userData);
      return user.cartID || '';
    }
    return '';
  }

  processPayment() {
    // Lógica para procesar el pago
    console.log('Procesando pago...');
    alert('¡Pago procesado con éxito!');
    this.router.navigate(['/home']);
  }
}
