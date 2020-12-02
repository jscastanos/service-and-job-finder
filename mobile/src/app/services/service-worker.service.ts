import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EnvService } from "./env-service.service";

@Injectable({
  providedIn: "root"
})
export class ServiceWorkerService {
  constructor(private http: HttpClient, private env: EnvService) {}

  getServiceWorker(id) {
    return this.http.get(this.env.API_URL + "serviceworker/" + id);
  }
}
