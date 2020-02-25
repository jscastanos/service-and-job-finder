import { Injectable } from "@angular/core";

import { SignalR } from "ng2-signalr";

@Injectable({
  providedIn: "root"
})
export class SignalRService {
  connection;
  constructor(private _signalR: SignalR) {}

  register(id) {
    this._signalR.connect().then(con => {
      this.connection = con;
      this.connection.invoke("register", id);
    });
  }
}
