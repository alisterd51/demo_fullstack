import { Component, Input, OnInit } from '@angular/core';
import { IRacket } from '../pong/interfaces/racket.interface';

@Component({
  selector: 'app-pong-config',
  templateUrl: './pong-config.component.html',
  styleUrls: ['./pong-config.component.css']
})
export class PongConfigComponent implements OnInit {
  @Input()
  player!: IRacket;

  constructor() { }

  ngOnInit(): void {
  }

}
