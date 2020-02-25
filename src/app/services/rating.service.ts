import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EnvService } from "./env-service.service";

@Injectable({
  providedIn: "root"
})
export class RatingService {
  constructor(private http: HttpClient, private env: EnvService) {}

  getRating(serviceId, userId) {
    return this.http.get(
      this.env.API_URL + "rating/" + serviceId + "?userId=" + userId
    );
  }
  postRating(serviceId, userId, rating) {
    return this.http.post(this.env.API_URL + "rating/add", {
      serviceId: serviceId,
      userId: userId,
      rating: rating
    });
  }
}
