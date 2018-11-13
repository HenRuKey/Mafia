import { Component } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mafia';
  constructor(private chat: ChatService){}

  ngOnInit(){
    this.chat.messages.subscribe(msg => {
      console.log(msg);
    })
  }

  sendMessage(msg){
    this.chat.sendMsg("Server is running!");
  }
}
