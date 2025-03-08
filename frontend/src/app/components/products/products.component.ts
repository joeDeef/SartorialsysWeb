import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  currentCategory = '';
  productsList: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  priceFilter = 0;
  priceCondition: 'greater' | 'less' = 'greater';
  private unsubscribe$ = new Subject<void>();

  private categoryMap: Record<string, string> = {
    "Accesorio": "Accessory",
    "Camisa": "Shirt",
    "Pantalón": "Pants",
    "Terno": "Suit",
    "Chaqueta": "Jacket"
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$),
      switchMap(params => {
        this.currentCategory = params.get('category') || '';
        const categoryInEnglish = this.categoryMap[this.currentCategory] || this.currentCategory;
        return this.productService.getProducts(categoryInEnglish || undefined);
      })
    ).subscribe(response => {
      this.productsList = response?.data || [];
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  applyFilters(): void {
    this.filteredProducts = this.productsList.filter(product => 
      this.priceCondition === 'greater' ? product.price >= this.priceFilter : product.price <= this.priceFilter
    );
  }

  isAdmin(): boolean {
    return this.authService.getUser()?.role === "admin";
  }
}
