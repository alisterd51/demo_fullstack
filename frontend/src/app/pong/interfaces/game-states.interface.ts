import { IPosition } from "./position.interface";

export interface IGameStates {
    gameId: number;
    racketLeft: IPosition;
    racketRight: IPosition;
    ball: IPosition;
    scoreLeft: number;
    scoreRight: number;
}
