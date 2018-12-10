export enum VoteType {
    UNASSIGNED,
    MAFIA,              // Night phase: Mafia votes to kill a player.
    INVESTIGATION,      // Night phase: Detectives votes to reveal the alliance of a player.
    ACCUSATION         // Day phase: All players vote on a player to lynch.
}