import { Component, OnInit } from '@angular/core';
import { filter, fromEvent, interval } from 'rxjs';
import { IBall } from './interfaces/ball.interface';
import { IRacket } from './interfaces/racket.interface';

const interval_tick = 16;
const racketHeight = 200;
const racketWidth = 50;
const gameHeight = 990;
const gameWidth = 1000;
const gameMargin = 10;
const ballDiameter = 50;
const racketSpeed = 11;

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
  ball: IBall = {
    backgroundColor: 'yellow',
    top: (gameHeight / 2) - (ballDiameter / 2),
    left: (gameWidth / 2) - (ballDiameter / 2),
    speed: [this.getRandomInT(2) ? -3 : 3, this.getRandomInT(2) ? -3 : 3],
    diameter: ballDiameter
  };

  game_title = "FT PONG";
  gameHeight = gameHeight;
  gameWidth = gameWidth;
  left_score = 0;
  right_score = 0;

  //pong gamer left
  left_up = "w";
  left_down = "s";

  //pong gamer right
  right_up = "ArrowUp";
  right_down = "ArrowDown";

  fup$ = fromEvent<KeyboardEvent>(window, "keyup");
  fdown$ = fromEvent<KeyboardEvent>(window, "keydown");

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
      && racket.top + racketSpeed <= gameHeight - racket.height)  {
      racket.top += racketSpeed;
    } else if (!racket.toDown && racket.toUp
      && racket.top - racketSpeed >= 0) {
        racket.top -= racketSpeed;
    }
  }

  tick(): void {
    this.moveRacket(this.r_r);
    this.moveRacket(this.r_l);
    this.moveBall();
    this.wallColision();
    this.racketColision();
    this.updateScore();
  }

  updateScore(): void {
    if (this.ball.left < 0 - ballDiameter) {
      this.right_score++;
      this.ball = this.nBall();
    } else if (this.ball.left > gameWidth) {
      this.left_score++;
      this.ball = this.nBall();
    }
  }

  moveBall(): void {
    this.ball.top += this.ball.speed[0];
    this.ball.left += this.ball.speed[1];
  }

  wallColision(): void {
    if (this.ball.top <= 0 || this.ball.top + this.ball.diameter >= gameHeight) {
      this.ball.speed[0] *= -1;
    }
  }

  racketColision(): void {
    if ((this.ball.speed[1] < 0
    && this.ball.left <= gameMargin + this.r_l.width
    && this.ball.top + ballDiameter >= this.r_l.top
    && this.ball.top <= this.r_l.top + racketHeight)
    || (this.ball.speed[1] > 0
    && this.ball.left + ballDiameter >= this.r_r.left
    && this.ball.top + ballDiameter >= this.r_r.top
    && this.ball.top <= this.r_r.top + racketHeight)) {
      this.ball.speed[1] *= -1.1;
      this.ball.speed[0] *= 1.1;
    }
  }

  getRandomInT(max: number): number {
    return Math.floor(Math.random() * max);
  }

  nBall(): IBall {
    const newBall: IBall = {
      backgroundColor: 'yellow',
      top: (gameHeight / 2) - (ballDiameter / 2),
      left: (gameWidth / 2) - (ballDiameter / 2),
      speed: [this.getRandomInT(2) ? -3 : 3, this.getRandomInT(2) ? -3 : 3],
      diameter: ballDiameter
    };
    return newBall;
  }
}
