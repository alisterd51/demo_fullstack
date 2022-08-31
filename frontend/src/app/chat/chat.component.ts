import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  message: string = '';
  messages: String[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.getMessage().subscribe((message: any) => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    this.socketService.sendMessage(this.message);
    this.message = '';
  }
}
