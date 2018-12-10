import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Options } from 'selenium-webdriver/opera';
import { Phases } from './phases';
var serv_url = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class MafiaDbService {

  private res: any;
  constructor(private http: HttpClient) { }

  GetAllRooms(callback) {
    this.http.get(serv_url + "/api").subscribe(result => {
      callback(result)
    })
  }

  /**
   * Makes a call to the server to check the database for a specific room
   * @param roomCode the room code that is being looked up
   * @param callback function called after completion
   */
  CheckRoomByID(roomCode, callback) {
    this.http.get<any>(serv_url + '/api/room/' + roomCode).subscribe(result => {
      callback(result);
    })

  }

  /**
   * Makes a call to the server to create a new room
   * @param roomCode the new room code
   * @param CallbackTrue function call if room is created
   * @param CallbackFalse function call if room already exists and creation fails
   */
  CreateRoom(roomCode, CallbackTrue, CallbackFalse) {
    this.http.post(serv_url + '/api/create/' + roomCode, { roomCode: roomCode, phase: Phases.PREGAME}).subscribe(result => {
      if (result) {
        CallbackTrue(result);
      } else {
        CallbackFalse(result);
      }
    })
  }

  /**
   * Makes a call to the server to delete a specific room.
   * NOTE: MANUAL OVERRIDE - The server being called already contains logic to clean up empty rooms.
   * NOTE: Should only be used to delete a room before it is empty. (ie. room host cancels game)
   * 
   * @param roomCode the room code
   * @param callback function call on successful delete
   */
  DeleteRoom(roomCode, callback) {
    this.http.delete(serv_url + '/api/deleteRoom/' + roomCode).subscribe(result => {
      if (result) {
        callback(result)
      };
    });
  };


  UpdateRoomPhase(room, callback) {
    this.http.put(serv_url + '/api/updateRoom/' + room.roomCode, room).subscribe(result => {
      callback(result);
    })
  }

  /**
   * Add's players to a room in the database
   * @param player the player object
   * @param callback function called on completion
   */
  AddPlayerToRoom(player, callback) {
    this.http.post(serv_url + '/api/addPlayer', player).subscribe(result => {
      callback(result);
    });
  };

  /**
   * Searches for a player in a specific room
   * @param roomCode The room to serch in
   * @param name The name of the player
   * @param callback function called on completion
   */
  GetPlayerByRoom(roomCode, name, callback) {
    this.http.get(serv_url + '/api/player', { params: { code: roomCode, name: name } }).subscribe(result => {
      callback(result);
    })
  }


  /**
   * Finds all players in a room
   * @param roomCode the room to search
   * @param callback function called on completion
   */
  GetAllPlayersInRoom(roomCode, callback) {
    this.http.get(serv_url + '/api/allPlayers/' + roomCode).subscribe(result => {
      callback(result)
    })
  }

  /**
   * 
   * @param player Updates a player by their _id
   * @param callback function called on completion
   */
  UpdatePlayer(player, callback, IdCookie = undefined) {
    this.http.put(serv_url + "/api/updatePlayer", player).subscribe(result => {
      callback(result)
    })
    if(IdCookie){
      this.UpdatePlayerActiveTime(IdCookie)
    }
  }

  /**
   * 
   * @param roomCode the room to search in
   * @param role the role to search by
   * @param callback function called on completion
   */
  GetPlayerByRole(roomCode, role, callback) {
    this.http.get(serv_url + "/api/role/", { params: { code: roomCode, role: role } }).subscribe(result => {
      callback(result);
    })
  }



  /**
   * Adds message to database of messages
   * @param message message object
   * @param callback function called on completion
   */
  AddMessage(message, callback) {
    this.http.post(serv_url + '/api/addMessage', message).subscribe(result => {
      callback(result);
    })
  }


  /**
   * Makes a call to the server to get all room messages in a given room
   * @param roomCode the roomCode identifier of the messages
   * @param callback function called on completion
   */
  GetRoomMessages(roomCode, callback) {
    this.http.get(serv_url + '/api/allMessages/' + roomCode).subscribe(result => {
      callback(result)

    })
  }

/**
 * Sends a vote to the database server
 * @param vote a vote JSON object 
 * @param callback function called on completion
 */
  AddVote(vote, callback, IdCookie = undefined) {
    this.http.post(serv_url + '/api/addVote', vote).subscribe(result => {
      callback(result)
    })
        if(IdCookie){
      this.UpdatePlayerActiveTime(IdCookie)
    }
  }


  /**
   * Makes a call to the server to get all votes with the same electionId
   * @param electionId the electionId search parameter
   * @param callback function called on completion
   */
  GetVotesByElectionId(electionId, callback, IdCookie = undefined){
    this.http.get('/api/getVotes/' + electionId).subscribe(result => {
      callback(result);
    })

    if(IdCookie){
      this.UpdatePlayerActiveTime(IdCookie)
    }
  }


  UpdatePlayerActiveTime(IdCookie?){
    this.http.put('/api/updateActiveTime', IdCookie)
  }


}

