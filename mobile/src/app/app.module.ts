import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy, RouterModule } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { SignalRModule, SignalRConfiguration } from "ng2-signalr";

//signal R
export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = "myHub";
  c.url = "http://servicefinder-001-site1.etempurl.com/signalr";
  c.logging = true;

  c.executeErrorsInZone = true;
  c.executeErrorsInZone = false;
  c.executeStatusChangeInZone = true;
  return c;
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    SignalRModule.forRoot(createConfig),
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
