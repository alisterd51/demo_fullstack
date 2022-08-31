import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: String[] = [];

  constructor(/*private socketService: SocketService*/) { }

  ngOnInit(): void {
    /*this.socketService.listenMsg().subscribe((data: any) => {
      this.messages = data
    })
  */}
/*
  handleMsg(message: string) {
    this.socketService.emitMsg(message);
  }
*/
}
