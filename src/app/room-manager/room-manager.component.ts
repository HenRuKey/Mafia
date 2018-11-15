import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  styleUrls: ['./room-manager.component.css']
})
export class RoomManagerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /**
   * Initializes a room with a unique four-letter key.
   */
  createRoom() {

  }

  /**
   * Gives an additional prompt for a user to enter the room code.
   */
  showRoomCodePrompt() {
    $("#room_entry").css("visibility", "visible");
  }

}
