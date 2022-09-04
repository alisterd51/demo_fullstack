import { IGameStates } from './interfaces/game-states.interface';
import { IGame } from './interfaces/game.interface';
import { IInput } from './interfaces/input.interface';

export type LevelAi = 'easy' | 'hard';

export class Ai {
  private game: IGame;
  private level: LevelAi;
  private userId: number;

  public constructor(game: IGame, level: LevelAi, userId: number) {
    this.game = game;
    this.level = level;
    this.userId = userId;
  }

  public setLevel(level: LevelAi) {
    this.level = level;
  }

  public setStates(states: IGameStates) {
    this.game.states = states;
  }

  public getInput(): IInput {
    if (this.level === 'easy') {
      return this.aiV0();
    } else {
      return this.aiV1();
    }
  }

  private aiV0(): IInput {
    if (this.userId === this.game.userIdLeft) {
      return this.ketToCenter(
        this.game.states.ball.top + this.game.ball.diammeter / 2,
        this.game.states.racketLeft.top + this.game.racketLeft.height / 2,
        this.game.racketLeft.height,
      );
    } else if (this.userId === this.game.userIdRight) {
      return this.ketToCenter(
        this.game.states.ball.top + this.game.ball.diammeter / 2,
        this.game.states.racketRight.top + this.game.racketRight.height / 2,
        this.game.racketRight.height,
      );
    } else {
      return {
        userId: this.userId,
        up: false,
        down: false,
      };
    }
  }

  private aiV1(): IInput {
    return {
      userId: this.userId,
      up: false,
      down: false,
    };
  }

  private ketToCenter(
    centerBall: number,
    centerRacket: number,
    heightRacket: number,
  ): IInput {
    const input: IInput = {
      userId: this.userId,
      up: false,
      down: false,
    };
    if (centerBall > centerRacket + heightRacket / 4) {
      input.up = true;
    } else if (centerBall > centerRacket - heightRacket / 4) {
      input.down = true;
    }
    return input;
  }
}
