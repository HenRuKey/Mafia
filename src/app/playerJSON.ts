import { Role } from "./role";

export interface PlayerJSON {
    name : string;
    role : Role;
    roomCode : string;
    isAlive : boolean;
}