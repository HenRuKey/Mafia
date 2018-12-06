import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../player';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {

  private players : Player[];
  @Input() private userPlayer : Player;

  constructor() { }

  ngOnInit() {
  }

}
