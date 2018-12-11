import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MafiaDbService } from '../mafia-db.service';
import { Player } from '../player';
import { CookieService } from 'ngx-cookie-service';
import { BootstrapOptions } from '@angular/core/src/application_ref';
import { Role } from '../role';
import { Phases } from '../phases';

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

  private mafiaCount: number;
  private citizenCount: number;
  private detectiveCount: number;

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
    if(!this.cookies.check("cookieLoader")){
      location.reload();
    } else {
      $(".name-prompt").css("display", "block");
    }
    if(this.cookies.check("playerHostId")){
      $(".start").css("display", "block");
    }
    this.skipNameEntry(joinedRoomCookie)
  }

  /**
   * Performs a query fetching a list of players that match the instance's roomCode.
   */
  getPlayers() {
    this.dbService.GetAllPlayersInRoom(this.roomCode, (players) => {
      this.players = [];
      for (let player of players) {
        var newPlayer = new Player("temp", this.roomCode);
        newPlayer.fromJSON(player)
        this.players.push(newPlayer);
      }
    });
    console.log(this.players);
  }


  /**
   * Adds the player to the lobby.
   * @param name the player's name
   */
  joinLobby(name: string) {
    if (this.isValidName(name)) {
      $(".error").css("visibility", "hidden"); // Hides the error message if visible

      this.userPlayer = new Player(name, this.roomCode, Role.UNASSIGNED);
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
    var playerCount = this.players.length;
    this.mafiaCount = 0;
    this.citizenCount = 0;
    this.detectiveCount = 0;
    this.CalculateRoleRatio(playerCount)
    this.AssignRoles();


    this.dbService.UpdateRoomPhase({ roomCode: this.roomCode, phase: Phases.NIGHT, lastUsed: Date.now() }, result => {
      console.log(result);
    })
    clearInterval(this.loopId)
    this.router.navigate(['/game', this.roomCode, this.userPlayer.Name]);
  }


  CalculateRoleRatio(playerCount) {
    for (let i = 0; i < playerCount; i++) {
      if (this.mafiaCount <= 0) {
        this.mafiaCount++;
        continue;
      }
      if (this.citizenCount <= 0) {
        this.citizenCount++
        continue;
      }
      if (this.detectiveCount <= 0) {
        this.detectiveCount++;
        continue;
      }
      if (playerCount > 15 && this.detectiveCount < 2) {
        this.detectiveCount++
        continue;
      }
      if (this.mafiaCount < (this.citizenCount / 3)){
        this.mafiaCount++
      } else {
        this.citizenCount++
      }
    }
  }


  AssignRoles() {
    this.players.forEach(player => {
      player.Role = this.RandomPlayerRole();
      console.log(player.Role);
      this.dbService.UpdatePlayer(player, result => {
        console.log(result)
      })
    });
  }

  RandomPlayerRole() {
    var bool = true
    var result;
    while (bool) {
      var randomRole = Math.floor(Math.random() * 3) + 1;
      if (randomRole == Role.MAFIA && this.mafiaCount > 0) {
        result = Role.MAFIA;
        this.mafiaCount--;
        bool = false;
      } else if (randomRole == Role.CITIZEN && this.citizenCount > 0) {
        result = Role.CITIZEN;
        this.citizenCount--;
        bool = false;
      } else if (randomRole == Role.DETECTIVE && this.detectiveCount > 0) {
        result = Role.DETECTIVE;
        this.detectiveCount--;
        bool = false;
      }
    }
    return result;
  }




  private refreshLoop = () => {
    this.dbService.GetRoomMessages(this.roomCode, messageEntries => {
      this.messages = messageEntries.filter(message => {
          if (message.role != undefined) {
            if (this.userPlayer != undefined) {
              if (message.playerId != undefined) {
                return message.role == this.userPlayer.Role && message.playerId == this.userPlayer.Id;
              } else {
                return message.role == this.userPlayer.Role;
              }
            } else {
              return false;
            }
          } else if (message.playerId != undefined) {
            if (this.userPlayer != undefined) {
              return message.playerId == this.userPlayer.Id;
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
        //(message.role == undefined && message.playerId == undefined) ||
        //(this.userPlayer != undefined && (message.role == this.userPlayer.Role || message.playerId == this.userPlayer.id))
      );
      this.messages.sort((entry1, entry2) => entry1.timestamp - entry2.timestamp);
    });
    this.getPlayers();
    this.dbService.CheckRoomByID(this.roomCode, result => {
      if (result["phase"] != Phases.PREGAME) {
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
