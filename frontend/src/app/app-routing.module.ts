import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdministationComponent } from './components/administation/administation.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { UsersComponent } from './components/users/users.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { CarritoComponent } from './components/aside-cart/carrito.component';
import { MainCartComponent } from './components/main-cart/main-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AccountComponent } from './components/account/account.component';

const routes: Routes = [
  // Default route
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // General routes
  { path: 'home', component: HomeComponent },
  { path: 'users', component: HomeComponent },
  { path: 'users/:id', component: HomeComponent },
  { path: 'products/:category/:id', component: ProductDetailComponent },
  { path: 'products/:category', component: ProductsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CarritoComponent, outlet: 'modal' },
  { path: 'main-cart', component: MainCartComponent },
  { path: 'checkout', component: CheckoutComponent},

  // Authentication routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'account', component: AccountComponent },

  // Product administration routes
  { path: 'administration', component: AdministationComponent },
  { path: 'administration/products', component: ProductsComponent },
  { path: 'administration/users', component: UsersComponent },
  { path: 'administration/add-user', component: AddUserComponent },
  { path: 'administration/manage-user/:id', component: ManageUserComponent },
  { path: 'administration/products/edit-product/:id', component: EditProductComponent },
  { path: 'administration/products/create-product', component: CreateProductComponent },
  { path: 'administration/products/:id', component: ProductDetailComponent },

  // Catch-all route (same as default)
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
