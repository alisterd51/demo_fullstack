import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css']
})
export class PongComponent implements OnInit {
  game_title = "FT PONG";
  left_score = 0;
  right_score = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
