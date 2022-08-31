import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:8080';
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  sendMessage(message: string) {
    this.socket.emit('msgToServer', message);
  }

  getMessage() {
    return new Observable((observer) => {
      this.socket.on('msgToClient', (message) => {
        observer.next(message);
      });
    });
  }
}
