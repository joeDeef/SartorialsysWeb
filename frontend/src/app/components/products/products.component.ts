import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct, Product } from '../../models/product.model';
import { ApiService } from '../../services/api.service';
import { Global } from '../../services/global.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ApiService]
})
export class ProductsComponent implements OnInit {
  currentCategory: string = ''; // Almacena la categoría actual
  public url: string;
  productsList: Product[] = [];
  filteredProducts: Product[] = [];
  isAll: boolean = true;
  isAdminRoute: boolean = false;
  priceFilter: number = 0; // Valor inicial del filtro de precio
  priceCondition: string = 'greater'; // Condición por defecto: Mayor o igual
  filteredProductsMenu: Product[] = [];

  constructor(private _apiService: ApiService, private route: ActivatedRoute, private _router: Router) {
    this.url = Global.url;
  }

  // Método para aplicar el filtro de precio
  applyPriceFilter() {
    // Aplica el filtro de precio según la condición seleccionada
    if (this.priceCondition === 'greater') {
      this.filteredProducts = this.productsList.filter(product => product.price >= this.priceFilter);
    } else {
      this.filteredProducts = this.productsList.filter(product => product.price <= this.priceFilter);
    }

    // Filtra por categoría después de filtrar por precio
    if (!this.isAll) {
      this.filteredProducts = this.filteredProducts.filter(
        product => product.category === this.currentCategory
      );
    }
  }

  ngOnInit(): void {
    // Verifica si la ruta actual contiene "administration"
    this._router.events.subscribe(() => {
      this.isAdminRoute = this._router.url.includes('administration');
    });
    
    this.route.paramMap.subscribe(params => {
      this.currentCategory = params.get('category') || '';
      this.isAll = this.currentCategory === ''; // Si es la ruta de "todos los productos"
      
      // Obtén los productos desde el servicio
      this._apiService.getProducts().subscribe((data: IProduct) => {
        this.productsList = data.products;
        this.applyPriceFilter(); // Aplica los filtros después de obtener los productos
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

    this.applyPriceFilter(); // Aplica también el filtro de precio
  }

  // Método para manejar el cambio en el precio (rango)
  onPriceChange(newPrice: number) {
    this.priceFilter = newPrice;
    this.applyPriceFilter(); // Aplica el filtro de precio cada vez que cambia el rango
  }
}
