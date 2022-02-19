import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AuthGuard } from './guards/auth.guard';
import { AssociationListComponent } from './association-list/association-list.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { AssociationComponent } from './association/association.component';

const routes: Routes = 
[
  {path: 'login', redirectTo:'', pathMatch:"full"},
  {path: '', component: LoginComponent},
  {path: 'home', component:HomeComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersListComponent, canActivate: [AuthGuard]},
  {path: 'users/:id', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'associations/:name', component: AssociationComponent, canActivate: [AuthGuard]},
  {path: 'associations', component: AssociationListComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
