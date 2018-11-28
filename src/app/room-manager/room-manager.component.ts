import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import {MafiaDbService} from '../mafia-db.service';

@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  styleUrls: ['./room-manager.component.css']
})


export class RoomManagerComponent implements OnInit {

  tests = [];
  constructor(private service: MafiaDbService) {
    this.tests = service.checkRoomByID('ROOM');
  }

  ngOnInit() {
    // Visual events
    $("#left").mouseenter(function() {    // Mouse enters left side
      $(this).addClass("hover-left");
      $("#right").addClass("hover-left");
    });
    $("#left").mouseleave(function() {    // Mouse leaves left side
      $(this).removeClass("hover-left");
      $("#right").removeClass("hover-left");
    });
    $("#right").mouseenter(function() {    // Mouse enters right side
      $(this).addClass("hover-right");
      $("#left").addClass("hover-right");
    });
    $("#right").mouseleave(function() {    // Mouse leaves right side
      $(this).removeClass("hover-right");
      $("#left").removeClass("hover-right");
    });

  }

  /**
   * Initializes a room with a unique four-letter key.
   */
  createRoom() {
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
  joinRoom(roomCode: string) {
    if (this.isValidRoomCode(roomCode)) {
      this.service.checkRoomByID(roomCode)
      $(".error").css("visibility", "hidden");
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
  isValidRoomCode(roomCode: string): boolean {
    roomCode = roomCode.toUpperCase();
    return roomCode.length == 4;
  }

}
