import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IProduct, Product } from '../models/product.model';
import { ApiService } from '../services/api.service';
import { Global } from '../services/global.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [ApiService]
})
export class ProductDetailComponent implements OnInit {
  public url: string;
  product?: Product;
  public urlImages: string = '';
  loading: boolean = true;
  color: string = '';
  cantidad: number = 1;
  constructor(private _route: ActivatedRoute, private _apiService: ApiService) {
    this.url = Global.url;
  }
  ngOnInit(): void {
    this._route.params.subscribe({
      next: (params: Params) => {
        this._apiService.getProductsByCode(params['id']).subscribe({
          next: (data: Product) => { // Nota que ahora asumimos que data es un array de Product
            this.product = data; // Toma el primer elemento del array
            console.log(this.product); // Imprime el producto completo
            this.urlImages=this.product.images[0];
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

}
