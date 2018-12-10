import { Player } from "./player";
import { VoteType } from "./vote-type";

export interface VoteJSON {
    electionId : string;
    voter : Player;
    recipient : Player;
    voteType : VoteType;
}