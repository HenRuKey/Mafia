import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomManagerComponent } from './room-manager/room-manager.component';
import { LobbyComponent } from './lobby/lobby.component';

const routes: Routes = [
  { path: '', component: RoomManagerComponent, pathMatch: 'full' },
  {   path: 'room/:roomCode', component: LobbyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
