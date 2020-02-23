import { Injectable } from "@angular/core";
import { EnvService } from "./env-service.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class GeoDataService {
  constructor(private env: EnvService, private http: HttpClient) {}

  GetLocalGeoData(lat, long) {
    return this.http.get(
      this.env.API_URL + "geocode/geojson?latFrom=" + lat + "&longFrom=" + long
    );
  }
}
