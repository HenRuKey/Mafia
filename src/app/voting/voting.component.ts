import { Component, OnInit } from '@angular/core';
import { Player } from '../player';
import { VoteType } from "../vote-type";

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {

  constructor() { 
  }

  ngOnInit() {
  }
  
  /**
   * Adds buttons of player names to the view for players to vote on.
   * @param players All players in the room.
   * @param userPlayer The player who is using this instance of the app.
   * @param voteType The type of vote to hold.
   */
  populateBallot(players : Player[], userPlayer : Player, voteType: VoteType) {
    console.log("working");
  }

  /**
   * Converts a vote-type to a prompt to display.
   * @param type The type of the vote.
   * @returns The prompt to display for the given vote-type.
   */
  voteTypeToPrompt(type : VoteType) : string {
    let message : string;
    switch(type) {
      case VoteType.MAFIA: {
        message = "Select a player to kill.";
        break;
      }
      case VoteType.INVESTIGATION: {
        message = "Select a player to investigate.";
        break;
      }
      case VoteType.ACCUSATION: {
        message = "Select a player to accuse.";
        break;
      }
      case VoteType.LYNCH: {
        message = "Guilty or Not Guilty?";
        break;
      }
      default: {
        message = "";
        break;
      }
    }
    return message;
  }

}
