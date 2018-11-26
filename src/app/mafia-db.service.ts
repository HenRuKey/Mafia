import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MafiaDbService {

  test = [];
  constructor(private http: HttpClient) { }

  CheckRoomByID(id) {
    this.http.get<any>('http://localhost:3000/api/' + id, id).subscribe(result => {
      console.log(result);
    })
    return this.test;

  }

}

