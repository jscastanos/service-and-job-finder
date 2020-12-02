import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ServiceWorkerService } from "src/app/services/service-worker.service";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { RatingService } from "src/app/services/rating.service";
import { get } from "../../services/storage.service";
import { RatingComponent } from "src/app/components/rating/rating.component";
import { EnvService } from "src/app/services/env-service.service";

@Component({
  selector: "app-service-profile",
  templateUrl: "./service-profile.page.html",
  styleUrls: ["./service-profile.page.scss"]
})
export class ServiceProfilePage implements OnInit {
  @ViewChild(RatingComponent, { static: false })
  _ratingComponent: RatingComponent;

  serviceId;
  serviceWorkerData;
  getServiceWorker;
  userId;
  rateData = {
    userRating: null,
    totalRate: null,
    rateCount: null
  };
  url;

  rateDetails = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  public scrolling: boolean = false;

  constructor(
    private serviceWorker: ServiceWorkerService,
    private route: ActivatedRoute,
    private nav: NavController,
    private ratingService: RatingService,
    private env: EnvService
  ) {
    this.route.queryParams.subscribe(params => {
      let data = JSON.parse(params.q);
      this.url = env.URL;

      this.serviceId = data["id"];
      this.userId = data["userId"];
    });
  }

  ngOnInit() {
    this.getServiceWorker = this.serviceWorker
      .getServiceWorker(this.serviceId)
      .subscribe(res => {
        this.serviceWorkerData = res;

        get("user").then(e => {
          this.userId = e;
          this.computeRating(e);
        });
      });
  }

  computeRating(id) {
    this.ratingService
      .getRating(this.serviceWorkerData.serviceId, id)
      .subscribe(res => {
        this.rateData = {
          userRating: res["userRating"],
          totalRate: res["totalRate"],
          rateCount: res["rateCount"]
        };

        this.aggregateRateCount(res["rateDetails"]);
      });
  }

  aggregateRateCount(rateCountArray) {
    this.rateDetails = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    //count
    for (let index in rateCountArray) {
      this.rateDetails[rateCountArray[index]] += 1;
    }
    //get mean
    this.rateDetails = {
      5: this.rateDetails["5"] / this.rateData.rateCount,
      4: this.rateDetails["4"] / this.rateData.rateCount,
      3: this.rateDetails["3"] / this.rateData.rateCount,
      2: this.rateDetails["2"] / this.rateData.rateCount,
      1: this.rateDetails["1"] / this.rateData.rateCount
    };
  }

  goToMessage() {
    let data = {
      id: this.serviceWorkerData["UserId"],
      name: this.serviceWorkerData["BusinessEntityName"],
      recno: this.serviceWorkerData["recNo"]
    };

    let params = {
      queryParams: {
        q: JSON.stringify(data)
      }
    };

    this.nav.navigateForward(["/private-message"], params);
  }

  rateNow(rating) {
    this.ratingService
      .postRating(this.serviceWorkerData["UserId"], this.userId, rating)
      .subscribe(res => {
        this.rateData.userRating = rating;
        this._ratingComponent.loadRating(this.userId);
        this.computeRating(this.userId);
      });
  }

  ionViewDidLeave() {
    this.getServiceWorker.unsubscribe();
  }
}
