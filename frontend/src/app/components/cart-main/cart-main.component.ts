import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart-main',
  templateUrl: './cart-main.component.html',
  styleUrls: ['./cart-main.component.css']
})
export class CartMainComponent implements OnInit {
  public cart: Cart = { items: [], totalPrice: 0 };
  public cartId: string = '';

  constructor(private _CartService: CartService, private _Router: Router, private _ProductService: ProductService) {}

  ngOnInit(): void {
    this.cartId = this.getCartIdFromLocalStorage();
    this.loadCart();
  }

  getCartIdFromLocalStorage(): string {
    const userData = localStorage.getItem('authUser');
    if (!userData) {
      return '';
    } 
    return JSON.parse(userData).cartID;
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

  updateQuantity(item: any, newQuantity: number) {
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

  goToCheckout() {
    this._Router.navigate(['/checkout'], { queryParams: { cartId: this.cartId } });
  }
 
}