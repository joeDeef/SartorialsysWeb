import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductsComponent } from './components/products/products.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdministationComponent } from './components/administation/administation.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { UsersComponent } from './components/users/users.component';

// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';

import { CarritoComponent } from './components/aside-cart/carrito.component';
import { MainCartComponent } from './components/main-cart/main-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AccountComponent } from './components/account/account.component';
import { OrderDetailModalComponent } from './components/order-detail-modal/order-detail-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ProductDetailComponent,
    ProductsComponent,
    CreateProductComponent,
    LoginComponent,
    SignupComponent,
    AdministationComponent,
    EditProductComponent,
    UsersComponent,
    AddUserComponent,
    ManageUserComponent,
    CarritoComponent,
    MainCartComponent,
    CheckoutComponent,
    AccountComponent,
    OrderDetailModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
