/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, OnInit } from '@angular/core';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Message } from '@common/chatMessage';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})

export class ChatBoxComponent implements OnInit {
    gameId: string;
    messages: Message[] = [];
    message: string = '';

    constructor(public socketService: SocketClientService, private gameUtils: LoginFormService) {}

    ngOnInit() {
        if (!this.socketService.isSocketAlive()) {
            this.socketService.connect();
        }
        this.gameId = this.gameUtils.getGameId()    

        this.socketService.on('receiveChatMessage', (data: Message) => {
        this.messages.push(data);
        });
        
        this.socketService.on('receiveSystemMessage', (systemMessage: string) => {
          const name = ""
            const message: Message = {
                text: systemMessage,
                roomId: this.gameId,
                isSender: true,
                isSystem: true,
                name: name
                
            };
            console.log(name)
            this.messages.push(message);
        });

        
    }

    onKeyDown(event: Event): void {
        if (event instanceof KeyboardEvent && event.key === 'Enter') {
            this.addMessage();
        }
    }

    addMessage() {
        const message: Message = {
            text: this.message,
            roomId: this.gameId,
            isSender: true,
            isSystem: false,
            name: ""
            };
        this.message = '';
        this.socketService.send('sendChatToServer', message);        
    }

    getCurrentTime(): string {
        const now = new Date();
        const hours = this.formatTime(now.getHours());
        const minutes = this.formatTime(now.getMinutes());
        const seconds = this.formatTime(now.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    }

    formatTime(time: number): string {
        return time < 10 ? `0${time}` : `${time}`;
    }
}