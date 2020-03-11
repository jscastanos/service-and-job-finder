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
export class Tab2Page implements OnInit {
  services;
  userLngLat;
  userId;

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
    get("user").then(e => {
      this.userId = e;
    });

    get("LngLat").then(e => {
      this.userLngLat = e != null ? e : [125.8093, 7.4472];

      this.getGeoData = this.geodataService
        .GetLocalGeoData(this.userLngLat[1], this.userLngLat[0])
        .subscribe(res => {
          this.services = res["features"];

          console.log(this.services);
        });
    });
  }

  navigate(id) {
    let data = {
      id: id,
      userId: this.userId
    };

    let params = {
      queryParams: {
        q: JSON.stringify(data)
      }
    };

    this.nav.navigateForward(["/service-profile"], params);
  }

  ionViewDidLeave() {
    this.getGeoData.unsubscribe();
  }
}
