import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class EnvService {
  constructor() {}

  API_URL = "http://localhost/appwork/api/";
  URL = "http://localhost/appwork/";
}
