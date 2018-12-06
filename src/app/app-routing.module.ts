import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomManagerComponent } from './room-manager/room-manager.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MainGameComponent } from './main-game/main-game.component';

const routes: Routes = [
  { path: 'room/:roomCode', component: LobbyComponent },
  { path: 'game/:roomCode/:userPlayer', component: MainGameComponent },
  { path: '', component: RoomManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
