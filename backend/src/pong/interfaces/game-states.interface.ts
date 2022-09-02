import { IPosition } from './position.interface';

export interface IGameStates {
  gameId: number;
  racketLeft: IPosition;
  racketRight: IPosition;
  ball: IPosition;
  ballDirection: number[];
  scoreLeft: number;
  scoreRight: number;
  start: boolean;
}
