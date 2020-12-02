import { Component, OnInit, ViewChild } from "@angular/core";
import { MessageService } from "src/app/services/message.service";
import { NavController, IonContent } from "@ionic/angular";
import { SignalRService } from "src/app/services/signal-r.service";
import { get } from "../../services/storage.service";
import { BroadcastEventListener } from "ng2-signalr";
import { ActivatedRoute } from "@angular/router";
import { EnvService } from "src/app/services/env-service.service";

@Component({
  selector: "app-private-message",
  templateUrl: "./private-message.page.html",
  styleUrls: ["./private-message.page.scss"]
})
export class PrivateMessagePage implements OnInit {
  @ViewChild(IonContent, { static: false }) private content: IonContent;
  incomingMessage = new BroadcastEventListener<void>("newMessage");
  userId;
  serviceId;
  serviceName;
  serviceRecNo;
  connection;
  scrolled = false;
  url;

  sentMessage;

  constructor(
    private nav: NavController,
    private messageService: MessageService,
    private signalR: SignalRService,
    private router: ActivatedRoute,
    private env: EnvService
  ) {
    get("user").then(data => {
      this.userId = data;
      this.url = env.URL;

      this.router.queryParams.subscribe(e => {
        let data = JSON.parse(e.q);

        this.serviceId = data["id"];
        this.serviceName = data["name"];
        this.serviceRecNo = data["recno"];
      });

      this.messageService
        .getMessages(this.userId, this.serviceId)
        .subscribe(res => {
          for (let m in Object.keys(res)) {
            this.messages.push(res[m]);
          }
          console.log(this.messages);
        });
    });
  }

  createMessage = "";

  //api
  postMessage;
  messages = [];

  ngOnInit() {
    this.signalR.connection.listen(this.incomingMessage);
    this.incomingMessage.subscribe(im => {
      this.messages.push(im);

      setTimeout(() => {
        this.content.scrollToBottom();
      }, 500);
    });
  }

  ionViewDidEnter() {
    this.scrollToBottomOnInit();
  }

  scrollToBottomOnInit() {
    this.content.scrollToBottom(300);
  }

  sendMessage(m) {
    this.sentMessage = this.messageService
      .postMessage(this.userId, this.serviceId, m)
      .subscribe(e => {
        this.messages.push(e["message"]);
        setTimeout(() => {
          this.content.scrollToBottom();
        }, 500);
        this.signalR.connection.invoke("newMessage", e["message"]);
      });

    this.createMessage = "";
  }

  navigate() {
    let data = {
      id: this.serviceId,
      userId: this.userId
    };

    let params = {
      queryParams: {
        q: JSON.stringify(data)
      }
    };

    this.nav.navigateForward(["/service-profile"], params);
  }

  ionViewDidLeave() {
    this.sentMessage.unsubscribe();
  }
}
