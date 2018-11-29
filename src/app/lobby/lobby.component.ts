import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  private roomCode : string;
  private players : string[]; // TODO: Create player class to store name and info in.

  /**
   * A lobby to identify present players and begin the game.
   */
  constructor(roomCode : string) {
    this.roomCode = roomCode; 
    this.players = ["One", "Two", "Three", "Four"]; // TODO: Pull names of players from database.
  }

  ngOnInit() {

  }

}
