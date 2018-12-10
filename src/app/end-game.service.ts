import { Injectable } from '@angular/core';
import { Player } from './player';
import { Role } from './role';
import { MafiaDbService } from './mafia-db.service';
import { Vote } from './vote';

@Injectable({
  providedIn: 'root'
})
export class EndGameService {

  private service: MafiaDbService;
  private activeTimeout = 300000;
  constructor(dbService: MafiaDbService) {
    this.service = dbService
  }

  KillInactivePlayers(players: Player[]) {
    players.forEach(player => {
      if (Date.now() - player.LastActive > this.activeTimeout) {
        player.IsAlive = false;
        this.service.UpdatePlayer(player,  result => {
          console.log(result);
        })
      }
    })
  }

  CountVotes(votes: Vote[], players: Player[]) : Player{
    var results = [];
    players.forEach(player => {
      var count = votes.filter((vote) => vote.Recipient === player).length
      results.push({playerName: player.Name, voteCount: count})
    });

    var highest = results.reduce((max, v) => v.voteCount > max ? v.voteCount : max, results[0].voteCount);
    var selected = results.find(c => c.voteCount === highest)
    return players.find(p => p.Name == selected.playerName);
    
  }

  KillSelectedPlayer(player: Player) {
    player.IsAlive = false
    this.service.UpdatePlayer(player,  result => {
      console.log(result);
    })
  }

  IterateGamePhase(roomCode){
    this.service.CheckRoomByID(roomCode, result => {
      var phase = result["phase"];
      phase ++ 
      if (phase > 2){
        phase = 1;
      }
      result["phase"] = phase;
      this.service.UpdateRoomPhase({roomCode: roomCode, phase: phase, lastUsed: Date.now()}, result => {
        console.log(result);
      })
    })
  }

  DoesMafiaWin(players: Player[]): boolean {
    var mafiaCount = 0;
    var otherCount = 0;
    players.forEach(player => {
      if (player.Role == 2 && player.IsAlive) {
        mafiaCount++
      } else if (player.Role != 2 && player.IsAlive) {
        otherCount++
      }
    })
    if (mafiaCount > 0 && otherCount <= 0) {
      return true;
    } else {
      return false;
    }
  }

  DoesCitizensWin(players: Player[]) {
    var mafiaCount = 0;
    var otherCount = 0;
    players.forEach(player => {
      if (player.Role == 2 && player.IsAlive) {
        mafiaCount++
      } else if (player.Role != 2 && player.IsAlive) {
        otherCount++
      }
    })
    if (otherCount > 0 && mafiaCount <= 0) {
      return true;
    } else {
      return false;
    }
  }


}
