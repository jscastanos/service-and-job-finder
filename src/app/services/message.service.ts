import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EnvService } from "./env-service.service";

@Injectable({
  providedIn: "root"
})
export class MessageService {
  constructor(private http: HttpClient, private env: EnvService) {}

  postMessage(senderId, RecipientId, Message) {
    return this.http.post(this.env.API_URL + "message/savemessage", {
      SenderId: senderId,
      RecipientId: RecipientId,
      Message: Message
    });
  }

  getMessages(userId, serviceId) {
    return this.http.get(
      this.env.API_URL + "rmessage/" + userId + "?serviceId=" + serviceId
    );
  }
}
