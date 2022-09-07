import { IGameStates } from './interfaces/game-states.interface';
import { IGame } from './interfaces/game.interface';
import { IInput } from './interfaces/input.interface';
import {
  checkIntersection,
  IntersectionCheckResult,
  colinearPointWithinSegment,
} from 'line-intersect';
import { lineAngle, Point, pointTranslate } from 'geometric';
import { Injectable } from '@angular/core';

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
export class Game {
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

  public constructor() {
  }

  public tick(): void {
    if (this.game.states.start && this.getWinner() == null) {
      this.moveRacketLeft();
      this.moveRacketRight();
      this.moveBall();
    }
  }

  public updateInput(input: IInput): void {
    if (this.game.inputLeft.userId === input.userId) {
      this.game.inputLeft = input;
    } else if (this.game.inputRight.userId === input.userId) {
      this.game.inputRight = input;
    }
  }

  public start(): void {
    this.game.states.start = !this.game.states.start;
  }

  public updateAll(game: IGame): void {
    this.game = game;
  }

  public updateStates(states: IGameStates): void {
    this.game.states = states;
  }

  public getGameStates(): IGameStates {
    return this.game.states;
  }

  public getAll(): IGame {
    return this.game;
  }

  public getWinner(): number | null {
    if (this.game.states.scoreLeft >= this.game.scoreToWin) {
      return this.game.userIdLeft;
    } else if (this.game.states.scoreRight >= this.game.scoreToWin) {
      return this.game.userIdRight;
    } else {
      return null;
    }
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
    // cas1: on ne touche rien:
    //  la ball se teleporte a sa nouvelle position
    // cas2: la ball vas traverser un mur:
    //  postion de la ball = point d'intersect
    //  direction de la ball = inversion de la distance en y
    // cas3: la ball vas toucher une racket:
    //  postion de la ball = point d'intersect
    //  direction de la ball = new direc en fonction de l'angle ball/racket
    // cas4: la ball vas sortir du terrain:
    //  update du score
    //  newBall
    // cas5: la ball est coincer entre une racket et un mur:
    //  la ball se teleporte a gauche ou droite de la racket
    // apply next position
    // apply wall colision
    // si direction vers le haut
    //  mur haut

    // trouver s'il y a une colision et deduire la nouvel position/vitesse

    const posBall: Point = [
      this.game.states.ball.left,
      this.game.states.ball.top,
    ];
    const posNextBall: Point = [
      posBall[0] + this.game.states.ballDirection[0],
      posBall[1] + this.game.states.ballDirection[1],
    ];
    const wallDown: Point = [
      0,
      this.game.board.height - this.game.board.margin,
    ];
    const wallUp: Point = [0, this.game.board.margin];
    const goalLeft: Point = [-this.game.ball.diammeter, 0];
    const goalRight: Point = [
      this.game.board.width + this.game.ball.diammeter,
      0,
    ];
    const wallColision: IntersectionCheckResult = this.wallColision(
      posBall,
      posNextBall,
      wallDown,
      wallUp,
    );
    const goalColision: IntersectionCheckResult = this.goalColision(
      posBall,
      posNextBall,
      goalLeft,
      goalRight,
    );
    const racketColision: IntersectionCheckResult = this.racketColision(
      posBall,
      posNextBall,
    );
    const collision = this.nearestCollision(posBall, [
      wallColision,
      goalColision,
      racketColision,
    ]);

    if (collision.type === 'intersecting') {
      if (collision == wallColision) {
        this.game.states.ball.left = collision.point.x;
        this.game.states.ball.top = collision.point.y;
        this.game.states.ballDirection[1] *= -1;
      } else if (collision == goalColision) {
        if (collision.point.x < this.game.board.width / 2) {
          this.game.states.scoreLeft++;
        } else {
          this.game.states.scoreRight++;
        }
        this.newBall();
      } else if (collision == racketColision) {
        this.game.states.ball.left = collision.point.x;
        this.game.states.ball.top = collision.point.y;
        this.game.states.ballDirection = this.bounceTrajectory();
      }
    } else {
      this.game.states.ball.left += this.game.states.ballDirection[0];
      this.game.states.ball.top += this.game.states.ballDirection[1];
    }
  }

  private bounceTrajectory(): Point {
    const centerBall: Point = [
      this.game.states.ball.left + this.game.ball.diammeter / 2,
      this.game.states.ball.top + this.game.ball.diammeter / 2,
    ];
    let centerRacket: Point;
    if (centerBall[0] < this.game.board.width / 2) {
      centerRacket = [
        this.game.states.racketLeft.left + this.game.racketLeft.width / 2,
        this.game.states.racketLeft.top + this.game.racketLeft.height / 2,
      ];
    } else {
      centerRacket = [
        this.game.states.racketLeft.left + this.game.racketLeft.width / 2,
        this.game.states.racketLeft.top + this.game.racketLeft.height / 2,
      ];
    }
    let angle = lineAngle([centerRacket, centerBall]);
    if (80 <= angle && angle <= 90) {
      angle = 80;
    } else if (90 <= angle && angle <= 100) {
      angle = 100;
    } else if (260 <= angle && angle <= 270) {
      angle = 260;
    } else if (270 <= angle && angle <= 280) {
      angle = 280;
    }
    return pointTranslate([0, 0], angle, this.game.ball.speed);
  }

  private newBall(): void {
    this.game.states.ball.left =
      (this.game.board.width + this.game.ball.diammeter) / 2;
    this.game.states.ball.top =
      (this.game.board.height + this.game.ball.diammeter) / 2;
    if ((this.game.states.scoreLeft + this.game.states.scoreRight) % 2) {
      this.game.states.ballDirection = [this.game.ball.speed / 2, 0];
    } else {
      this.game.states.ballDirection = [-this.game.ball.speed / 2, 0];
    }
  }

  private wallColision(
    posBall: Point,
    posNextBall: Point,
    wallDown: Point,
    wallUp: Point,
  ): IntersectionCheckResult {
    let colision: IntersectionCheckResult;
    if (posBall[1] < posNextBall[1]) {
      colision = checkIntersection(
        posBall[0] + this.game.ball.diammeter,
        posBall[1] + this.game.ball.diammeter,
        posNextBall[0] + this.game.ball.diammeter,
        posNextBall[1] + this.game.ball.diammeter,
        wallDown[0],
        wallDown[1],
        wallDown[0] + 1,
        wallDown[1],
      );
    } else {
      colision = checkIntersection(
        posBall[0],
        posBall[1],
        posNextBall[0],
        posNextBall[1],
        wallUp[0],
        wallUp[1],
        wallUp[0] + 1,
        wallUp[1],
      );
    }
    if (
      colision.type === 'intersecting' &&
      colinearPointWithinSegment(
        colision.point.x,
        colision.point.y,
        posBall[0],
        posBall[1],
        posNextBall[0],
        posNextBall[1],
      )
    ) {
      return colision;
    } else {
      return { type: 'none' };
    }
  }

  private goalColision(
    posBall: Point,
    posNextBall: Point,
    goalLeft: Point,
    goalRight: Point,
  ): IntersectionCheckResult {
    let colision: IntersectionCheckResult;
    if (posBall[0] > posNextBall[0]) {
      colision = checkIntersection(
        posBall[0],
        posBall[1],
        posNextBall[0],
        posNextBall[1],
        goalLeft[0],
        goalLeft[1],
        goalLeft[0],
        goalLeft[1] + 1,
      );
    } else {
      colision = checkIntersection(
        posBall[0],
        posBall[1],
        posNextBall[0],
        posNextBall[1],
        goalRight[0],
        goalRight[1],
        goalRight[0],
        goalRight[1] + 1,
      );
    }
    if (
      colision.type === 'intersecting' &&
      colinearPointWithinSegment(
        colision.point.x,
        colision.point.y,
        posBall[0],
        posBall[1],
        posNextBall[0],
        posNextBall[1],
      )
    ) {
      return colision;
    } else {
      return { type: 'none' };
    }
  }

  private segmentColision(
    startX1: number,
    startY1: number,
    endX2: number,
    endY2: number,
    segmentX1: number,
    segmentY1: number,
    segmentX2: number,
    segmentY2: number,
  ): IntersectionCheckResult {
    const interLine: IntersectionCheckResult = checkIntersection(
      startX1,
      startY1,
      endX2,
      endY2,
      segmentX1,
      segmentY1,
      segmentX2,
      segmentY2,
    );
    if (
      interLine.type == 'intersecting' &&
      colinearPointWithinSegment(
        interLine.point.x,
        interLine.point.y,
        segmentX1,
        segmentY1,
        segmentX2,
        segmentY2,
      ) &&
      colinearPointWithinSegment(
        interLine.point.x,
        interLine.point.y,
        startX1,
        startY1,
        endX2,
        endY2,
      )
    ) {
      return interLine;
    } else {
      return { type: 'none' };
    }
  }

  private distance(x1: number, x2: number, y1: number, y2: number) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  private rectangleColision(
    posBall: Point,
    posNextBall: Point,
    recLeft: number,
    recRight: number,
    recTop: number,
    recDown: number,
  ): IntersectionCheckResult {
    const leftColistion = this.segmentColision(
      posBall[0],
      posBall[1],
      posNextBall[0],
      posNextBall[1],
      recLeft,
      recTop,
      recLeft,
      recDown,
    );
    const rightColistion = this.segmentColision(
      posBall[0],
      posBall[1],
      posNextBall[0],
      posNextBall[1],
      recRight,
      recTop,
      recRight,
      recDown,
    );
    const topColistion = this.segmentColision(
      posBall[0],
      posBall[1],
      posNextBall[0],
      posNextBall[1],
      recLeft,
      recTop,
      recRight,
      recTop,
    );
    const downColistion = this.segmentColision(
      posBall[0],
      posBall[1],
      posNextBall[0],
      posNextBall[1],
      recLeft,
      recDown,
      recRight,
      recDown,
    );
    return this.nearestCollision(posBall, [
      leftColistion,
      rightColistion,
      topColistion,
      downColistion,
    ]);
  }

  // colision la plus proche
  private nearestCollision(
    posBall: Point,
    collisions: IntersectionCheckResult[],
  ): IntersectionCheckResult {
    let collisionMin: IntersectionCheckResult = { type: 'none' };
    let distanceMin = Number.MAX_VALUE;
    for (let index = 0; index < collisions.length; index++) {
      const collision = collisions[index];
      if (collision.type === 'intersecting') {
        const distance = this.distance(
          posBall[0],
          collision.point.x,
          posBall[1],
          collision.point.y,
        );
        if (distance < distanceMin) {
          distanceMin = distance;
          collisionMin = collision;
        }
      }
    }
    return collisionMin;
  }

  private racketColision(
    posBall: Point,
    posNextBall: Point,
  ): IntersectionCheckResult {
    if (posNextBall[0] < this.game.board.width) {
      return this.rectangleColision(
        posBall,
        posNextBall,
        this.game.states.racketLeft.left - this.game.ball.diammeter,
        this.game.states.racketLeft.left + this.game.racketLeft.width,
        this.game.states.racketLeft.top - this.game.ball.diammeter,
        this.game.states.racketLeft.top + this.game.racketLeft.height,
      );
    } else {
      return this.rectangleColision(
        posBall,
        posNextBall,
        this.game.states.racketRight.left - this.game.ball.diammeter,
        this.game.states.racketRight.left + this.game.racketRight.width,
        this.game.states.racketRight.top - this.game.ball.diammeter,
        this.game.states.racketRight.top + this.game.racketRight.height,
      );
    }
  }
}