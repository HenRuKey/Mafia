import { Component, OnInit, ViewChild } from '@angular/core';
import { Player } from '../player';
import { ActivatedRoute, Router } from '@angular/router';
import { MafiaDbService } from '../mafia-db.service';
import { VotingComponent } from '../voting/voting.component';
import { VoteType } from '../vote-type'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.css']
})
export class MainGameComponent implements OnInit {

  private userPlayer : Player;
  private roomCode : string;
  private route : ActivatedRoute;
  private players : Player[];
  private dbService : MafiaDbService;
  private cookies : CookieService;
  @ViewChild(VotingComponent) voting : VotingComponent;

  constructor(route : ActivatedRoute, dbService : MafiaDbService, router : Router, cookies : CookieService) { 
    this.route = route;
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    this.dbService = dbService;
    this.cookies = cookies;
    this.getUserPlayer(); // Can't use this.userPlayer = this.getUserPlayer because of async.
    console.log("Begin")
    console.log(this.userPlayer);
    this.players = this.getPlayers();
    console.log(this.players);
    console.log("End")
  }

  private getUserPlayer(){
    //let userPlayer : Player; 
    this.userPlayer = new Player("Temp", this.roomCode, 0);
    let name : string = this.route.snapshot.paramMap.get('userPlayer');
    this.dbService.GetPlayerByRoom(this.roomCode, name, (player) => {
      this.userPlayer = player; // Must be set directly inside callback
      console.log(this.userPlayer);
      console.log(this.cookies.getAll());
    });
  }

  private getPlayers() : Player[] {
    let playerArray : Player[] = [];
    this.dbService.GetAllPlayersInRoom(this.roomCode, (players) => {
      players.forEach(element => {
        let player : Player = element as Player;
        playerArray.push(player);
      });
    });
    return playerArray;
  }

  ngOnInit() {
    this.voting.populateBallot(this.players, this.userPlayer, VoteType.UNASSIGNED); // TODO: Remove line after testing.
  }

}
