import { IBallConfig } from './ball-config.interface';
import { IBoardConfig } from './board-config.interface';
import { IGameStates } from './game-states.interface';
import { IInput } from './input.interface';
import { IRacketConfig } from './racket-config.interface';

export interface IGame {
  userIdLeft: number;
  userIdRight: number;
  gameId: number;
  scoreToWin: number;
  board: IBoardConfig;
  racketLeft: IRacketConfig;
  racketRight: IRacketConfig;
  inputLeft: IInput;
  inputRight: IInput;
  ball: IBallConfig;
  states: IGameStates;
}
