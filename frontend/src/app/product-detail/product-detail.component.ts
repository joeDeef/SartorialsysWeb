import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IProduct, NewProduct, Product } from '../models/product.model';
import { ApiService } from '../services/api.service';
import { Global } from '../services/global.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [ApiService, CartService]
})
export class ProductDetailComponent implements OnInit {
  isAdminRoute: boolean = false;
  public url: string;
  product: Product;
  public urlImages: string = '';
  loading: boolean = true;
  color: string = '';
  cantidad: number = 1;
  cartId: string | null = '';

  constructor(private _route: ActivatedRoute, private _apiService: ApiService, private _router: Router, private _cartService: CartService) {
    this.url = Global.url;
    this.product = new Product('', '', '', 0, '', '',0, true, '', [], 1);
  }
  ngOnInit(): void {
    this.cartId = this.getCartIdFromLocalStorage();
    // Verifica si la ruta actual contiene "administration"
    this._router.events.subscribe(() => {
      this.isAdminRoute = this._router.url.includes('administration');
    });
    this._route.params.subscribe({
      next: (params: Params) => {
        this._apiService.getProductsByCode(params['id']).subscribe({
          next: (data: Product) => { // Nota que ahora asumimos que data es un array de Product
            this.product = data; // Toma el primer elemento del array
            console.log(this.product); // Imprime el producto completo
            this.urlImages = this.product.images[0];
            console.log(this.urlImages);
            this.loading = false;
          },
          error: (error: any) => {
            console.error(error);
            this.loading = false;
          }
        })
      }
    })
  }

  incrementar() {
    this.cantidad++;
  }
  decrementar() {
    if (this.cantidad > 0) {
      this.cantidad--;
    } else {
      this.cantidad = 0;
    }
  }
  eliminarProducto(code: string) {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmacion) {
      this._apiService.deleteProduct(code).subscribe(
        response => {
          if (response.message === 'Product deleted successfully') {
            console.log('Producto eliminado correctamente');
            this._router.navigate(['/administration/products']); // Asegúrate de usar la ruta absoluta
          } else {
            console.error('Error: Respuesta inesperada del servidor');
          }
        },
        error => {
          console.log(<any>error);
        }
      )
    } else {
      // Si el usuario cancela, no hace nada
      console.log('Eliminación cancelada por el usuario');
    }

  }
  actualizarProducto(code:string) {
  // Redirige al componente EditarProducto pasando el ID del producto
  this._router.navigate(['administration/products/edit-product',this.product.code]);
  }

  getCartIdFromLocalStorage(): string | null {
    const userData = localStorage.getItem('authUser');
    if (userData) {
      const user = JSON.parse(userData);
      return user.cartID || null;
    }
    return null;
  }

  addToCart() {
    if (!this.cartId) {
      alert('No se encontró el carrito del usuario. Por favor, inicia sesión.');
      return;
    }

    const productCode = this.product.code;
    const quantity = this.cantidad;

    this._cartService.addToCart(this.cartId, productCode, quantity).subscribe(
      response => {
        alert('Producto agregado al carrito exitosamente');
      },
      error => {
        alert('Error al agregar producto al carrito');
        console.error('Error al añadir producto al carrito:', error);
      }
    );
  }
}
