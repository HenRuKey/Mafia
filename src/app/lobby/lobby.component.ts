import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  private route : ActivatedRoute;
  private roomCode : string;
  private players : string[]; // TODO: Create player class to store name and info in.


  /**
   * A lobby to identify present players and begin the game.
   */
  constructor(route : ActivatedRoute) {
    this.route = route;
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    this.getPlayers();
  }

  ngOnInit() {
    // TODO: Add name entry section before allowing access to complete lobby
    // TODO: If the user is the room creator, give more controls (like a start game button)
  }

  /**
   * Performs a query fetching a list of players that match the instance's roomCode.
   */
  getPlayers() {
    this.players = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"]; // TODO: Pull names of players from database.
  }

  /**
   * Adds the player to the lobby.
   * @param name the player's name
   */
  joinLobby(name : string) {
    if (this.isValidName(name)) {
      $(".error").css("visibility", "hidden"); // Hides the error message if visible
      
    }
    else {
      $(".error").css("visibility", "visible");
    }
  }

  /**
   * Validates a name.
   * @param name the name to validate
   * @returns true if the name is valid
   */
  isValidName(name : string) : boolean {
    return true; // TODO: Add name verification logic
  }

}