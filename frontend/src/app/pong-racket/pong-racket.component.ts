import { Component, Input, OnInit } from '@angular/core';
import { IRacket } from '../pong/interfaces/racket.interface';

@Component({
  selector: 'app-pong-racket',
  templateUrl: './pong-racket.component.html',
  styleUrls: ['./pong-racket.component.css']
})
export class PongRacketComponent implements OnInit {
  @Input()
  player!: IRacket;

  constructor() { }

  ngOnInit(): void {
  }

}
