import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MafiaDbService } from '../mafia-db.service';
import { Player } from '../player';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  private route : ActivatedRoute;
  private roomCode : string;
  private players : Player[];
  private userPlayer : Player;
  private loopId;
  private messages;
  private dbService : MafiaDbService;
  private router : Router;

  /**
   * A lobby to identify present players and begin the game.
   */
  constructor(route : ActivatedRoute, dbService : MafiaDbService, router : Router) {
    this.route = route;
    this.dbService = dbService;
    this.router = router;
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    this.getPlayers();
  }

  ngOnInit() {
    this.refreshLoop();
    this.loopId = setInterval(this.refreshLoop, 4000);
  }

  /**
   * Performs a query fetching a list of players that match the instance's roomCode.
   */
  getPlayers() { 
    this.dbService.GetAllPlayersInRoom(this.roomCode, (players) => {
      this.players = [];
      for (let player of players) {
        this.players.push(new Player(player["name"], player["roomCode"]));
      }
    });
    console.log(this.players);
  }

  /**
   * Adds the player to the lobby.
   * @param name the player's name
   */
  joinLobby(name : string) {
    if (this.isValidName(name)) {
      $(".error").css("visibility", "hidden"); // Hides the error message if visible
      
      this.userPlayer = new Player(name, this.roomCode);
      this.dbService.AddPlayerToRoom(this.userPlayer.toJSON(), (result) => {
        this.userPlayer.Id = result["_id"];
      });
      this.dbService.AddMessage({text: `${this.userPlayer.Name} has joined the lobby.`, roomCode: this.roomCode, timestamp: Date.now()}, () => {});
      
      // Hides name prompt and reveals lobby
      $(".name-prompt").css("display", "none");
      $(".lobby").css("display", "block");
    }
    else {
      $(".error").css("visibility", "visible");
    }
    return false; 
  }

  /**
   * Validates a name.
   * @param name the name to validate
   * @returns true if the name is valid
   */
  isValidName(name : string) : boolean {
    return name.length > 0 && name.length < 25;
  }

  /**
   * Redirects the player to the main game component.
   */
  startGame() {
    this.router.navigate(['/game', this.roomCode, this.userPlayer.Name]);
  }

  private refreshLoop = () => {
    this.dbService.UpdateRoom(this.roomCode, messageEntries => {
      this.messages = messageEntries;
      this.messages.sort((entry1, entry2) => entry1.timestamp - entry2.timestamp);
    });
    this.getPlayers();
  }
}
