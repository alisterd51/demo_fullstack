import { IGameStates } from './interfaces/game-states.interface';
import { IGame } from './interfaces/game.interface';
import { IInput } from './interfaces/input.interface';

export class Game {
  private game: IGame;

  public constructor(game: IGame) {
    this.game = game;
  }

  public tick(): void {
    console.log('update game');
  }

  public updateInput(input: IInput) {
    if (this.game.inputLeft.userId === input.userId) {
      this.game.inputLeft = input;
    } else if (this.game.inputRight.userId === input.userId) {
      this.game.inputRight = input;
    }
  }

  public updateAll(game: IGame) {
    this.game = game;
  }

  public getGameStates(): IGameStates {
    return this.game.states;
  }

  public getAll(): IGame {
    return this.game;
  }
}
