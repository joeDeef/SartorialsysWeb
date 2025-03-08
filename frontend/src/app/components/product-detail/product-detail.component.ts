import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [ProductService, AuthService]
})
export class ProductDetailComponent implements OnInit {
  product: IProduct = {} as IProduct; // Inicializa con un objeto vacío del tipo IProduct
  selectedSize: string = '';
  selectedColor: string = '';
  cantidad: number = 1;
  loading: boolean = false;
  isAdminRoute: boolean = false;
  currentIndex: number = 0;  // Índice de la imagen actual en el carrusel
  cartId: string | null = '';

  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private _cartService: CartService,
    private _authService: AuthService,
    private _router: Router) {
  }
  ngOnInit(): void {
    this.cartId = this.getCartIdFromLocalStorage();

    this._route.params.subscribe({
      next: (params: Params) => {
        this._productService.getProductsByCode(params['id']).subscribe({
          next: (response) => {
            this.product = response.data;
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

  // Método para cambiar la imagen al anterior
  prevImage() {
    if (this.product?.images?.length) {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.product.images.length - 1;  // Si estamos en la primera imagen, volvemos a la última
      }
    }
  }

  // Método para cambiar la imagen a la siguiente
  nextImage() {
    if (this.product?.images?.length) {
      if (this.currentIndex < this.product.images.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;  // Si estamos en la última imagen, volvemos a la primera
      }
    }
  }

  // Método para obtener los colores disponibles según la talla seleccionada
  getAvailableColorsForSize(size: string) {
    const inventory = this.product.inventory.find(item => item.size === size);
    return inventory ? inventory.colors.filter(color => color.available) : [];
  }

  // Método para manejar el cambio de talla
  onSizeChange() {
    this.selectedColor = "";
  }

  addToCart() {
    if (!this.cartId) {
      alert('No se encontró el carrito del usuario. Por favor, inicia sesión.');
      return;
    }
    const selectedProduct = this.getProductSelection();

    this._cartService.addToCart(this.cartId, selectedProduct).subscribe(
      response => {
        alert('Producto agregado al carrito exitosamente');
      },
      error => {
        alert('Error al agregar producto al carrito');
        console.error('Error al añadir producto al carrito:', error);
      }
    );
  }

  incrementar() {
    this.cantidad++;
  }

  decrementar() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  eliminarProducto(code: string) {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmacion) {
      this._productService.deleteProduct(code).subscribe(
        response => {
          if (response === 'Product deleted successfully') {
            alert("Producto eliminado correctamente")
            this._router.navigate(['/admin-panel/products']); // Asegúrate de usar la ruta absoluta
          } else {
            alert("Hubo un error al eliminar el producto")
          }
        },
        error => {
          console.log(<any>error);
        }
      )
    } else {
      console.log('Eliminación cancelada por el usuario');
    }
  }

  isAdmin(): boolean {
    return this._authService.getUser()?.role === "admin";
  }

  completePurchase() {
    this._router.navigate(['/cart-main']);
  }

  getCartIdFromLocalStorage(): string | null {
    const userData = localStorage.getItem('authUser');
    if (userData) {
      const user = JSON.parse(userData);
      return user.cartID || null;
    }
    return null;
  }

  getProductSelection(): any {
    return {
      productCode: this.product.code,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.cantidad
    };
  }
}
