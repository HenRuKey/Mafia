import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MafiaDbService } from '../mafia-db.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  private route : ActivatedRoute;
  private roomCode : string;
  private players : string[]; // TODO: Create player class to store name and info in.
  private loopId;
  private messages;
  private dbService : MafiaDbService;

  /**
   * A lobby to identify present players and begin the game.
   */
  constructor(route : ActivatedRoute, dbService : MafiaDbService) {
    this.route = route;
    this.dbService = dbService;
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    this.players = ["One", "Two", "Three", "Four"]; // TODO: Pull names of players from database.
  }

  ngOnInit() {
    this.refreshLoop();
    this.loopId = setInterval(this.refreshLoop, 4000);
  }

  private refreshLoop = () => {
    this.dbService.UpdateRoom(this.roomCode, messageEntries => {
      this.messages = messageEntries;
      this.messages.sort((entry1, entry2) => entry1.timestamp - entry2.timestamp);
    });
  }
}
