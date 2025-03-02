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
    AddProductComponent
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
