import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { Global } from 'src/app/services/global.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-main-cart',
  templateUrl: './main-cart.component.html',
  styleUrls: ['./main-cart.component.css'],
})
export class MainCartComponent implements OnInit {
  public cart: Cart = { items: [], totalPrice: 0 };
  public cartId: string = '';
  private url = `${Global.url}/products/`;
  public productImages: { [key: string]: string } = {};  // Objeto para almacenar las imágenes

  constructor(private _CartService: CartService, private _Router: Router, private _ProductService: ProductService) {}

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
        this.loadProductImages();  // Carga las imágenes cuando el carrito se carga
      },
      (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    );
  }

    // Método para obtener la primera imagen de cada producto
    loadProductImages() {
      this.cart.items.forEach((item) => {
        this._ProductService.getImages(item.product.code).subscribe(
          (response) => {
            if (response.images && response.images.length > 0) {
              // Asigna la primera imagen al objeto productImages
              this.productImages[item.product.code] = response.images[0];
            }
          },
          (error) => {
            console.error('Error al obtener las imágenes del producto:', error);
          }
        );
      });
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
