import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class EnvService {
  constructor() {}

  API_URL = "http://servicefinder-001-site1.etempurl.com/api/";
  URL = "http://servicefinder-001-site1.etempurl.com/";

  // API_URL = "http://localhost:70/api/";
  //  URL = "http://localhost:70";
}
