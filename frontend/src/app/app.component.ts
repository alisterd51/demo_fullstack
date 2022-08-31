import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'todo-app';
  message: string = '';
  messages: string[] = [];

  constructor(private socketService: SocketService) {}

  sendMessage() {
    this.socketService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.socketService.getMessage().subscribe((message: any) => {
      this.messages.push(message);
    });
  }
  //la fonction d'envoie de msg doit etre deplacer dans un component dedier
}
