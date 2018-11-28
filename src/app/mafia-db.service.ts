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
   * @param id the room code that is being looked up
   * @param callback function called after completion
   */
  CheckRoomByID(id, callback) {
    this.http.get<any>('http://localhost:3000/api/' + id, id).subscribe(result => {
      callback(result);
    })
    
  }

  /**
   * Makes a call to the server to create a new room
   * @param id the new room code
   * @param CallbackTrue function call if room is created
   * @param CallbackFalse function call if room already exists and creation fails
   */
  CreateRoom(id, CallbackTrue,  CallbackFalse){
    this.http.post('http://localhost:3000/api/create/' + id, {room_id: id, occupants: 1}).subscribe(result => {
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
   * @param id the room code
   * @param callback function call on successful delete
   */
  DeleteRoom(id, callback){
    this.http.delete("http://localhost:3000/api/deleteRoom/" + id).subscribe(result => {
      if(result){
        callback(result)
      }

    })
  }

  /**
   * Makes a call to the server to update the number of occupants in a given room
   * @param id code of the room to update
   * @param mod int, either positive or negative, tells server how to increment the occupants
   * @param callback function call on completion
   */
  UpdateRoom(id, mod, callback){
    this.http.put("http://localhost:3000/api/update/" + id, {occupants: mod}).subscribe(result =>{
      if(result){
        callback(result)
      }
    })
  }

}

