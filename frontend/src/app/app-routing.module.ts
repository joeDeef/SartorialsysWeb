import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { AdministationComponent } from './components/administation/administation.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'users', component: HomeComponent },
  { path: 'users/:id', component: HomeComponent },
  { path: 'products/:category/:id', component: ProductDetailComponent },
  { path: 'products/:category', component: ProductsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'administration/products/edit-product/:id', component: EditProductComponent },
  { path: 'administration/products/create-product', component: CreateProductComponent },
  { path: 'administration/products/:id', component: ProductDetailComponent },
  { path: 'administration', component: AdministationComponent },
  { path: 'administration/products', component: ProductsComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
