import { Component, OnInit } from '@angular/core';
import { Global } from 'src/app/services/global.service';
import { Cart } from '../../models/cart.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  providers: [CartService],
})
export class CarritoComponent implements OnInit {
  public isAuthenticated: boolean = false;
  public url: string;
  public cart: Cart = { items: [], totalPrice: 0 };
  public cartId: string = '';
  public productImages: { [key: string]: string } = {};  // Objeto para almacenar las imágenes

  constructor(private _CartService: CartService, private _AuthService: AuthService, private _Router: Router, private _ProductService:ProductService) {
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
    if (userData) {
      const user = JSON.parse(userData);
      return user.cartID || '';
    }
    return '';
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
    this._CartService
      .updateQuantity(this.cartId, productCode, quantity)
      .subscribe(
        (response) => {
          this.loadCart();
        },
        (error) => {
          console.error('Error updating quantity:', error);
        }
      );
  }

  removeFromCart(productCode: string) {
    this._CartService.removeFromCart(this.cartId, productCode).subscribe(
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
      this._Router.navigate(['/main-cart']);
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
