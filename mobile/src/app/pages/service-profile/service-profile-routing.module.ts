import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ServiceProfilePage } from "./service-profile.page";

const routes: Routes = [
  {
    path: "",
    component: ServiceProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceProfilePageRoutingModule {}
