import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    title: 'Logo',
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    title: 'Login',
    path: 'login',
    loadChildren: () =>
      import('./components/Login/login.module').then((m) => m.LoginModule),
  },
  {
    title: 'Producto Detallado',
    path: 'products-details/:id',
    loadChildren: () =>
      import(
        './components/products/products-details/products-details.module'
      ).then((m) => m.ProductsDetailsModule),
  },
  {
    title: 'Seguimiento Pedido',
    path: 'follow-order/:id',
    loadChildren: () =>
      import('./components/order/follow-order/follow-order.module').then(
        (m) => m.FollowOrderModule
      ),
  },
  {
    title: 'Panel Administrador',
    path: 'admin-list',
    loadChildren: () =>
      import('./components/admin/admin-list/admin-list.module').then(
        (m) => m.AdminListModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
