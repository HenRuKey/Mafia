import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { MafiaDbService } from '../mafia-db.service';
import { getRandomString } from 'selenium-webdriver/safari';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  styleUrls: ['./room-manager.component.css']
})

export class RoomManagerComponent implements OnInit {

  /**
   * Temporary test variable used for tracking the room code of a created or joined room.
   * TODO: Move this to whichever component.ts will be handling specific room logic
   */
  private room: string;
  private service: MafiaDbService;
  private router: Router;

  constructor(service: MafiaDbService, router: Router) {
    this.service = service;
    this.router = router;
  }

  ngOnInit() {
    // Visual events
    $("#left").mouseenter(function () {    // Mouse enters left side
      $(this).addClass("hover-left");
      $("#right").addClass("hover-left");
    });
    $("#left").mouseleave(function () {    // Mouse leaves left side
      $(this).removeClass("hover-left");
      $("#right").removeClass("hover-left");
    });
    $("#right").mouseenter(function () {    // Mouse enters right side
      $(this).addClass("hover-right");
      $("#left").addClass("hover-right");
    });
    $("#right").mouseleave(function () {    // Mouse leaves right side
      $(this).removeClass("hover-right");
      $("#left").removeClass("hover-right");
    });
  }

  /**
   * Initializes a room with a unique four-letter key.
   */
  createRoom() {
    var pass = false;
    var code = this.generateRoomCode();
    this.service.CheckRoomByID(code, result => {
      if (result == null) {
        this.service.CreateRoom(code, succeed => {
          this.router.navigate(['/room', code]);
          this.room = code;
          console.log(succeed)
        },
          fail => {
            console.log(fail)
          })

      } else {
        console.log("Room already exists. Creating new one...")
        this.createRoom();
      }
    })
  }

  /**
   * Gives an additional prompt for a user to enter the room code.
   */
  showRoomCodePrompt() {
    $("#room_entry").fadeIn(1000);
  }

  /**
   * Attempts to join a specified room.
   * @param roomCode  the room to join
   */
  joinRoom(roomCode: string) {
    roomCode = roomCode.toUpperCase();
    if (this.isValidRoomCode(roomCode)) {
      $(".error").css("visibility", "hidden");
      this.service.CheckRoomByID(roomCode, result => {
        if (result != null) {
          this.room = roomCode;
          this.router.navigate(['/room', this.room]);
        } else {
          $(".error").text("Room Doesn't Exist")
          $(".error").css("visibility", "visible");
        }
      })
    }
    else {
      $(".error").text("Invalid Room Code")
      $(".error").css("visibility", "visible");
    }
    return false;
  }


  /**
   * Asks the service to delete a room
   * NOTE: MANUAL OVERRIDES ONLY - see mafia-db.service.ts for details.
   * @param roomCode room to delete
   */
  deleteRoom(roomCode: string) {
    if (this.isValidRoomCode(roomCode)) {
      this.service.DeleteRoom(roomCode, result => {
        console.log(result);
      })
    }
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

  /**
   * Generates a random 4 char room code in all caps.
   * @returns the 4 char string
   */
  generateRoomCode(): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < 4; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };




  /**
   * Temporary Method for Data Manipulation and Server Interaction
   * 
   * Expand and Uncomment a section to generate/retrieve test data
   */
  testMethod() {

    //region Get All Rooms
    // this.service.GetAllRooms(result => {
    //   console.log(result);
    // })
    //endregion

    //region Get Single Room
    // this.service.CheckRoomByID("ROOM", result => {
    //   console.log(result);
    // })
    //endregion

    //region Create Room
    // this.service.CreateRoom("TEST", success => {
    //   console.log(success);
    // }, result => {
    //   console.log(result);
    // });
    //endregion

    //region Delete Room
    // this.service.DeleteRoom("TEST", result => {
    //   console.log(result);
    // })
    //endregion

    //region Add Player
    // var player = {
    //   name: "TEST_NAME",
    //   roomCode: "ROOM",
    //   role: null
    // }
    // this.service.AddPlayerToRoom(player, result => {
    //   console.log(result);
    // })
    //endregion

    //region Find a Player in Room
    // this.service.GetPlayerByRoom("ROOM", "Bryan", result => {
    //   console.log(result);
    // });
    //endregion

    //region Find all players in Room
    // this.service.GetAllPlayersInRoom("ROOM", result => {
    //   console.log(result);
    // });
    //endregion

    //region Add Message
    // var message = {
    //   roomCode: "ROOM",
    //   text: "Test Message",
    //   timestamp: Date.now()
    // }
    // this.service.AddMessage(message, result => {
    //   console.log(result);
    // })
    // endregion




  }

}
