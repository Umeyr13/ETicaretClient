import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardModule } from './admin/components/dashboard/dashboard.module';
import { HomeComponent } from './ui/components/home/home.component';
import { authGuard } from './guards/common/auth.guard';

const routes: Routes = [
  {
    path: "admin", component: LayoutComponent, children: [

      { path: "", loadChildren: () => DashboardModule },

      //https://...com/admin/customers/ dansonra ne geliyorsa bu modülün içinde ara demiş olduk
      {//lazy loading de olmuş oluyor
        path: "customers", loadChildren: () => import("./admin/components/customer/customer.module").then
          (module => module.CustomerModule), canActivate: [authGuard]
      },

      {
        path: "products", loadChildren: () => import("./admin/components/products/products.module").then
          (module => module.ProductsModule), canActivate: [authGuard]
      },

      {
        path: "orders", loadChildren: () => import("./admin/components/order/order.module").then
          (module => module.OrderModule), canActivate: [authGuard]
      }
    ], canActivate: [authGuard]//buraya istek gelince önce bunu çalıştır dedik..       
  },
  { path: "", component: HomeComponent },//Anasayfa çalışması burada belirlendi...
  { path: "basket", loadChildren: () => import("./ui/components/baskets/baskets.module").then(module => module.BasketsModule) },
  { path: "products", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule) },
  { path: "products/:pageNo", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule) },
  { path: "register", loadChildren: () => import("./ui/components/register/register.module").then(module => module.RegisterModule) },
  { path: "login", loadChildren: () => import("./ui/components/login/login.module").then(module => module.LoginModule) },
  { path: "password-reset", loadChildren: () => import("./ui/components/password-reset/password-reset.module").then(module => module.PasswordResetModule) },
  { path: "update-password/:userId/:resetToken", loadChildren: () => import("./ui/components/update-pasword/update-pasword.module").then(module => module.UpdatePaswordModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
