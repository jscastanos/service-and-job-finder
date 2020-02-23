import { Component, OnInit } from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import { get, remove } from "../../services/storage.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page implements OnInit {
  data;

  constructor(
    private alertController: AlertController,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    get("user").then(e => {
      this.data = this.loginService.userInfo(e).subscribe(res => {
        this.data = res;
        this.data["Birthdate"] = res["Birthdate"].split("T")[0];
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
