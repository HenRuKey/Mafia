import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomManagerComponent } from './room-manager/room-manager.component';
import { LobbyComponent } from './lobby/lobby.component';

const routes: Routes = [
  { path: 'room/:roomCode', component: LobbyComponent },
  { path: '', component: RoomManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
