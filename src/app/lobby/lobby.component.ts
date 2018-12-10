import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MafiaDbService } from '../mafia-db.service';
import { Player } from '../player';
import { CookieService } from 'ngx-cookie-service';
import { BootstrapOptions } from '@angular/core/src/application_ref';
import { Role } from '../role';
import {Phases} from '../phases';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  private route: ActivatedRoute;
  private roomCode: string;
  private players: Player[];
  private userPlayer: Player;
  private loopId;
  private messages;
  private dbService: MafiaDbService;
  private router: Router;
  private cookies: CookieService;

  /**
   * A lobby to identify present players and begin the game.
   */

  constructor(route: ActivatedRoute, dbService: MafiaDbService, router: Router, cookies: CookieService) {
    this.route = route;
    this.dbService = dbService;
    this.router = router;
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    this.cookies = cookies;
    this.getPlayers();
  }

  ngOnInit() {
    this.refreshLoop();
    this.loopId = setInterval(this.refreshLoop, 4000);
    const joinedRoomCookie: boolean = this.cookies.check("playerId");
    this.skipNameEntry(joinedRoomCookie)
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

  RandomPlayerRole() {
    var randomRole = Math.floor(Math.random() * 3) + 1;
    return randomRole;
  }

  /**
   * Adds the player to the lobby.
   * @param name the player's name
   */
  joinLobby(name: string) {
    if (this.isValidName(name)) {
      $(".error").css("visibility", "hidden"); // Hides the error message if visible

      this.userPlayer = new Player(name, this.roomCode, this.RandomPlayerRole());
      this.dbService.AddPlayerToRoom(this.userPlayer.toJSON(), (result) => {
        this.userPlayer.Id = result["_id"];
        this.cookies.set("playerId", this.userPlayer.Name, 2, "/room/" + this.roomCode);
      });
      this.dbService.AddMessage({ text: `${this.userPlayer.Name} has joined the lobby.`, roomCode: this.roomCode, timestamp: Date.now() }, () => { });

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
  isValidName(name: string): boolean {
    return name.length > 0 && name.length < 25;
  }

  /**
   * Redirects the player to the main game component.
   */
  startGame() {
    this.dbService
    this.router.navigate(['/game', this.roomCode, this.userPlayer.Name]);
  }

  private refreshLoop = () => {
    this.dbService.GetRoomMessages(this.roomCode, messageEntries => {
      this.messages = messageEntries.filter(
          message => message.role == undefined || (this.userPlayer != undefined && message.role == this.userPlayer.role)
      );
      this.messages.sort((entry1, entry2) => entry1.timestamp - entry2.timestamp);
    });
    this.getPlayers();
    this.dbService.CheckRoomByID(this.roomCode, result => {
      if (result["phase"] != Phases.PREGAME){
        this.router.navigate(['/game', this.roomCode, this.userPlayer.Name]);
      }
    })
  }


  private skipNameEntry = (bool: boolean) => {
    if (bool) {
      $(".name-prompt").css("display", "none");
      $(".lobby").css("display", "block");
      this.dbService.GetPlayerByRoom(this.roomCode, this.cookies.get("playerId"), result => {
        this.userPlayer = new Player("placeholder", this.roomCode);
        this.userPlayer.fromJSON(result);
      })
    }
  }
}
