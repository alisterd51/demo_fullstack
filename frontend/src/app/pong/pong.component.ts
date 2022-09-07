import { Component, OnInit } from '@angular/core';
import { filter, fromEvent, interval } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { Ai } from './pong/ai';
import { Game } from './pong/game';
import { IGameStates } from './pong/interfaces/game-states.interface';
import { IGame } from './pong/interfaces/game.interface';
import { IInput } from './pong/interfaces/input.interface';

const interval_tick = 8; //16
const racketHeight = 200;
const racketWidth = 50;
const gameHeight = 790;
const gameWidth = 1000;
const gameMargin = 10;
const ballDiameter = 20;
const racketSpeed = 5; //11
const ballSpeed = 10; //20
const defaultKeyUpPlayer1 = 'w';
const defaultKeyDownPlayer1 = 's';
const defaultKeyUpPlayer2 = 'ArrowUp';
const defaultKeyDownPlayer2 = 'ArrowDown';
const defaultColorRacketPlayer1 = '#5a74c4';
const defaultColorRacketPlayer2 = '#a43737';
const keyStart = ' ';
const scoreToWin = 11; //11
//un joueur peut etre de trois type:
//un joueur local       represente par une config clavier
//un joueur/ia distant  represente par un uid
//une ia local          represente par un niveau

//il faut envoyer une seul update par modif d'input
//ajouter l'envoi et la recetion de la pause
//ajouter la recetion de la position le vecteur vitesse de la balle
//ajouter la recetion de toutes les variable d'une partie dans le cas ou la partie est sur le serveur

//en mode serveur, je recois toute les info de position du serveur via socket.io

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css'],
  providers: [Game, Ai],
})
export class PongComponent implements OnInit {
  gameConfig: IGame = {
    userIdLeft: 0,
    userIdRight: 1,
    gameId: 0,
    scoreToWin: scoreToWin,
    board: {
      width: gameWidth,
      height: gameHeight,
      margin: gameMargin,
      color: '#000000',
    },
    racketLeft: {
      width: racketWidth,
      height: racketHeight,
      speed: racketSpeed,
      color: defaultColorRacketPlayer1,
    },
    racketRight: {
      width: racketWidth,
      height: racketHeight,
      speed: racketSpeed,
      color: defaultColorRacketPlayer2,
    },
    inputLeft: {
      userId: 0,
      up: false,
      down: false,
    },
    inputRight: {
      userId: 1,
      up: false,
      down: false,
    },
    ball: {
      diammeter: ballDiameter,
      speed: ballSpeed,
      collor: '#e5e83b',
    },
    states: {
      gameId: 0,
      racketLeft: {
        left: gameMargin,
        top: gameMargin,
      },
      racketRight: {
        left: gameWidth - gameMargin - racketWidth,
        top: gameMargin,
      },
      ball: {
        left: gameWidth / 2 - ballDiameter / 2,
        top: gameHeight / 2 - ballDiameter / 2,
      },
      ballDirection: [ballSpeed / 2, 0],
      scoreLeft: 0,
      scoreRight: 0,
      start: false,
    },
  };

  key = {
    leftUp: defaultKeyUpPlayer1,
    leftDown: defaultKeyDownPlayer1,
    rightUp: defaultKeyUpPlayer2,
    rightDown: defaultKeyDownPlayer2,
    start: keyStart,
  };

  moveLeft: IInput = {
    userId: 0,
    up: false,
    down: false,
  };
  moveRight: IInput = {
    userId: 1,
    up: false,
    down: false,
  };

  mode = {
    game: 'local',
    racketLeft: 'local',
    racketRight: 'local',
  };

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  game_title = 'FT PONG';

  fup$ = fromEvent<KeyboardEvent>(window, 'keyup');
  fdown$ = fromEvent<KeyboardEvent>(window, 'keydown');

  constructor(
    private socketService: SocketService,
    private game: Game,
    private ai: Ai
  ) {
    this.game = new Game;
    this.ai = new Ai;
  }

  ngOnInit(): void {
    this.socketService.getMove().subscribe((move: any) => {
      this.game.updateInput(move);
    });
    this.socketService.getGameStates().subscribe((states: any) => {
      this.game.updateStates(states);
    });
    interval(interval_tick).subscribe(() => {
      this.game.tick();
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

  sendMove(move: IInput, prevMove: IInput) {
    if (move.up !== prevMove.up || move.down !== prevMove.down) {
      this.socketService.sendMove(move);
    }
  }

  sendGameStates(gameStates: IGameStates) {
    this.socketService.sendGameStates(gameStates);
  }

  toUp(key: string) {
    if (key === this.key.rightUp) {
      this.moveRight.up = false;
    } else if (key === this.key.rightDown) {
      this.moveRight.down = false;
    } else if (key === this.key.leftUp) {
      this.moveLeft.up = false;
    } else if (key === this.key.leftDown) {
      this.moveLeft.down = false;
    }
  }

  toDown(key: string) {
    if (key === this.key.start) {
      this.game.start();
    } else if (key === this.key.rightUp) {
      this.moveRight.up = true;
    } else if (key === this.key.rightDown) {
      this.moveRight.down = true;
    } else if (key === this.key.leftUp) {
      this.moveLeft.up = true;
    } else if (key === this.key.leftDown) {
      this.moveLeft.down = true;
    }
  }

  tick(): void {
    this.game.updateInput(this.moveLeft);
    this.game.updateInput(this.moveRight);
    this.game.tick();
    this.gameConfig.states = this.game.getGameStates();
    this.sendGameStates(this.gameConfig.states);
    this.draw();
    if (!this.gameConfig.states.start || this.game.getWinner != null) {
      this.darken();
    }
  }

  win() {
    return this.game.getWinner;
  }

  // il faut que le serveur mette d'accord les distant sur la pose et l'etat actuel du jeu
  /*
  selectInput(racket: IRacket): boolean[] {
    if (racket.mode === 'local') {
      return [racket.move.toUp, racket.move.toDown];
    } else if (racket.mode === 'ai') {
      this.ai.getInput();
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
*/
  reset(): void {
    const newStates: IGameStates = {
      gameId: 0,
      racketLeft: {
        left: gameMargin,
        top: gameMargin,
      },
      racketRight: {
        left: gameWidth - gameMargin - racketWidth,
        top: gameMargin,
      },
      ball: {
        left: gameWidth / 2 - ballDiameter / 2,
        top: gameHeight / 2 - ballDiameter / 2,
      },
      ballDirection: [ballSpeed / 2, 0],
      scoreLeft: 0,
      scoreRight: 0,
      start: false,
    };
    this.game.updateStates(newStates);
  }

  resetAll(): void {
    const newGame: IGame = {
      userIdLeft: 0,
      userIdRight: 1,
      gameId: 0,
      scoreToWin: scoreToWin,
      board: {
        width: gameWidth,
        height: gameHeight,
        margin: gameMargin,
        color: '#000000',
      },
      racketLeft: {
        width: racketWidth,
        height: racketHeight,
        speed: racketSpeed,
        color: defaultColorRacketPlayer1,
      },
      racketRight: {
        width: racketWidth,
        height: racketHeight,
        speed: racketSpeed,
        color: defaultColorRacketPlayer2,
      },
      inputLeft: {
        userId: 0,
        up: false,
        down: false,
      },
      inputRight: {
        userId: 1,
        up: false,
        down: false,
      },
      ball: {
        diammeter: ballDiameter,
        speed: ballSpeed,
        collor: '#e5e83b',
      },
      states: {
        gameId: 0,
        racketLeft: {
          left: gameMargin,
          top: gameMargin,
        },
        racketRight: {
          left: gameWidth - gameMargin - racketWidth,
          top: gameMargin,
        },
        ball: {
          left: gameWidth / 2 - ballDiameter / 2,
          top: gameHeight / 2 - ballDiameter / 2,
        },
        ballDirection: [ballSpeed / 2, 0],
        scoreLeft: 0,
        scoreRight: 0,
        start: false,
      },
    };
    this.game.updateAll(newGame);
  }

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
    this.ctx.fillStyle = this.gameConfig.ball.collor;
    this.ctx.arc(
      this.gameConfig.states.ball.left + this.gameConfig.ball.diammeter / 2,
      this.gameConfig.states.ball.top + this.gameConfig.ball.diammeter / 2,
      this.gameConfig.ball.diammeter / 2,
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

    this.ctx.fillStyle = this.gameConfig.racketLeft.color;
    this.roundRect(
      this.gameConfig.states.racketLeft.left,
      this.gameConfig.states.racketLeft.top,
      this.gameConfig.racketLeft.width,
      this.gameConfig.racketLeft.height,
      10,
      true,
      false
    );

    // draw left racket
    this.ctx.fillStyle = this.gameConfig.racketRight.color;
    this.roundRect(
      this.gameConfig.states.racketRight.left,
      this.gameConfig.states.racketRight.top,
      this.gameConfig.racketRight.width,
      this.gameConfig.racketRight.height,
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
      String(this.gameConfig.states.scoreLeft),
      gameWidth * 0.4,
      gameHeight * 0.05
    );
    this.ctx.fillText(
      String(this.gameConfig.states.scoreLeft),
      gameWidth * 0.6,
      gameHeight * 0.05
    );
  }
}
