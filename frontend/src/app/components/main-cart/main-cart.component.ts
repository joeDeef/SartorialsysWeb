import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { Global } from 'src/app/services/global.service';

@Component({
  selector: 'app-main-cart',
  templateUrl: './main-cart.component.html',
  styleUrls: ['./main-cart.component.css'],
})
export class MainCartComponent implements OnInit {
  public cart: Cart = { items: [], totalPrice: 0 };
  public cartId: string = '';

  constructor(private _CartService: CartService, private _Router: Router) {}

  ngOnInit(): void {
    this.cartId = this.getCartIdFromLocalStorage();
    this.loadCart();
  }

  getCartIdFromLocalStorage(): string {
    const userData = localStorage.getItem('authUser');
    if (userData) {
      const user = JSON.parse(userData);
      return user.cartID || '';
    }
    return '';
  }

  loadCart() {
    if (!this.cartId) return;

    this._CartService.getCart(this.cartId).subscribe(
      (response) => {
        this.cart = response.cart;
      },
      (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    );
  }

  updateQuantity(productCode: string, quantity: number) {
    if (quantity < 1) return;

    this._CartService
      .updateQuantity(this.cartId, productCode, quantity)
      .subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Error al actualizar la cantidad:', err),
      });
  }

  removeFromCart(productCode: string) {
    this._CartService.removeFromCart(this.cartId, productCode).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error al eliminar el producto:', err),
    });
  }

  goToCheckout() {
    this._Router.navigate(['/checkout'], { queryParams: { cartId: this.cartId } });
  }
 
}
