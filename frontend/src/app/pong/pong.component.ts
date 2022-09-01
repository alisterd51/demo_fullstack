import { Component, OnInit } from '@angular/core';
import { filter, fromEvent, interval } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { IBall } from './interfaces/ball.interface';
import { IGame } from './interfaces/game.interface';
import { IMove } from './interfaces/move.interface';
import { IRacket } from './interfaces/racket.interface';

const interval_tick = 8; //16
const racketHeight = 200;
const racketWidth = 50;
const gameHeight = 790;
const gameWidth = 1000;
const gameMargin = 10;
const ballDiameter = 20;
const racketSpeed = 5; //11
const ballSpeed = 10; //20
const ballStartSpeed = Math.sqrt((ballSpeed * ballSpeed) / 20);
const defaultKeyUpPlayer1 = 'w';
const defaultKeyDownPlayer1 = 's';
const defaultKeyUpPlayer2 = 'ArrowUp';
const defaultKeyDownPlayer2 = 'ArrowDown';
const defaultColorRacketPlayer1 = '#5a74c4';
const defaultColorRacketPlayer2 = '#a43737';
const keyStart = ' ';
const scoreToWin = 11; //11
const defaultLeverAi = 2;
//un joueur peut etre de trois type:
//un joueur local       represente par une config clavier
//un joueur/ia distant  represente par un uid
//une ia local          represente par un niveau

//il faut envoyer une seul update par modif d'input
//ajouter l'envoi et la recetion de la pause
//ajouter la recetion de la position le vecteur vitesse de la balle
//ajouter la recetion de toutes les variable d'une partie dans le cas ou la partie est sur le serveur

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css'],
})
export class PongComponent implements OnInit {
  game: IGame = {
    racketSpeed: racketSpeed,
    ballSpeed: ballSpeed,
    backgroundColor: '#000000',
    scoreToWin: scoreToWin,
    mode: 'local',
    uid: 0,
  };
  r_l: IRacket = {
    backgroundColor: defaultColorRacketPlayer1,
    top: gameMargin,
    left: gameMargin,
    height: racketHeight,
    width: racketWidth,
    toUpKey: defaultKeyUpPlayer1,
    toDownKey: defaultKeyDownPlayer1,
    playerName: 'left',
    levelAi: defaultLeverAi,
    mode: 'local',
    move: {
      uid: 0,
      toUp: false,
      toDown: false,
    },
    prevMove: {
      uid: 0,
      toUp: false,
      toDown: false,
    },
    moveRemote: {
      uid: 0,
      toUp: false,
      toDown: false,
    }
  };
  r_r: IRacket = {
    backgroundColor: defaultColorRacketPlayer2,
    top: gameMargin,
    left: gameWidth - gameMargin - racketWidth,
    height: racketHeight,
    width: racketWidth,
    toUpKey: defaultKeyUpPlayer2,
    toDownKey: defaultKeyDownPlayer2,
    playerName: 'right',
    levelAi: defaultLeverAi,
    mode: 'local',
    move: {
      uid: 1,
      toUp: false,
      toDown: false,
    },
    prevMove: {
      uid: 1,
      toUp: false,
      toDown: false,
    },
    moveRemote: {
      uid: 1,
      toUp: false,
      toDown: false,
    },
  };
  ball: IBall = {
    backgroundColor: '#e5e83b',
    top: gameHeight / 2 - ballDiameter / 2,
    left: gameWidth / 2 - ballDiameter / 2,
    // [0]: avance y
    // [1]: avance x
    speed: [
      this.getRandomInT(2) ? -ballStartSpeed : ballStartSpeed,
      this.getRandomInT(2) ? -ballStartSpeed : ballStartSpeed,
    ],
    diameter: ballDiameter,
  };
  start: boolean = false;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  game_title = 'FT PONG';
  gameHeight = gameHeight;
  gameWidth = gameWidth;
  left_score = 0;
  right_score = 0;

  randAi = Math.random();

  fup$ = fromEvent<KeyboardEvent>(window, 'keyup');
  fdown$ = fromEvent<KeyboardEvent>(window, 'keydown');

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.getMove().subscribe((move: any) => {
      if (move.uid === this.r_l.move.uid) {
        this.r_l.moveRemote = move;
      } else if (move.uid === this.r_r.move.uid) {
        this.r_r.moveRemote = move;
      }
    });
    interval(interval_tick).subscribe(() => {
      this.tick();
    });
    this.fup$.pipe(filter((event) => !event.repeat)).subscribe((event) => {
      this.toUp(event.key);
    });
    this.fdown$.pipe(filter((event) => !event.repeat)).subscribe((event) => {
      this.toDown(event.key);
    });
    this.canvas = <HTMLCanvasElement>document.getElementById('stage');
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
  }

  sendMove(move: IMove, prevMove: IMove) {
    if (move.toUp !== prevMove.toUp || move.toDown !== prevMove.toDown) {
      console.log("diff", move, prevMove);
      this.socketService.sendMove(move);
    } else {
      console.log("no diff");
    }
  }

  win(): string | null {
    if (this.left_score >= this.game.scoreToWin) {
      return this.r_l.playerName;
    } else if (this.right_score >= this.game.scoreToWin) {
      return this.r_r.playerName;
    } else {
      return null;
    }
  }

  toUp(key: string) {
    if (key === this.r_r.toUpKey) {
      this.r_r.move.toUp = false;
    } else if (key === this.r_r.toDownKey) {
      this.r_r.move.toDown = false;
    } else if (key === this.r_l.toUpKey) {
      this.r_l.move.toUp = false;
    } else if (key === this.r_l.toDownKey) {
      this.r_l.move.toDown = false;
    }
  }

  toDown(key: string) {
    if (key === keyStart) {
      this.start = !this.start;
    } else if (key === this.r_r.toUpKey) {
      this.r_r.move.toUp = true;
    } else if (key === this.r_r.toDownKey) {
      this.r_r.move.toDown = true;
    } else if (key === this.r_l.toUpKey) {
      this.r_l.move.toUp = true;
    } else if (key === this.r_l.toDownKey) {
      this.r_l.move.toDown = true;
    }
  }

  moveRacket(racket: IRacket): void {
    if (
      racket.move.toDown &&
      !racket.move.toUp &&
      racket.top < gameHeight - gameMargin - racket.height
    ) {
      racket.top += this.game.racketSpeed;
      if (racket.top > gameHeight - gameMargin - racket.height) {
        racket.top = gameHeight - gameMargin - racket.height;
      }
    } else if (
      !racket.move.toDown &&
      racket.move.toUp &&
      racket.top > gameMargin
    ) {
      racket.top -= this.game.racketSpeed;
      if (racket.top < gameMargin) {
        racket.top = gameMargin;
      }
    }
  }

  tick(): void {
    this.r_r.left = gameWidth - gameMargin - this.r_r.width;
    if (this.start && this.win() == null) {
      const keyLeft = this.selectInput(this.r_l);
      this.r_l.move.toUp = keyLeft[0];
      this.r_l.move.toDown = keyLeft[1];
      this.sendMove(this.r_l.move, this.r_l.prevMove);
      //this.r_l.prevMove = this.r_l.move;
      const keyRight = this.selectInput(this.r_r);
      this.r_r.move.toUp = keyRight[0];
      this.r_r.move.toDown = keyRight[1];
      this.sendMove(this.r_r.move, this.r_r.prevMove);
      //this.r_r.prevMove = this.r_r.move; // a mettre dans sendMove
      this.moveRacket(this.r_r);
      this.moveRacket(this.r_l);
      this.moveBall();
      this.wallColision();
      this.racketColision();
      this.updateScore();
    }
    this.draw();
    if (!this.start || this.win() != null) {
      this.darken();
    }
  }

  // une input a:
  //  un uid.
  //  une tableau booleen

  // il faut que le serveur mette d'accord les distant sur la pose et l'etat actuel du jeu

  selectInput(racket: IRacket): boolean[] {
    if (racket.mode === 'local') {
      return [racket.move.toUp, racket.move.toDown];
    } else if (racket.mode === 'ai') {
      if (racket.levelAi == 1) {
        return this.iaBasic(this.ball, racket);
      } else {
        return this.iav1(this.ball, racket);
      }
    } else if (racket.mode === 'remote') {
      //requete avec l'uid
      return [racket.moveRemote.toUp, racket.moveRemote.toDown];
    } else {
      return [false, false];
    }
  }

  reset(): void {
    this.left_score = 0;
    this.right_score = 0;
    this.start = false;
    this.ball = this.nBall();
    this.r_l.top = gameMargin;
    this.r_r.top = gameMargin;
  }

  resetAll(): void {
    this.game = {
      racketSpeed: racketSpeed,
      ballSpeed: ballSpeed,
      backgroundColor: '#000000',
      scoreToWin: scoreToWin,
      mode: 'local',
      uid: 0,
    };
    this.r_l = {
      backgroundColor: defaultColorRacketPlayer1,
      top: gameMargin,
      left: gameMargin,
      height: racketHeight,
      width: racketWidth,
      toUpKey: defaultKeyUpPlayer1,
      toDownKey: defaultKeyDownPlayer1,
      playerName: '',
      levelAi: defaultLeverAi,
      mode: 'local',
      move: {
        uid: 0,
        toUp: false,
        toDown: false,
      },
      prevMove: {
        uid: 0,
        toUp: false,
        toDown: false,
      },
      moveRemote: {
        uid: 0,
        toUp: false,
        toDown: false,
      },
    };
    this.r_r = {
      backgroundColor: defaultColorRacketPlayer2,
      top: gameMargin,
      left: gameWidth - gameMargin - racketWidth,
      height: racketHeight,
      width: racketWidth,
      toUpKey: defaultKeyUpPlayer2,
      toDownKey: defaultKeyDownPlayer2,
      playerName: '',
      levelAi: defaultLeverAi,
      mode: 'local',
      move: {
        uid: 1,
        toUp: false,
        toDown: false,
      },
      prevMove: {
        uid: 1,
        toUp: false,
        toDown: false,
      },
      moveRemote: {
        uid: 1,
        toUp: false,
        toDown: false,
      },
    };
    this.ball = {
      backgroundColor: '#e5e83b',
      top: gameHeight / 2 - ballDiameter / 2,
      left: gameWidth / 2 - ballDiameter / 2,
      // [0]: avance y
      // [1]: avance x
      speed: [
        this.getRandomInT(2) ? -ballStartSpeed : ballStartSpeed,
        this.getRandomInT(2) ? -ballStartSpeed : ballStartSpeed,
      ],
      diameter: ballDiameter,
    };
  }

  updateScore(): void {
    if (this.ball.left < 0 - this.ball.diameter) {
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
      this.randAi = Math.random();
    } else if (this.ball.top + this.ball.diameter >= gameHeight) {
      this.ball.top = gameHeight - this.ball.diameter;
      this.ball.speed[0] *= -1;
      this.randAi = Math.random();
    }
  }

  racketColision(): void {
    if (
      this.ball.left < gameWidth / 2 &&
      this.ball.left <= gameMargin + this.r_l.width &&
      this.ball.left + this.ball.diameter >= gameMargin &&
      this.ball.top + this.ball.diameter >= this.r_l.top &&
      this.ball.top <= this.r_l.top + this.r_l.height
    ) {
      this.rColision(this.r_l);
    } else if (
      this.ball.left + this.ball.diameter >= this.r_r.left &&
      this.ball.left <= this.r_r.left + this.r_r.width &&
      this.ball.top + this.ball.diameter >= this.r_r.top &&
      this.ball.top <= this.r_r.top + this.r_r.height
    ) {
      this.rColision(this.r_r);
    }
  }

  rColision(racket: IRacket): void {
    const centerBall = [
      this.ball.left + this.ball.diameter / 2,
      this.ball.top + this.ball.diameter / 2,
    ];
    const centerRacket = [
      racket.left + racket.width / 2,
      racket.top + racket.height / 2,
    ];
    let angle = Math.atan(
      (centerBall[1] - centerRacket[1]) / (centerBall[0] - centerRacket[0])
    );
    let vitesse = this.game.ballSpeed;
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
    // modif aleatoire de l'angle pour eviter une boucle infini
    //angle += (Math.random() - 1) / 10;
    this.ball.speed = [Math.sin(angle) * vitesse, Math.cos(angle) * vitesse];
  }

  getRandomInT(max: number): number {
    return Math.floor(Math.random() * max);
  }

  nBall(): IBall {
    const newBall: IBall = {
      backgroundColor: '#e5e83b',
      top: gameHeight / 2 - this.ball.diameter / 2,
      left: gameWidth / 2 - this.ball.diameter / 2,
      speed: [
        this.getRandomInT(2) ? -ballStartSpeed : ballStartSpeed,
        this.getRandomInT(2) ? -ballStartSpeed : ballStartSpeed,
      ],
      diameter: this.ball.diameter,
    };
    return newBall;
  }

  KeyToCenter(
    centerBall: number,
    centerRacket: number,
    heightRacket: number
  ): boolean[] {
    const rand = ((this.randAi - 1) * heightRacket) / 3;
    if (centerBall > centerRacket + rand + heightRacket / 4) {
      return [false, true];
    } else if (centerBall < centerRacket + rand - heightRacket / 4) {
      return [true, false];
    } else {
      return [false, false];
    }
  }
  iaBasic(ball: IBall, racket: IRacket): boolean[] {
    return this.KeyToCenter(
      ball.top + ball.diameter / 2,
      racket.top + racket.height / 2,
      racket.height
    );
  }

  ballTopPrediction(ball: IBall, racket: IRacket): number {
    let angle = Math.atan(ball.speed[0] / ball.speed[1]);
    if (ball.speed[1] < 0) {
      angle *= -1;
    }
    const adj =
      ball.left + ball.diameter / 2 - (racket.left + racket.width / 2);
    const diffBallTop = Math.tan(angle) * Math.abs(adj);
    const predictTop = ball.top + diffBallTop;
    if (predictTop < 0 || predictTop > gameHeight) {
      let newBall: IBall = {
        backgroundColor: '',
        top: 0,
        left: 0,
        speed: [-ball.speed[0], ball.speed[1]],
        diameter: ball.diameter,
      };
      let distXWall;
      if (ball.speed[0] > 0) {
        const distYWall = gameHeight - ball.top - ball.diameter;
        distXWall = Math.tan(Math.PI / 2 - angle) * distYWall;
        newBall.top = distYWall + ball.top;
      } else {
        const distYWall = ball.top;
        distXWall = Math.tan(angle + Math.PI / 2) * distYWall;
        newBall.top = distYWall - ball.top;
      }
      newBall.left =
        ball.speed[1] < 0 ? -(distXWall - ball.left) : distXWall + ball.left;
      return this.ballTopPrediction(newBall, racket);
    }
    return predictTop;
  }

  iav1(ball: IBall, racket: IRacket): boolean[] {
    const centerBall = ball.top + ball.diameter / 2;
    const centerRacket = racket.top + racket.height / 2;
    if (
      (ball.speed[1] > 0 && ball.left > racket.left) ||
      (ball.speed[1] < 0 && ball.left < racket.left)
    ) {
      return this.KeyToCenter(gameHeight / 2, centerRacket, racket.height);
    } else {
      const predictTop = this.ballTopPrediction(ball, racket);
      return this.KeyToCenter(predictTop, centerRacket, racket.height);
    }
  }

  // iav0:
  // comme l'iaBasic mais envoie la ball le plus loin possible de l'adversaire

  // iav2:
  // comme l'iav1 mais envoie la ball le plus loin possible de l'adversaire

  roundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: any = 5,
    fill = false,
    stroke = true
  ) {
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
    }
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius.tl, y);
    this.ctx.lineTo(x + width - radius.tr, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.ctx.lineTo(x + width, y + height - radius.br);
    this.ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height
    );
    this.ctx.lineTo(x + radius.bl, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.ctx.lineTo(x, y + radius.tl);
    this.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    this.ctx.closePath();
    if (fill) {
      this.ctx.fill();
    }
    if (stroke) {
      this.ctx.stroke();
    }
  }

  drawBall() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.ball.backgroundColor;
    this.ctx.arc(
      this.ball.left + this.ball.diameter / 2,
      this.ball.top + this.ball.diameter / 2,
      this.ball.diameter / 2,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }

  darken() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    // clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw net
    this.ctx.strokeStyle = 'white';
    this.ctx.beginPath();
    this.ctx.setLineDash([5, 15]);
    this.ctx.moveTo(gameWidth / 2, 0);
    this.ctx.lineTo(gameWidth / 2, gameHeight);
    this.ctx.stroke();

    // draw left racket
    this.ctx.fillStyle = this.r_l.backgroundColor;
    this.roundRect(
      this.r_l.left,
      this.r_l.top,
      this.r_l.width,
      this.r_l.height,
      10,
      true,
      false
    );

    // draw left racket
    this.ctx.fillStyle = this.r_r.backgroundColor;
    this.roundRect(
      this.r_r.left,
      this.r_r.top,
      this.r_r.width,
      this.r_r.height,
      10,
      true,
      false
    );

    // draw ball
    this.drawBall();

    // draw score
    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      String(this.left_score),
      gameWidth * 0.4,
      gameHeight * 0.05
    );
    this.ctx.fillText(
      String(this.right_score),
      gameWidth * 0.6,
      gameHeight * 0.05
    );
  }
}
