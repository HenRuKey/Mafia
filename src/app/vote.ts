import { VoteType } from "./vote-type";
import { Player } from "./player";
import { VoteJSON } from "./voteJSON";

export class Vote {

    private electionId : number;
    private voteType : VoteType;
    private voter : Player;
    private recipient : Player;

    get ElectionId() : number {
        return this.electionId;
    }

    get VoteType() : VoteType {
        return this.VoteType;
    }

    get Voter() : Player {
        return this.voter;
    }

    get Recipient() : Player {
        return this.recipient;
    }

    constructor(electionId : number, voteType : VoteType, voter : Player, recipient : Player) {
        this.electionId = electionId;
        this.voteType = voteType;
        this.voter = voter;
    }

    toJSON() : VoteJSON {
        return Object.assign({}, this, {
            electionId: this.ElectionId,
            voter: this.Voter,
            recipient: this.Recipient,
            voteType: this.VoteType
        });
    }

    fromJSON(vote : VoteJSON) {
        this.electionId = vote.electionId;
        this.voteType = vote.voteType;
        this.voter = vote.voter;
        this.recipient = vote.recipient;
    }

}