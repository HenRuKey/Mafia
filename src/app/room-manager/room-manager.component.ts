import { Component, OnInit } from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  styleUrls: ['./room-manager.component.css']
})


export class RoomManagerComponent implements OnInit {
  
  private http: HttpClient;
  constructor() { }

  ngOnInit() {
  }

  /**
   * Initializes a room with a unique four-letter key.
   */
  createRoom($scope,  $http) {
    $scope.test = function(){
      $http.get('/test').success(function(){
        console.log('Success');
      });
    }
    return false;
  }

  /**
   * Gives an additional prompt for a user to enter the room code.
   */
  showRoomCodePrompt() {
    $("#room_entry").css("visibility", "visible");
  }

  /**
   * Attempts to join a specified room.
   * @param roomCode  the room to join
   */
  joinRoom(roomCode : string) {
    if (this.isValidRoomCode(roomCode)) {

    }
    else {
      $(".error").css("visibility", "visible");
    }
    return false;
  }

  /**
   * Validates a roomcode.
   * @param roomCode  the room code to validate
   * @returns         true if the code is valid
   */
  isValidRoomCode(roomCode : string) : boolean {
    roomCode = roomCode.toUpperCase();
    return roomCode.length == 4;
  }

}
