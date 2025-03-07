import { Component, OnInit } from '@angular/core';
import { Global } from 'src/app/services/global.service';
import { Cart } from '../../models/cart.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent implements OnInit {
  public isAuthenticated: boolean = false;
  public url: string;
  public cart: Cart = { items: [], totalPrice: 0 };
  public cartId: string = '';

  constructor(
    private _CartService: CartService,
    private _AuthService: AuthService,
    private _Router: Router,
    private _ProductService: ProductService) {
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.isAuthenticated = this.checkUserAuthentication();
    if (this.isAuthenticated) {
      this.cartId = this.getCartIdFromLocalStorage();
      this.loadCart();
    }
  }

  checkUserAuthentication(): boolean {
    const userData = localStorage.getItem('authUser');
    return userData !== null;
  }

  getCartIdFromLocalStorage(): string {
    const userData = localStorage.getItem('authUser');
    if (!userData) {
      return '';
    } 
    return JSON.parse(userData).cartID;
  }

  cerrarCarrito() {
    this._Router.navigate([{ outlets: { modal: null } }]);
  }

  loadCart() {
    if (!this.cartId) {
      return;
    }

    this._CartService.getCart(this.cartId).subscribe(
      (response) => {
        this.cart = response.data;
      },
      (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    );
  }

  updateQuantityCart(item: any, newQuantity: number) {
    const updatePayload = {
      productCode: item.product.code,
      size: item.size,
      color: item.color,
      newQuantity: newQuantity
    };
  
    this._CartService.updateQuantity(this.cartId, updatePayload).subscribe(
      (response) => {
        this.loadCart();
      },
      (error) => {
        console.error('Error updating quantity:', error);
      }
    );
  }
  
  removeFromCart(item: any) {
    const deletePayload = {
      productCode: item.product.code,
      size: item.size,
      color: item.color,
    };
    this._CartService.removeFromCart(this.cartId, deletePayload).subscribe(
      (response) => {
        this.loadCart();
      },
      (error) => {
        console.error('Error removing product:', error);
      }
    );
  }

  goToMainCart() {
    this._Router.navigate([{ outlets: { modal: null } }]).then(() => {
      this._Router.navigate(['/cart-main']);
    });
  }

  goToCheckout() {
    this._Router.navigate([{ outlets: { modal: null } }]).then(() => {
      this._Router.navigate(['/checkout']);
    });
  }

  goToLogin() {
    this._Router.navigate([{ outlets: { modal: null } }]).then(() => {
      this._Router.navigate(['/login']);
    });
  }
}
