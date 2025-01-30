import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  providers: [ApiService]
})
export class EditProductComponent {
  product: Product = new Product('', '', '', 0, '', '', 0, true, '', [], 1);
  loading: boolean = true;
  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _apiService: ApiService) {
  }
  ngOnInit(): void {
    // Obtener el ID del producto desde la URL
    this._route.params.subscribe((params) => {
      const productId = params['id'];
      this._apiService.getProductsByCode(productId).subscribe({
        next: (data: Product) => {
          this.product = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar el producto', error);
          this.loading = false;
        },
      });
    });
  }

  guardarCambios() {
    this._apiService.updateProduct(this.product.code, this.product).subscribe({
      next: (updatedProduct) => {
        console.log('Producto actualizado correctamente:', updatedProduct);
        this._router.navigate(['/administration/products']);
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
      },
    });
  }
}
