import { IGameStates } from './interfaces/game-states.interface';
import { IGame } from './interfaces/game.interface';
import { IInput } from './interfaces/input.interface';

export class Game {
  private game: IGame;

  public constructor(game: IGame) {
    this.game = game;
  }

  public tick(): void {
    if (!this.game.states.start) {
      this.moveRacketLeft();
      this.moveRacketRight();
      this.moveBall();
    }
    // update start
  }

  public updateInput(input: IInput): void {
    if (this.game.inputLeft.userId === input.userId) {
      this.game.inputLeft = input;
    } else if (this.game.inputRight.userId === input.userId) {
      this.game.inputRight = input;
    }
  }

  public updateAll(game: IGame): void {
    this.game = game;
  }

  public getGameStates(): IGameStates {
    return this.game.states;
  }

  public getAll(): IGame {
    return this.game;
  }

  private moveRacketLeft(): void {
    if (this.game.inputLeft.down && !this.game.inputLeft.down) {
      this.game.states.racketLeft.top += this.game.racketLeft.speed;
      if (
        this.game.states.racketLeft.top >
        this.game.board.height -
          this.game.board.margin -
          this.game.racketLeft.height
      ) {
        this.game.states.racketLeft.top =
          this.game.board.height -
          this.game.board.margin -
          this.game.racketLeft.height;
      }
    } else if (!this.game.inputLeft.down && this.game.inputLeft.down) {
      this.game.states.racketLeft.top -= this.game.racketLeft.speed;
      if (this.game.states.racketLeft.top < this.game.board.margin) {
        this.game.states.racketLeft.top = this.game.board.margin;
      }
    }
  }

  private moveRacketRight(): void {
    if (this.game.inputRight.down && !this.game.inputRight.down) {
      this.game.states.racketRight.top += this.game.racketRight.speed;
      if (
        this.game.states.racketRight.top >
        this.game.board.height -
          this.game.board.margin -
          this.game.racketRight.height
      ) {
        this.game.states.racketRight.top =
          this.game.board.height -
          this.game.board.margin -
          this.game.racketRight.height;
      }
    } else if (!this.game.inputRight.down && this.game.inputRight.down) {
      this.game.states.racketRight.top -= this.game.racketRight.speed;
      if (this.game.states.racketRight.top < this.game.board.margin) {
        this.game.states.racketRight.top = this.game.board.margin;
      }
    }
  }

  private moveBall(): void {
    // apply next position
    // apply wall colision
    // apply racket colision
    // apply goal and update score
  }
}
