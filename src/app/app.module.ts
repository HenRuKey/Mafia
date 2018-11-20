import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
  bootstrap: [AppComponent]
})
export class AppModule { }
