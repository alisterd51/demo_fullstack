import { Component, OnInit } from '@angular/core';
import { filter, fromEvent, interval } from 'rxjs';
import { IBall } from './interfaces/ball.interface';
import { IRacket } from './interfaces/racket.interface';

const interval_tick = 16;
const racketHeight = 200;
const racketWidth = 50;
const gameHeight = 490;
const gameWidth = 500;
const gameMargin = 10;
const ballDiameter = 50;

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css']
})
export class PongComponent implements OnInit {
  r_l: IRacket = {
    backgroundColor: "blue",
    top: gameMargin,
    left: gameMargin,
    height: racketHeight,
    width: racketWidth,
    toUp: false,
    toDown: false
  };
  r_r: IRacket = {
    backgroundColor: "red",
    top: gameMargin,
    left: gameWidth - gameMargin - racketWidth,
    height: racketHeight,
    width: racketWidth,
    toUp: false,
    toDown: false
  };

  game_title = "FT PONG";
  left_score = 0;
  right_score = 0;
  //ball position
  top_ball = (gameHeight / 2) - (ballDiameter / 2);
  left_ball = (gameWidth / 2) - (ballDiameter / 2);
  speed_ball: number[] = [1, 1];

  //pong gamer left
  left_up = "w";
  left_down = "s";

  //pong gamer right
  right_up = "ArrowUp";
  right_down = "ArrowDown";

  fup$ = fromEvent<KeyboardEvent>(window, "keyup");
  fdown$ = fromEvent<KeyboardEvent>(window, "keydown");

  // interval:
  //  interval(1000).subscribe(reaction);
  // event:
  //  event.subscribe(reaction);

  constructor() {
  }

  ngOnInit(): void {
    interval(interval_tick).subscribe(() => {
      this.tick();
    });
    this.fup$.pipe(filter(event => !event.repeat)).subscribe((event) => {
      //console.log("up", event.key);
      this.toUp(event.key);
    });
    this.fdown$.pipe(filter(event => !event.repeat)).subscribe((event) => {
      //console.log("down", event.key);
      this.toDown(event.key);
    });
  }

  toUp(key: string) {
    if (key === this.right_up) {
      this.r_r.toUp = false;
    } else if (key === this.right_down) {
      this.r_r.toDown = false;
    } else if (key === this.left_up) {
      this.r_l.toUp = false;
    } else if (key === this.left_down) {
      this.r_l.toDown = false;
    }
  }

  toDown(key: string) {
    if (key === this.right_up) {
      this.r_r.toUp = true;
    } else if (key === this.right_down) {
      this.r_r.toDown = true;
    } else if (key === this.left_up) {
      this.r_l.toUp = true;
    } else if (key === this.left_down) {
      this.r_l.toDown = true;
    }
  }

  moveRacket(racket: IRacket): void {
    if (racket.toDown && !racket.toUp
      && racket.top + 5 <= gameHeight - racket.height)  {
      racket.top += 5;
    } else if (!racket.toDown && racket.toUp
      && racket.top - 5 >= 0) {
        racket.top -= 5;
    }
  }

  tick(): void {
    this.moveRacket(this.r_r);
    this.moveRacket(this.r_l);

    this.top_ball += this.speed_ball[0];
    this.left_ball += this.speed_ball[1];
    if (this.left_ball < 0 - ballDiameter) {
      this.left_score++;
      this.newBall();
    } else if (this.left_ball > gameWidth) {
      this.right_score++;
      this.newBall();
    }
    // ball en bas ou en haut
    if (this.top_ball <= 0 || this.top_ball + 50 >= gameHeight) {
      this.speed_ball[0] *= -1;
    }
    // collision avec raquete gauche
    // left_ball <= marge gauche + width_ball
    // || left_ball + width_ball >= width_scene - marge droite - width_racket
    if ((this.speed_ball[1] < 0
        && this.left_ball <= gameMargin + this.r_l.width
        && this.top_ball + ballDiameter >= this.r_l.top
        && this.top_ball <= this.r_l.top + racketHeight)
      || (this.speed_ball[1] > 0
        && this.left_ball + ballDiameter >= this.r_r.left
        && this.top_ball + ballDiameter >= this.r_r.top
        && this.top_ball <= this.r_r.top + racketHeight)){
      this.speed_ball[1] *= -1.1;
      this.speed_ball[0] *= 1.1;
    }
  }

  getRandomInT(max: number): number {
    return Math.floor(Math.random() * max);
  }

  newBall(): void {
    this.top_ball = (gameHeight / 2) - (ballDiameter / 2);
    this.left_ball = (gameWidth / 2) - (ballDiameter / 2);
    this.speed_ball = [this.getRandomInT(2) ? -1 : 1, this.getRandomInT(2) ? -1 : 1];
  }

  nBall(): IBall {
    const newBall: IBall = {
      backgroundColor: '',
      top: 0,
      left: 0,
      speed: []
    };
    return newBall;
  }
}
