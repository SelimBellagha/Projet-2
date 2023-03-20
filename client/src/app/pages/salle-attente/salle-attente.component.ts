import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '@app/interfaces/player';
import { LobbyService } from '@app/services/lobby.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
@Component({
    selector: 'app-salle-attente',
    templateUrl: './salle-attente.component.html',
    styleUrls: ['./salle-attente.component.scss'],
})
export class SalleAttenteComponent implements OnInit {
    playerQueue = new Map<string, Player>();
    host: boolean;
    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private socketService: SocketClientService,
        private loginService: LoginFormService,
        private lobbyService: LobbyService,
    ) {}

    ngOnInit(): void {
        this.host = this.lobbyService.host;
        if (this.host) {
            // TODO verifier ou va get form data
            this.socketService.send('createLobby', {
                gameId: this.loginService.getGameId(),
                playerName: this.loginService.getFormData(),
                roomId: this.lobbyService.roomId,
            });
            this.socketService.on('updateQueue', (data: { newQueue: string }) => {
                const queueArray = JSON.parse(data.newQueue);
                this.playerQueue = new Map<string, Player>(queueArray);
            });
        } else {
            this.socketService.send('joinQueue', { gameId: this.loginService.getGameId(), playerName: this.loginService.getFormData() });
            this.refuseListen();
        }
        this.acceptListen();
    }

    goToGameSelection(): void {
        this.router.navigate(['/gameSelection']);
        this.socketService.send('removeFromQueue', { socketId: this.socketService.socket.id, gameId: this.lobbyService.roomId });
        this.socketService.disconnect();
    }

    acceptListen() {
        this.socketService.on('goToGame', (data: { roomId: string }) => {
            this.router.navigate(['/oneVSone']);
            if (this.lobbyService.host === false) {
                this.lobbyService.roomId = data.roomId;
            }
        });
    }

    refuseListen() {
        this.socketService.on('refused', () => {
            this.router.navigate(['/gameSelection']);
        });
    }
}
