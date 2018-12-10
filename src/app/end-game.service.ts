import { Injectable } from '@angular/core';
import { Player } from './player';
import { Role } from './role';
import { MafiaDbService } from './mafia-db.service';

@Injectable({
  providedIn: 'root'
})
export class EndGameService {

  private service: MafiaDbService;
  private players: Player[]
  private activeTimeout = 300000;
  constructor(dbService: MafiaDbService) {
    this.service = dbService
  }

  KillInactivePlayers(players: Player[]) {
    players.forEach(player => {
      if (Date.now() - player.LastActive > this.activeTimeout) {
        player.IsAlive = false;
      }
    })
  }

  KillSelectedPlayer(player: Player) {
    player.IsAlive = false
  }

  IterateGamePhase(){
    
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
