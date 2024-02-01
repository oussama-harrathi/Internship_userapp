import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SonsTableComponent } from './sons-table/sons-table.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sons-table', component: SonsTableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
