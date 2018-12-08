import { Component, OnInit, ViewChild } from '@angular/core';
import { Player } from '../player';
import { ActivatedRoute, Router } from '@angular/router';
import { MafiaDbService } from '../mafia-db.service';
import { VotingComponent } from '../voting/voting.component';
import { VoteType } from '../vote-type'

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
  @ViewChild(VotingComponent) voting : VotingComponent;

  constructor(route : ActivatedRoute, dbService : MafiaDbService, router : Router) { 
    this.route = route;
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    dbService.GetPlayerByRoom(this.roomCode, this.route.snapshot.paramMap.get('userPlayer'), (player) => {
      this.userPlayer = player;
    });
    dbService.GetAllPlayersInRoom(this.roomCode, (players) => {
      this.players = players;
    });
  }

  ngOnInit() {
    this.voting.populateBallot(this.players, this.userPlayer, VoteType.UNASSIGNED); // TODO: Remove line after testing.
  }

}
