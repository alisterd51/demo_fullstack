import { IGameStates } from './interfaces/game-states.interface';
import { IGame } from './interfaces/game.interface';
import { IInput } from './interfaces/input.interface';
import { checkIntersection, IntersectionCheckResult } from 'line-intersect';
import { colinearPointWithinSegment } from 'line-intersect';

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

    const posBall = [this.game.states.ball.left, this.game.states.ball.top];
    const posNextBall = [
      posBall[0] + this.game.states.ballDirection[0],
      posBall[1] + this.game.states.ballDirection[1],
    ];
    const wallDown = [0, this.game.board.height - this.game.board.margin];
    const wallUp = [0, this.game.board.margin];
    const goalLeft = [-this.game.ball.diammeter, 0];
    const goalRight = [this.game.board.width + this.game.ball.diammeter, 0];
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
    let racketColision: IntersectionCheckResult;

    // dans la moitier gauche ou droite
    //  colision racket gauche
    //  colision racket droite

    if (1) {
    } else {
      this.game.states.ball.left += this.game.states.ballDirection[0];
      this.game.states.ball.top += this.game.states.ballDirection[1];
    }
    // si direction vers le bas
    //  mur bas
    // apply racket colision
    // apply goal and update score
  }

  private wallColision(
    posBall: number[],
    posNextBall: number[],
    wallDown: number[],
    wallUp: number[],
  ): IntersectionCheckResult {
    if (posBall[1] < posNextBall[1]) {
      return checkIntersection(
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
      return checkIntersection(
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
  }

  private goalColision(
    posBall: number[],
    posNextBall: number[],
    goalLeft: number[],
    goalRight: number[],
  ): IntersectionCheckResult {
    if (posBall[0] > posNextBall[0]) {
      return checkIntersection(
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
      return checkIntersection(
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
  }

  private isInclude(num: number, limiteA: number, limiteB: number): boolean {
    if (
      (limiteA <= limiteB && limiteA <= num && num <= limiteB) ||
      (limiteB <= limiteA && limiteB <= num && num <= limiteA)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // a remplacer par colinearPointWithinSegment

  private segmentColision(
    lineX1: number,
    lineY1: number,
    lineX2: number,
    lineY2: number,
    segmentX1: number,
    segmentY1: number,
    segmentX2: number,
    segmentY2: number,
  ): IntersectionCheckResult {
    const interLine: IntersectionCheckResult = checkIntersection(
      lineX1,
      lineY1,
      lineX2,
      lineY2,
      segmentX1,
      segmentY1,
      segmentX2,
      segmentY2,
    );
    if (
      interLine.type == 'intersecting' &&
      this.isInclude(interLine.point.x, segmentX1, segmentX2) &&
      this.isInclude(interLine.point.y, segmentY1, segmentY2)
    ) {
      return interLine;
    } else {
      return { type: 'none' };
    }
  }

  private rectangleColision(
    posBall: number[],
    posNextBall: number[],
    recLeft: number,
    recRight: number,
    recTop: number,
    recDown: number,
  ): IntersectionCheckResult {
    //on test les 4 segment
    //on renvoi l'inter la plus pertinante
    return { type: 'none' };
  }
}
