import { Component, OnInit, OnDestroy } from "@angular/core";
import { EnvService } from "src/app/services/env-service.service";
import { GeoDataService } from "src/app/services/geo-data.service";
import { get, set } from "../../services/storage.service";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit, OnDestroy {
  services;
  userLngLat;

  url;
  //api
  getGeoData;

  constructor(
    private nav: NavController,
    private env: EnvService,
    private geodataService: GeoDataService
  ) {
    this.url = env.URL;
  }

  ngOnInit() {
    get("LngLat").then(e => {
      this.userLngLat = e != null ? e : [125.8093, 7.4472];

      this.getGeoData = this.geodataService
        .GetLocalGeoData(this.userLngLat[0], this.userLngLat[1])
        .subscribe(res => {
          this.services = res["features"];
        });
    });
  }

  navigate(id) {
    this.nav.navigateForward("/service-profile?id=" + id);
  }

  ngOnDestroy() {
    this.getGeoData.unsubscribe();
  }
}
