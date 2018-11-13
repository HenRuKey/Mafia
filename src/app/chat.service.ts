import { Injectable } from '@angular/core';
import { WebsocketserverService } from './websocketserver.service';
import { Observable, Subject} from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: Subject<any>;

  constructor(private wsService: WebsocketserverService) { 
    this.messages = <Subject<any>>wsService
    .connect()
    .map((response: any): any =>{
      return response;
    })
  }

  sendMsg(msg){
    this.messages.next(msg);
  }
}
