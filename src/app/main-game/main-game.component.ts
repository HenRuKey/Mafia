import { Component, OnInit } from '@angular/core';
import { Player } from '../player';
import { ActivatedRoute, Router } from '@angular/router';
import { MafiaDbService } from '../mafia-db.service';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.css']
})
export class MainGameComponent implements OnInit {

  userPlayer : Player;
  private roomCode : string;
  private route : ActivatedRoute;

  constructor(route : ActivatedRoute, dbService : MafiaDbService, router : Router) { 
    this.route = route;
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    dbService.GetPlayerByRoom(this.roomCode, this.route.snapshot.paramMap.get('userPlayer'), (player) => {
      this.userPlayer = player;
    });
  }

  ngOnInit() {
  }

}
