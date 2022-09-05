import { Point } from 'geometric';
import {
  checkIntersection,
  colinearPointWithinSegment,
  IntersectionCheckResult,
} from 'line-intersect';
import { IGameStates } from './interfaces/game-states.interface';
import { IGame } from './interfaces/game.interface';
import { IInput } from './interfaces/input.interface';
import { IRacket } from './interfaces/racket.interface';

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
    const racket: IRacket | null = this.getRacket();
    if (racket == null) {
      return {
        userId: this.userId,
        up: false,
        down: false,
      };
    } else if (this.level === 'easy') {
      return this.aiV0(racket);
    } else {
      return this.aiV1(racket);
    }
  }

  private getRacket(): IRacket | null {
    if (this.userId === this.game.userIdLeft) {
      return {
        left: this.game.states.racketLeft.left,
        top: this.game.states.racketLeft.top,
        width: this.game.racketLeft.width,
        height: this.game.racketLeft.height,
      };
    } else if (this.userId === this.game.userIdRight) {
      return {
        left: this.game.states.racketRight.left,
        top: this.game.states.racketRight.top,
        width: this.game.racketRight.width,
        height: this.game.racketRight.height,
      };
    } else {
      return null;
    }
  }

  private aiV0(racket: IRacket): IInput {
    return this.ketToCenter(
      this.game.states.ball.top + this.game.ball.diammeter / 2,
      racket.top + racket.height / 2,
      racket.height,
    );
  }

  private aiV1(racket: IRacket): IInput {
    if (
      (this.game.states.ballDirection[0] > 0 &&
        this.game.states.ball.left > racket.left + racket.width) ||
      (this.game.states.ballDirection[0] < 0 &&
        this.game.states.ball.left + this.game.ball.diammeter < racket.left)
    ) {
      return this.ketToCenter(
        this.game.board.height / 2,
        racket.top + racket.height / 2,
        racket.height,
      );
    } else {
      const ball: Point = [
        this.game.states.ball.left + this.game.ball.diammeter / 2,
        this.game.states.ball.top + this.game.ball.diammeter / 2,
      ];
      return this.ketToCenter(
        this.predictCenter(racket, ball, [
          this.game.states.ballDirection[0],
          this.game.states.ballDirection[1],
        ]),
        racket.top + racket.height / 2,
        racket.height,
      );
    }
  }

  private predictCenter(
    racket: IRacket,
    ball: Point,
    ballDirection: Point,
  ): number {
    const racketCenter: Point = [
      racket.left + racket.width / 2,
      racket.top + racket.height / 2,
    ];
    const racketColision: IntersectionCheckResult = checkIntersection(
      ball[0],
      ball[1],
      ball[0] + ballDirection[0],
      ball[1] + ballDirection[1],
      racketCenter[0],
      0,
      racketCenter[0],
      this.game.board.height,
    );
    const wall: Point =
      ballDirection[1] < 0 ? [0, 0] : [0, this.game.board.height];
    const wallColision: IntersectionCheckResult = checkIntersection(
      ball[0],
      ball[1],
      ball[0] + ballDirection[0],
      ball[1] + ballDirection[1],
      wall[0],
      wall[1],
      this.game.board.width,
      wall[1],
    );
    if (
      racketColision.type === 'intersecting' &&
      colinearPointWithinSegment(
        racketColision.point.x,
        racketColision.point.y,
        racketCenter[0],
        0,
        racketCenter[0],
        this.game.board.height,
      )
    ) {
      return racketColision.point.y;
    } else if (wallColision.type === 'intersecting') {
      return this.predictCenter(
        racket,
        [wallColision.point.x, wallColision.point.y],
        [ballDirection[0], ballDirection[1] * -1],
      );
    } else {
      return this.game.board.height / 2;
    }
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
