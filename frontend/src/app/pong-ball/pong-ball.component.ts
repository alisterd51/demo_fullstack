import { Component, Input, OnInit } from '@angular/core';
import { IBall } from '../pong/interfaces/ball.interface';

@Component({
  selector: 'app-pong-ball',
  templateUrl: './pong-ball.component.html',
  styleUrls: ['./pong-ball.component.css']
})
export class PongBallComponent implements OnInit {
  @Input()
  ball!: IBall;

  constructor() { }

  ngOnInit(): void {
  }

}
