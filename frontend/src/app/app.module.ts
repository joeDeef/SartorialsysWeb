import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component'
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OrderDetailModalComponent } from './components/order-detail-modal/order-detail-modal.component';
import { UsersPanelComponent } from './components/users-panel/users-panel.component';
import { UserManageComponent } from './components/user-manage/user-manage.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { AddSizeProductModalComponent } from './components/add-size-product-modal/add-size-product-modal.component';
import { AddColorProductModalComponent } from './components/add-color-product-modal/add-color-product-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductImagesComponent } from './components/product-images/product-images.component';
import { CartModalComponent } from './components/cart-modal/cart-modal.component';
import { CartMainComponent } from './components/cart-main/cart-main.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    AdminPanelComponent,
    ProfileComponent,
    OrderDetailModalComponent,
    UsersPanelComponent,
    UserManageComponent,
    AddUserComponent,
    ProductsComponent,
    AddProductComponent,
    ProductDetailComponent,
    ProductEditComponent,
    AddSizeProductModalComponent,
    AddColorProductModalComponent,
    ProductImagesComponent,
    CartModalComponent,
    CartMainComponent,
    CheckoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
