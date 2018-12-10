import { Role } from './role'
import { PlayerJSON } from './playerJSON';

export class Player {
    private id : string;
    private name : string;
    private roomCode : string;
    private role : Role;
    private isAlive : boolean;
    private lastActive: number;

    get Name() : string {
        return this.name;
    }

    get RoomCode() : string {
        return this.roomCode
    }

    get Role() : Role {
        return this.role;
    }

    get IsAlive() : boolean {
        return this.isAlive;
    }

    get Id() : string {
        return this.id;
    }

    get LastActive() : number {
        return this.lastActive;
    }

    set IsAlive(isAlive : boolean) {
        this.isAlive = isAlive
    }    

    set Id(id : string) {

        this.id = id;
    }
    

    constructor(name : string, roomCode : string, role = Role.UNASSIGNED) {
        //this._service = service;
        this.name = name;
        this.roomCode = roomCode;
        this.role = role;
        this.isAlive = true;
        this.lastActive = 0;
    }

    toJSON() : PlayerJSON {
        return Object.assign({}, this, {
            name: this.Name,
            role: this.Role,
            isAlive: this.IsAlive,
            roomCode: this.RoomCode,
            lastActive: this.LastActive
        });
    }

    fromJSON(player: PlayerJSON){
        this.name = player.name,
        this.role = player.role,
        this.isAlive = player.isAlive,
        this.roomCode = player.roomCode,
        this.lastActive = player.lastActive
    }
}