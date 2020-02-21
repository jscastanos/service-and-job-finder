import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { ShowmapComponent } from "./showmap/showmap.component";

@NgModule({
  imports: [IonicModule, CommonModule],
  exports: [ShowmapComponent],
  declarations: [ShowmapComponent]
})
export default class ComponentModule {}
