import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { IGameStates } from '../pong/pong/interfaces/game-states.interface';
import { IInput } from '../pong/pong/interfaces/input.interface';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private url = 'https://localhost:8081';
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  sendMessage(message: string): void {
    this.socket.emit('msgToServer', message);
  }

  getMessage(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('msgToClient', (message) => {
        observer.next(message);
      });
    });
  }

  sendMove(move: IInput): void {
    this.socket.emit('moveToServer', move);
  }

  getMove(): Observable<IInput> {
    return new Observable<IInput>((observer) => {
      this.socket.on('moveToClient', (message) => {
        observer.next(message);
      });
    });
  }

  sendGameStates(gameStates: IGameStates): void {
    this.socket.emit('gameStatesToServer', gameStates);
  }

  getGameStates(): Observable<IGameStates> {
    return new Observable<IGameStates>((observer) => {
      this.socket.on('gameStatesToClient', (message) => {
        observer.next(message);
      });
    });
  }

  sendStart(): void {
    this.socket.emit('startToServer');
  }

  getStart() {
    return new Observable<void>((observer) => {
      this.socket.on('startToClient', (payload) => {
        observer.next(payload);
      });
    });
  }
}
