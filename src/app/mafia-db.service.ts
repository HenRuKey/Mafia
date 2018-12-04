import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MafiaDbService {

  private res: any;
  constructor(private http: HttpClient) { }



  /**
   * Makes a call to the server to check the database for a specific room
   * @param roomCode the room code that is being looked up
   * @param callback function called after completion
   */
  CheckRoomByID(roomCode, callback) {
    this.http.get<any>('http://localhost:3000/api/' + roomCode).subscribe(result => {
      callback(result);
    })
    
  }

  /**
   * Makes a call to the server to create a new room
   * @param roomCode the new room code
   * @param CallbackTrue function call if room is created
   * @param CallbackFalse function call if room already exists and creation fails
   */
  CreateRoom(roomCode, CallbackTrue,  CallbackFalse){
    this.http.post('http://localhost:3000/api/create/' + roomCode, {roomCode: roomCode}).subscribe(result => {
      if(result){
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
  DeleteRoom(roomCode, callback){
    this.http.delete("http://localhost:3000/api/deleteRoom/" + roomCode).subscribe(result => {
      if(result){
        callback(result)
      }
    })
  }

  /**
   * Makes a call to the server to update the number of occupants in a given room
   * @param roomCode code of the room to update
   * @param mod int, either positive or negative, tells server how to increment the occupants
   * @param callback function call on completion
   */
  UpdateRoom(roomCode, callback){
    this.http.put("http://localhost:3000/api/allMessages/" + roomCode, null).subscribe(result =>{
      if(result){
        callback(result)
      }
    })
  }

}

