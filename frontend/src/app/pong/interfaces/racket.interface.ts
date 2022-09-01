import { IMove } from "./move.interface";

export interface IRacket {
    playerName: string;
    backgroundColor: string;
    top: number;
    left: number;
    height: number;
    width: number;
    toUpKey: string;
    toDownKey: string;
    levelAi: number;
    mode: string;
    move: IMove;
    prevMove: IMove;
    moveRemote: IMove; //a supprimer
}
