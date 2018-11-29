import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomManagerComponent } from './room-manager/room-manager.component';

const routes: Routes = [
  { path: '', component: RoomManagerComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
