import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { ShowmapComponent } from "./showmap/showmap.component";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [IonicModule, CommonModule, RouterModule],
  exports: [ShowmapComponent],
  declarations: [ShowmapComponent]
})
export default class ComponentModule {}
