import { Component, OnInit } from '@angular/core';
import { filter, fromEvent, interval } from 'rxjs';
import { IBall } from './interfaces/ball.interface';
import { IRacket } from './interfaces/racket.interface';

const interval_tick = 16;//16
const racketHeight = 200;
const racketWidth = 50;
const gameHeight = 990;
const gameWidth = 1000;
const gameMargin = 10;
const ballDiameter = 20;
const racketSpeed = 11;//11
const ballSpeed = 20;//20
const ballStartSpeed = Math.sqrt(ballSpeed * ballSpeed / 20);
const defaultKeyUpPlayer1 = "w";
const defaultKeyDownPlayer1 = "s";
const defaultKeyUpPlayer2 = "ArrowUp";
const defaultKeyDownPlayer2 = "ArrowDown";
const defaultColorRacketPlayer1 = "blue";
const defaultColorRacketPlayer2 = "red";

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css']
})
export class PongComponent implements OnInit {
  r_l: IRacket = {
    backgroundColor: defaultColorRacketPlayer1,
    top: gameMargin,
    left: gameMargin,
    height: racketHeight,
    width: racketWidth,
    toUp: false,
    toDown: false,
    toUpKey: defaultKeyUpPlayer1,
    toDownKey: defaultKeyDownPlayer1,
    ia: false
  };
  r_r: IRacket = {
    backgroundColor: defaultColorRacketPlayer2,
    top: gameMargin,
    left: gameWidth - gameMargin - racketWidth,
    height: racketHeight,
    width: racketWidth,
    toUp: false,
    toDown: false,
    toUpKey: defaultKeyUpPlayer2,
    toDownKey: defaultKeyDownPlayer2,
    ia: false
  };
  ball: IBall = {
    backgroundColor: 'yellow',
    top: (gameHeight / 2) - (ballDiameter / 2),
    left: (gameWidth / 2) - (ballDiameter / 2),
    // [0]: avance y
    // [1]: avance x
    speed: [
      this.getRandomInT(2) ? -ballStartSpeed : ballStartSpeed,
      this.getRandomInT(2) ? -ballStartSpeed : ballStartSpeed
    ],
    diameter: ballDiameter
  };

  game_title = "FT PONG";
  gameHeight = gameHeight;
  gameWidth = gameWidth;
  left_score = 0;
  right_score = 0;

  fup$ = fromEvent<KeyboardEvent>(window, "keyup");
  fdown$ = fromEvent<KeyboardEvent>(window, "keydown");

  constructor() {
  }

  ngOnInit(): void {
    interval(interval_tick).subscribe(() => {
      this.tick();
    });
    this.fup$.pipe(filter(event => !event.repeat)).subscribe((event) => {
      this.toUp(event.key);
    });
    this.fdown$.pipe(filter(event => !event.repeat)).subscribe((event) => {
      this.toDown(event.key);
    });
  }

  toUp(key: string) {
    if (key === this.r_r.toUpKey) {
      this.r_r.toUp = false;
    } else if (key === this.r_r.toDownKey) {
      this.r_r.toDown = false;
    } else if (key === this.r_l.toUpKey) {
      this.r_l.toUp = false;
    } else if (key === this.r_l.toDownKey) {
      this.r_l.toDown = false;
    }
  }

  toDown(key: string) {
    if (key === this.r_r.toUpKey) {
      this.r_r.toUp = true;
    } else if (key === this.r_r.toDownKey) {
      this.r_r.toDown = true;
    } else if (key === this.r_l.toUpKey) {
      this.r_l.toUp = true;
    } else if (key === this.r_l.toDownKey) {
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
    if (this.r_l.ia) {
      const key = this.iaBasic(this.ball.top + (this.ball.diameter / 2), this.r_l.top + (this.r_l.height / 2));
      this.r_l.toUp = key[0];
      this.r_l.toDown = key[1];
    }
    if (this.r_r.ia) {
      const key = this.iav1(this.ball, this.r_r);
      this.r_r.toUp = key[0];
      this.r_r.toDown = key[1];
    }
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
    if (this.ball.top <= 0) {
      this.ball.top = 0;
      this.ball.speed[0] *= -1;
    } else if (this.ball.top + this.ball.diameter >= gameHeight) {
      this.ball.top = gameHeight - this.ball.diameter;
      this.ball.speed[0] *= -1;
    }
  }

  racketColision(): void {
    if (this.ball.left < gameWidth / 2
        && this.ball.left <= gameMargin + this.r_l.width
        && this.ball.left + this.ball.diameter >= gameMargin
        && this.ball.top + ballDiameter >= this.r_l.top
        && this.ball.top <= this.r_l.top + racketHeight) {
      this.rColision(this.r_l);
    } else if (this.ball.left + ballDiameter >= this.r_r.left
        && this.ball.left <= this.r_r.left + this.r_r.width
        && this.ball.top + ballDiameter >= this.r_r.top
        && this.ball.top <= this.r_r.top + racketHeight) {
      this.rColision(this.r_r);
    }
  }

  rColision(racket: IRacket): void {
    // B centre de la ball A est le centre de la racket
    const centerBall = [
      this.ball.left + (this.ball.diameter / 2),
      this.ball.top + (this.ball.diameter / 2)
    ];
    const centerRacket = [
      racket.left + (racket.width / 2),
      racket.top + (racket.height / 2)
    ];
    let angle = Math.atan((centerBall[1] - centerRacket[1]) / (centerBall[0] - centerRacket[0]));
    let vitesse = ballSpeed;
    if (centerBall[0] < centerRacket[0]) {
      vitesse *= -1;
    }
    if (angle > 0.4 * Math.PI && angle < 0.6 * Math.PI) {
      if (angle < Math.PI / 2) {
        angle = 0.4 * Math.PI;
      } else {
        angle = 0.6 * Math.PI;
      }
    } else if (angle < 0.4 * -Math.PI && angle > 0.6 * -Math.PI) {
      if (angle > -Math.PI / 2) {
        angle = 0.4 * -Math.PI;
      } else {
        angle = 0.6 * -Math.PI;
      }
    }
    this.ball.speed = [Math.sin(angle) * vitesse, Math.cos(angle) * vitesse];
  }

  getRandomInT(max: number): number {
    return Math.floor(Math.random() * max);
  }

  nBall(): IBall {
    const newBall: IBall = {
      backgroundColor: 'yellow',
      top: (gameHeight / 2) - (ballDiameter / 2),
      left: (gameWidth / 2) - (ballDiameter / 2),
      speed: [
        this.getRandomInT(2) ? -ballStartSpeed : ballStartSpeed,
        this.getRandomInT(2) ? -ballStartSpeed : ballStartSpeed
      ],
      diameter: ballDiameter
    };
    return newBall;
  }

  iaBasic(centerBall: number, centerRacket: number): boolean[] {
    if (centerBall > centerRacket + racketHeight / 4) {
      return [false, true];
    } else if (centerBall < centerRacket - racketHeight / 4) {
      return [true, false];
    } else {
      return [false, false];
    }
  }

  ballTopPrediction(ball: IBall, racket: IRacket): number {
    const angle = Math.atan(ball.speed[0] / ball.speed[1]);
    const adj = ball.left + (ball.diameter / 2) - (racket.left + (racket.width / 2));
    const diffBallTop = Math.tan(angle) * Math.abs(adj);
    const predictTop = ball.top + diffBallTop;
    if (predictTop < 0 || predictTop > gameHeight) {
      const angleRenver = Math.PI / 2 - angle;
      if (ball.speed[0] > 0) {
        const angleRenver = Math.PI / 2 - angle;
        const distYWall = gameHeight - ball.top - ball.diameter;
        const distXWall = Math.tan(angleRenver) * distYWall;
        const newBall: IBall = {
          backgroundColor: '',
          top: distYWall + ball.top,
          left: distXWall + ball.left,
          speed: [-ball.speed[0], ball.speed[1]],
          diameter: ball.diameter
        };
        return this.ballTopPrediction(newBall, racket);
      } else {
        const angleRenver = angle + Math.PI / 2;
        const distYWall = ball.top;
        const distXWall = Math.tan(angleRenver) * distYWall;
        const newBall: IBall = {
          backgroundColor: '',
          top: distYWall - ball.top,
          left: distXWall + ball.left,
          speed: [-ball.speed[0], ball.speed[1]],
          diameter: ball.diameter
        };
        return this.ballTopPrediction(newBall, racket);
      }
    }
    return predictTop;
  }

  iav1(ball: IBall, racket: IRacket): boolean[] {
    const centerBall = ball.top + (ball.diameter / 2);
    const centerRacket = racket.top + (racket.height / 2);
    if ((ball.speed[1] > 0 && ball.left > racket.left)
        || (ball.speed[1] < 0 &&  ball.left < racket.left)) {
      return this.iaBasic(gameHeight / 2, centerRacket);
    } else {
      const predictTop = this.ballTopPrediction(ball, racket);
      if (predictTop < 0 || predictTop > gameHeight) {
        return this.iaBasic(gameHeight / 2, centerRacket);
      } else {
        return this.iaBasic(predictTop, centerRacket);
      }
    }
  }
}
