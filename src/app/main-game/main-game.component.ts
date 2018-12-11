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
import { EndGameService } from '../end-game.service';

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
  private role : string;
  private loopId : any;
  private messages : any;
  private logic: EndGameService;
  @ViewChild(VotingComponent) voting: VotingComponent;

  constructor(route: ActivatedRoute, dbService: MafiaDbService, router: Router, cookies: CookieService, endLogic: EndGameService) {
    this.route = route;
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    this.dbService = dbService;
    this.cookies = cookies;
    this.logic = endLogic;
  }

  ngOnInit() {
    this.refreshLoop();
    this.loopId = setInterval(this.refreshLoop, 4000);
    let name : string = this.route.snapshot.paramMap.get('userPlayer');
    let playerArray: Player[] = [];
    this.dbService.GetPlayerByRoom(this.roomCode, name, (player) => {
      this.userPlayer = new Player("temp", this.roomCode);
      this.userPlayer.fromJSON(player);
      this.role = Role[this.userPlayer.Role];
      this.dbService.GetAllPlayersInRoom(this.roomCode, (players) => {
        players.forEach(element => {
          let player : Player = new Player("temp", this.roomCode);
          player.fromJSON(element)
          playerArray.push(player);
        });
        this.players = playerArray;
        this.voting.populateBallot(this.players, this.userPlayer, VoteType.MAFIA, this.submitVote); // TODO: Remove line after testing.
      });
    });
  }


  startNextPhase() {
    let playerArray: Player[] = [];
    let votes: Vote[]
    this.dbService.GetAllPlayersInRoom(this.roomCode, players => {
      players.forEach(element => {
        let player = new Player("temp", this.roomCode);
        player.fromJSON(element)
        playerArray.push(player);
      })
      this.players = playerArray;
      this.dbService.CheckRoomByID(this.roomCode, room => {
        this.dbService.GetVotesByElectionId(`${this.roomCode}${room['phase']}`, result => {
            result.forEach(element => {
              var vote = new Vote("", VoteType.UNASSIGNED, null, null)
              vote.fromJSON(element)
              votes.push(vote)
            });
            this.logic.KillInactivePlayers(this.players);
            if (this.logic.DoesMafiaWin) {
              console.log("Mafia Wins")
              //Mafia Wins-- Do Something
            } else if (this.logic.DoesCitizensWin) {
              console.log("Citizens Win")
              //Citizens Win-- Do Something
            } else {
              var killedPlayer = this.logic.CountVotes(votes, this.players)
              this.logic.KillSelectedPlayer(killedPlayer)
              if (this.logic.DoesMafiaWin) {
                console.log("Mafia Wins")
                //Mafia Wins-- Do Something
              } else if (this.logic.DoesCitizensWin) {
                console.log("Citizens Win")
                //Citizens Win-- Do Something
              }
            }
            this.logic.IterateGamePhase(this.roomCode)
        })

      })

    })
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
  
  private refreshLoop = () => {
    this.dbService.GetRoomMessages(this.roomCode, messageEntries => {
      this.messages = messageEntries.filter(message => {
          if (message.role != undefined) {
            if (this.userPlayer != undefined) {
              if (message.playerId != undefined) {
                return message.role == Role[this.userPlayer.Role] && message.playerId == this.userPlayer.Id;
              } else {
                return message.role == Role[this.userPlayer.Role];
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
      );
      this.messages.sort((entry1, entry2) => entry1.timestamp - entry2.timestamp);
    });
  }

}
