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

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'admin-panel/users', component: UsersPanelComponent },
  { path: 'admin-panel/user-manage/:id', component: UserManageComponent },
  { path: 'admin-panel/add-user', component: AddUserComponent },

  { path: 'profile', component: ProfileComponent },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
