/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Message } from '@common/chatMessage';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    gameId: string;
    messages: Message[] = [];
    message: string = '';
    pageName: string | undefined;

    constructor(public route: ActivatedRoute, public socketService: SocketClientService, private gameUtils: LoginFormService) {
        const snapshot = route.snapshot;
        this.pageName = snapshot.routeConfig?.path?.toString();
    }

    ngOnInit() {
        this.socketService.connect();
        this.gameId = this.gameUtils.getGameId();
        this.handleSockets();
    }

    handleSockets() {
        this.socketService.on('receiveChatMessage', (data: Message) => {
            this.messages.push(data);
        });

        this.socketService.on('receiveSystemMessage', (systemMessage: string) => {
            const name = '';
            const message: Message = {
                text: systemMessage,
                roomId: this.gameId,
                isSender: true,
                isSystem: true,
                name,
            };
            this.messages.push(message);
        });

        this.socketService.on('receiveSystemMessageSolo', (systemMessage: string) => {
            const name = '';
            const message: Message = {
                text: systemMessage,
                roomId: this.gameId,
                isSender: true,
                isSystem: true,
                name,
            };
            if (!this.isMultiplayerMode()) this.messages.push(message);
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
            name: '',
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

    isMultiplayerMode() {
        return this.pageName === 'oneVSone';
    }
}
