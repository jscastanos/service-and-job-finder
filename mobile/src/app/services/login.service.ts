import { Injectable } from "@angular/core";
import { EnvService } from "./env-service.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(private env: EnvService, private http: HttpClient) {}

  verify(username, password) {
    return this.http.get(
      this.env.API_URL + "verify?username=" + username + "&password=" + password
    );
  }

  userInfo(id) {
    return this.http.get(this.env.API_URL + "user?id=" + id);
  }
}
