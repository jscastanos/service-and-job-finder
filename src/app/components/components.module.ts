import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { ShowmapComponent } from "./showmap/showmap.component";
import { RouterModule } from "@angular/router";
import { Autosize } from "../directives/input-autosize.directive";
import { RatingComponent } from "./rating/rating.component";

@NgModule({
  imports: [IonicModule, CommonModule, RouterModule],
  exports: [ShowmapComponent, Autosize, RatingComponent],
  declarations: [ShowmapComponent, Autosize, RatingComponent]
})
export default class ComponentModule {}
