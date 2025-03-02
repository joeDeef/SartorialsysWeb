import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersPanelComponent } from './components/users-panel/users-panel.component';
import { UserManageComponent } from './components/user-manage/user-manage.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/add-product/add-product.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },

  //Autenticación
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  
  //Administración
  { path: 'admin-panel', component: AdminPanelComponent },
        //Usuarios
  { path: 'admin-panel/users', component: UsersPanelComponent },
  { path: 'admin-panel/user-manage/:id', component: UserManageComponent },
  { path: 'admin-panel/add-user', component: AddUserComponent },
        //Productos
  { path: 'admin-panel/products', component: ProductsComponent },
  { path: 'admin-panel/products/add-product', component: AddProductComponent },

  //Productos
  { path: 'products/:category', component: ProductsComponent },
  { path: 'products', component: ProductsComponent },
  
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
