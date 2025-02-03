import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct, Product } from '../../models/product.model';
import { ApiService } from '../../services/api.service';
import { Global } from '../../services/global.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers:[ApiService]
})
export class ProductsComponent implements OnInit {
  currentCategory: string = ''; // Almacena la categoría actual
  public url:string;
  productsList: Product[] = [];
  filteredProducts: Product[] = [];
  isAll: boolean = true;
  isAdminRoute: boolean = false; //para ver si la ruta contine administrarion
  constructor(private _apiService: ApiService, private route: ActivatedRoute, private _router: Router) {
    this.url=Global.url;
   }

  ngOnInit(): void {
     // Verifica si la ruta actual contiene "administration"
     this._router.events.subscribe(() => {
      this.isAdminRoute = this._router.url.includes('administration');
    });
    this.route.paramMap.subscribe(params => {
      this.currentCategory = params.get('category') || '';
      this.isAll = this.currentCategory === ''; 
      this._apiService.getProducts().subscribe((data: IProduct) => {
        this.productsList = data.products;
        this.filterProducts();
      });
    });
  }
  // Filtrar productos según la categoría actual
  filterProducts(): void {
    if (this.isAll) {
      // Mostrar todos los productos
      this.filteredProducts = this.productsList;
    } else {
      // Filtrar por categoría
      this.filteredProducts = this.productsList.filter(
        product => product.category === this.currentCategory
      );
    }
  }
}