import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { IMove } from '../pong/interfaces/move.interface';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private url = 'http://localhost:8080';
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

  sendMove(move: IMove): void {
    this.socket.emit('moveToServer', move);
  }

  getMove(): Observable<IMove> {
    return new Observable<IMove>((observer) => {
      this.socket.on('moveToClient', (message) => {
        observer.next(message);
      });
    });
  }
}
