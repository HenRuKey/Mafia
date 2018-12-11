import { Component, OnInit, ViewChild } from '@angular/core';
import { Player } from '../player';
import { ActivatedRoute, Router } from '@angular/router';
import { MafiaDbService } from '../mafia-db.service';
import { VotingComponent } from '../voting/voting.component';
import { VoteType } from '../vote-type'
import { CookieService } from 'ngx-cookie-service';
import { promise } from 'protractor';
import { Role } from '../role';
import { Vote } from '../vote';
import { Phases } from '../phases';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.css']
})
export class MainGameComponent implements OnInit {

  private userPlayer: Player;
  private roomCode: string;
  private route: ActivatedRoute;
  private players: Player[];
  private dbService: MafiaDbService;
  private cookies: CookieService;
  private role;
  @ViewChild(VotingComponent) voting: VotingComponent;

  constructor(route: ActivatedRoute, dbService: MafiaDbService, router: Router, cookies: CookieService) {
    this.route = route;
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    this.dbService = dbService;
    this.cookies = cookies;
  }

  ngOnInit() {
    let name: string = this.route.snapshot.paramMap.get('userPlayer');
    let playerArray: Player[] = [];
    this.dbService.GetPlayerByRoom(this.roomCode, name, (player) => {
      this.userPlayer = new Player("temp", this.roomCode);
      this.userPlayer.fromJSON(player);
      this.role = Role[this.userPlayer.Role]
      this.dbService.GetAllPlayersInRoom(this.roomCode, (players) => {
        players.forEach(element => {
          let player = new Player("temp", this.roomCode);
          player.fromJSON(element)
          playerArray.push(player);
        });
        this.players = playerArray;
        this.voting.populateBallot(this.players, this.userPlayer, VoteType.UNASSIGNED, this.submitVote); // TODO: Remove line after testing.
      });
    });
  }

  /**
   * Submits a vote against a given player.
   * @param playerName The name of the player to vote against.
   */
  submitVote = (playerName : string) => {
    this.dbService.GetPlayerByRoom(this.roomCode, playerName, (selectedPlayer) => {
      this.dbService.CheckRoomByID(this.roomCode, (room) => {
        this.dbService.AddVote(new Vote(`${ this.roomCode }${ room['phase'] }`, VoteType.MAFIA, this.userPlayer, selectedPlayer), () => {
          this.dbService.AddMessage({
            "text": `You have voted against ${ selectedPlayer.Name }.`,
            "roomCode": this.roomCode,
            "timestamp": Date.now(),
            "playerId": this.userPlayer.Id
          }, () => {});
        }, this.cookies.check('playerId'));
      });
    });
  }

}
