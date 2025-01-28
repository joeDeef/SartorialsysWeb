import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { EditarProductComponent } from './components/editar-product/editar-product.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Ruta raíz
  { path: 'home', component: HomeComponent }, // Página de inicio
  { path: 'users', component: HomeComponent }, // Gestión de usuarios
  { path: 'users/:id', component: HomeComponent }, // Detalles de un usuario
  { path: 'products/:category/:id', component: ProductDetailComponent }, // Detalles de un producto
  { path: 'products/:category', component: ProductsComponent }, // Productos por categoría
  { path: 'products', component: ProductsComponent }, // Todos los productos
  { path: 'create-product', component: CreateProductComponent },
  { path: 'edit-product/:id', component: EditarProductComponent },
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: 'home' }, // Ruta comodín
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
