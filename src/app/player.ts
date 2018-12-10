import { Role } from './role'
import { PlayerJSON } from './playerJSON';

export class Player {
    private id : string;
    private name : string;
    private roomCode : string;
    private role : Role;
    private isAlive : boolean;

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

    set Id(id : string) {
        this.id = id;
    }
    

    constructor(name : string, roomCode : string, role = Role.UNASSIGNED) {
        //this._service = service;
        this.name = name;
        this.roomCode = roomCode;
        this.role = role;
        this.isAlive = true;
    }

    toJSON() : PlayerJSON {
        return Object.assign({}, this, {
            name: this.Name,
            role: this.Role,
            isAlive: this.IsAlive,
            roomCode: this.RoomCode
        });
    }

    fromJSON(player: PlayerJSON){
        this.name = player.name,
        this.role = player.role,
        this.isAlive = player.isAlive,
        this.roomCode = player.roomCode
    }
}