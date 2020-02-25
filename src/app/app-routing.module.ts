import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then(m => m.LoginPageModule)
  },
  {
    path: "service-profile",
    loadChildren: () =>
      import("./pages/service-profile/service-profile.module").then(
        m => m.ServiceProfilePageModule
      )
  },
  {
    path: 'private-message',
    loadChildren: () => import('./pages/private-message/private-message.module').then( m => m.PrivateMessagePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
