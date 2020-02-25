import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { LoginService } from "src/app/services/login.service";
import { set } from "../../services/storage.service";
import { Router } from "@angular/router";
import { SignalRService } from "src/app/services/signal-r.service";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private signalR: SignalRService
  ) {}

  ngOnInit() {}

  verify(data: NgForm) {
    let login = this.loginService
      .verify(data.value["username"], data.value["password"])
      .subscribe(e => {
        if (e != "null") {
          set("user", e);
          data.resetForm();

          this.signalR.register(e);

          this.router.navigateByUrl("/home/tab1");
        } else {
          alert("Login failed: Username or password might me wrong");
        }
      });
  }
}
