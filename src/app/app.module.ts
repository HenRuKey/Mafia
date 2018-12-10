import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomManagerComponent } from './room-manager/room-manager.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { MafiaDbService } from './mafia-db.service';
import { EndGameService } from './end-game.service';
import { MainGameComponent } from './main-game/main-game.component';
import { VotingComponent } from './voting/voting.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    RoomManagerComponent,
    LobbyComponent,
    MessageBoxComponent,
    MainGameComponent,
    VotingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [MafiaDbService, CookieService, EndGameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
