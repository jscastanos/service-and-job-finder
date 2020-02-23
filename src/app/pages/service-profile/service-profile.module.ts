import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceProfilePageRoutingModule } from './service-profile-routing.module';

import { ServiceProfilePage } from './service-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceProfilePageRoutingModule
  ],
  declarations: [ServiceProfilePage]
})
export class ServiceProfilePageModule {}
