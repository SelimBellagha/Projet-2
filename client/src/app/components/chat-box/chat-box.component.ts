/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSaverService } from '@app/services/action-saver.service';
import { LoginFormService } from '@app/services/login-form.service';
import { MouseFocusService } from '@app/services/mouse-focus.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Message } from '@common/chatMessage';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    @ViewChild('chatInput') chatInput: ElementRef;

    gameId: string;
    messages: Message[] = [];
    message: string = '';
    pageName: string | undefined;

    // eslint-disable-next-line max-params
    constructor(
        public route: ActivatedRoute,
        public socketService: SocketClientService,
        private gameUtils: LoginFormService,
        private mouseFocus: MouseFocusService,
        private actionSaver: ActionSaverService,
    ) {
        const snapshot = route.snapshot;
        this.pageName = snapshot.routeConfig?.path?.toString();
    }
    /*
    ngAfterViewInit() {
        this.chatInput.nativeElement.addEventListener('focus', () => {
            this.mouseFocus.isFocusOnchat = true;
        });

        this.chatInput.nativeElement.addEventListener('blur', () => {
            this.mouseFocus.isFocusOnchat = false;
        });
    }*/

    ngOnInit() {
        this.socketService.connect();
        this.gameId = this.gameUtils.getGameId();
        this.handleSockets();
        this.actionSaver.messages = this.messages;
    }
    onFocus() {
        this.mouseFocus.isFocusOnchat = true;
    }
    onBlur() {
        this.mouseFocus.isFocusOnchat = false;
    }

    handleSockets() {
        this.socketService.on('receiveChatMessage', (data: Message) => {
            this.actionSaver.addChatMessageAction(data);
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
            this.actionSaver.addChatMessageAction(message);
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
            if (!this.isMultiplayerMode()) {
                this.messages.push(message);
                this.actionSaver.addChatMessageAction(message);
            }
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
        return this.pageName === 'oneVSone' || this.pageName === 'limitedOneVsOne';
    }
}
