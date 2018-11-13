import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChatService } from './chat.service';
import { WebsocketserverService } from './websocketserver.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomManagerComponent } from './room-manager/room-manager.component';
import { LobbyComponent } from './lobby/lobby.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomManagerComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ChatService, WebsocketserverService],
  bootstrap: [AppComponent]
})
export class AppModule { }
