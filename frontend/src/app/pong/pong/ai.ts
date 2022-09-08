import { Injectable } from '@angular/core';
import { lineAngle, Point, pointTranslate } from 'geometric';
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

@Injectable()
export class Ai {
  private game: IGame = {
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
  private level: LevelAi = 'easy';
  private userId = 0;

  public constructor() {}

  public setLevel(level: LevelAi) {
    this.level = level;
  }

  public setStates(states: IGameStates) {
    this.game.states = states;
  }

  public setUserId(userId: number) {
    this.userId = userId;
  }

  public setAll(game: IGame) {
    this.game = game;
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
      racket.height
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
        racket.height
      );
    } else {
      const ball: Point = [
        this.game.states.ball.left + this.game.ball.diammeter / 2,
        this.game.states.ball.top + this.game.ball.diammeter / 2,
      ];
      const angle = lineAngle([
        [0, 0],
        [this.game.states.ballDirection[0], this.game.states.ballDirection[1]],
      ]);
      const test = pointTranslate([0, 0], angle, 10000);
      return this.ketToCenter(
        this.predictCenter(racket, ball, test),
        racket.top + racket.height / 2,
        racket.height
      );
    }
  }

  private predictCenter(
    racket: IRacket,
    ball: Point,
    ballDirection: Point
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
      this.game.board.height
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
      wall[1]
    );
    if (
      racketColision.type === 'intersecting' &&
      colinearPointWithinSegment(
        racketColision.point.x,
        racketColision.point.y,
        racketCenter[0],
        0,
        racketCenter[0],
        this.game.board.height
      )
    ) {
      return racketColision.point.y;
    } else if (wallColision.type === 'intersecting') {
      return this.predictCenter(
        racket,
        [wallColision.point.x, wallColision.point.y],
        [ballDirection[0], ballDirection[1] * -1]
      );
    } else {
      return this.game.board.height / 2;
    }
  }

  private ketToCenter(
    centerBall: number,
    centerRacket: number,
    heightRacket: number
  ): IInput {
    let input: IInput = {
      userId: this.userId,
      up: false,
      down: false,
    };
    if (centerBall > centerRacket + heightRacket / 4) {
      input.down = true;
    } else if (centerBall < centerRacket - heightRacket / 4) {
      input.up = true;
    }
    return input;
  }
}
