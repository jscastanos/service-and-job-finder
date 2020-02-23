import { Component, OnInit } from "@angular/core";
import { ServiceWorkerService } from "src/app/services/service-worker.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-service-profile",
  templateUrl: "./service-profile.page.html",
  styleUrls: ["./service-profile.page.scss"]
})
export class ServiceProfilePage implements OnInit {
  serviceId;
  serviceWorkerData;
  getServiceWorker;

  public scrolling: boolean = false;

  constructor(
    private serviceWorker: ServiceWorkerService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.serviceId = params["id"];
    });
  }

  ngOnInit() {
    this.getServiceWorker = this.serviceWorker
      .getServiceWorker(this.serviceId)
      .subscribe(res => {
        this.serviceWorkerData = res;
        console.log(this.serviceWorkerData);
      });
  }

  segmentChanged(e) {
    console.log(e.detail.value);
  }
}
