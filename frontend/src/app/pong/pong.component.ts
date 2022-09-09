import { Component, OnInit } from '@angular/core';
import { filter, fromEvent, interval } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { Ai, LevelAi } from './pong/ai';
import { defaultGameConfig } from './pong/config';
import { Game } from './pong/game';
import { IGameStates } from './pong/interfaces/game-states.interface';
import { IGame, PlayerMode } from './pong/interfaces/game.interface';
import { IInput } from './pong/interfaces/input.interface';

const interval_tick = 8; //16
const keyStart = ' ';
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
  gameConfig: IGame = defaultGameConfig;

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
    this.game = new Game();
    this.ai = new Ai();
    this.game.updateAll(this.gameConfig);
    this.ai.setAll(this.gameConfig);
  }

  ngOnInit(): void {
    this.socketService.getMove().subscribe((move: any) => {
      this.game.updateInput(move);
    });
    this.socketService.getGameStates().subscribe((states: any) => {
      this.game.updateStates(states);
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

  sendMove(move: IInput, prevMove: IInput) {
    if (move.up !== prevMove.up || move.down !== prevMove.down) {
      this.socketService.sendMove(move);
    }
  }

  sendGameStates(gameStates: IGameStates) {
    this.socketService.sendGameStates(gameStates);
  }

  toUp(key: string) {
    if (this.gameConfig.left.mode.type === 'local') {
      if (key === this.gameConfig.left.mode.upKey) {
        this.moveLeft.up = false;
      } else if (key === this.gameConfig.left.mode.downKey) {
        this.moveLeft.down = false;
      }
    }
    if (this.gameConfig.right.mode.type === 'local') {
      if (key === this.gameConfig.right.mode.upKey) {
        this.moveRight.up = false;
      } else if (key === this.gameConfig.right.mode.downKey) {
        this.moveRight.down = false;
      }
    }
  }

  toDown(key: string) {
    if (this.gameConfig.left.mode.type === 'local') {
      if (key === this.gameConfig.left.mode.upKey) {
        this.moveLeft.up = true;
      } else if (key === this.gameConfig.left.mode.downKey) {
        this.moveLeft.down = true;
      }
    }
    if (this.gameConfig.right.mode.type === 'local') {
      if (key === this.gameConfig.right.mode.upKey) {
        this.moveRight.up = true;
      } else if (key === this.gameConfig.right.mode.downKey) {
        this.moveRight.down = true;
      }
    }
    if (key === keyStart) {
      this.game.start();
    }
  }

  tick(): void {
    //moveLeft:
    // si jeu local:
    //  si joueur:
    //   calcul la vrai pos
    //   envoie les states
    //  si ia:
    //   calcul la vrai pos
    //   envoie les states
    //  si distant:
    //   recois les inputs
    //   calcul la vrai pos
    //   envoie les states
    // si remote:
    //  si joueur:
    //   envoi les inputs
    //   estime les pos
    //   maj avec les states
    //  si ia:
    //   envoi les inputs
    //   estime les pos
    //   maj avec les states
    //  si distant:
    //   recois states distant
    //   estime la nouvel pos
    this.game.updateInput(
      this.getInput(
        this.gameConfig.left.mode,
        this.gameConfig.left.id,
        this.moveLeft,
        this.moveLeft
      )
    );
    this.game.updateInput(
      this.getInput(
        this.gameConfig.right.mode,
        this.gameConfig.right.id,
        this.moveRight,
        this.moveRight
      )
    );
    this.game.tick();
    this.gameConfig.states = this.game.getGameStates();
    this.sendGameStates(this.gameConfig.states);
    this.draw();
    if (!this.gameConfig.states.start || this.game.getWinner != null) {
      this.darken();
    }
  }

  getInput(
    racketMode: PlayerMode,
    userId: number,
    localMove: IInput,
    remoteMove: IInput
  ): IInput {
    if (racketMode.type === 'local') {
      return localMove;
    } else if (racketMode.type === 'ai') {
      this.ai.setStates(this.gameConfig.states);
      this.ai.setLevel(racketMode.level);
      this.ai.setUserId(userId);
      return this.ai.getInput();
    } else if (racketMode.type === 'remote') {
      return {
        userId: userId,
        up: false,
        down: false,
      };
    } else {
      return {
        userId: userId,
        up: false,
        down: false,
      };
    }
  }

  win() {
    return this.game.getWinner();
  }

  reset(): void {
    this.game.updateStates(defaultGameConfig.states);
  }

  resetAll(): void {
    this.game.updateAll(defaultGameConfig);
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
    this.ctx.moveTo(this.gameConfig.board.board.width / 2, 0);
    this.ctx.lineTo(this.gameConfig.board.board.width / 2, this.gameConfig.board.board.height);
    this.ctx.stroke();

    // draw left racket

    this.ctx.fillStyle = this.gameConfig.left.racket.color;
    this.roundRect(
      this.gameConfig.states.racketLeft.left,
      this.gameConfig.states.racketLeft.top,
      this.gameConfig.left.racket.width,
      this.gameConfig.left.racket.height,
      10,
      true,
      false
    );

    // draw left racket
    this.ctx.fillStyle = this.gameConfig.right.racket.color;
    this.roundRect(
      this.gameConfig.states.racketRight.left,
      this.gameConfig.states.racketRight.top,
      this.gameConfig.right.racket.width,
      this.gameConfig.right.racket.height,
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
      this.gameConfig.board.board.width * 0.4,
      this.gameConfig.board.board.height * 0.05
    );
    this.ctx.fillText(
      String(this.gameConfig.states.scoreRight),
      this.gameConfig.board.board.width * 0.6,
      this.gameConfig.board.board.height * 0.05
    );
  }
}
