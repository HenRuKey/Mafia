import { Role } from './role'
import { PlayerJSON } from './playerJSON';

export class Player {
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

    constructor(name : string, roomCode : string) {
        //this._service = service;
        this.name = name;
        this.roomCode = roomCode;
        this.role = Role.UNASSIGNED;
        this.isAlive = true;
    }

    toJSON() : PlayerJSON {
        return Object.assign({}, this, {
            name: this.name,
            role: this.role,
            isAlive: this.isAlive,
            roomCode: this.roomCode
        });
    }
}