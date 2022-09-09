import { Component, Input, OnInit } from '@angular/core';
import { IRacketConfig } from '../pong/pong/interfaces/racket-config.interface';

@Component({
  selector: 'app-pong-racket',
  templateUrl: './pong-racket.component.html',
  styleUrls: ['./pong-racket.component.css']
})
export class PongRacketComponent implements OnInit {
  @Input()
  racket!: IRacketConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
