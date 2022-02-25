import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsgRevenueComponent } from './isg-revenue/isg-revenue.component';
import { LoginComponent } from './isg-revenue/login/login.component';
import { NewProductComponent } from './isg-revenue/new-product/new-product.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'new',
    component: NewProductComponent,
  },
  {
    path: 'rev',
    component: IsgRevenueComponent,
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
