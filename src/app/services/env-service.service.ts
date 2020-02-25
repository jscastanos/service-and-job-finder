import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class EnvService {
  constructor() {}

  API_URL = "http://192.168.1.10/appwork/api/";
  URL = "http://192.168.1.10/appwork/";
}
