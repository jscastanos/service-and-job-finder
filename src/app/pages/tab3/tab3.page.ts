import { Component, OnInit } from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import { get, remove } from "../../services/storage.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { EnvService } from "src/app/services/env-service.service";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page implements OnInit {
  data;
  userId;
  url;

  constructor(
    private alertController: AlertController,
    private loginService: LoginService,
    private router: Router,
    private env: EnvService
  ) {
    this.url = env.URL;
  }

  ngOnInit() {
    get("user").then(e => {
      this.userId = e;
      this.data = this.loginService.userInfo(e).subscribe(res => {
        this.data = res;
        console.log(this.data);
        if (this.data["Birthdate"] != null) {
          this.data["Birthdate"] = res["Birthdate"].split("T")[0];
        } else {
          this.data["Birthdate"] = "No Birthdate";
        }
      });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: "Do you want to logout?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {}
        },
        {
          text: "Logout",
          handler: () => {
            remove("user").then(e => {
              remove("LngLat").then(l => {
                this.router.navigateByUrl("/login");
              });
            });
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.presentAlertConfirm();
  }
}
