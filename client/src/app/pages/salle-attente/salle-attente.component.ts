import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '@app/interfaces/player';
import { LimitedTimeLobbyService } from '@app/services/limited-time-lobby.service';
import { LobbyService } from '@app/services/lobby.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
    selector: 'app-salle-attente',
    templateUrl: './salle-attente.component.html',
    styleUrls: ['./salle-attente.component.scss'],
})
export class SalleAttenteComponent implements OnInit {
    playerQueue = new Map<string, Player>();
    host: boolean;
    // Nécéssaire pour que la page ait accès aux services nécéssaires
    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private socketService: SocketClientService,
        private loginService: LoginFormService,
        private lobbyService: LobbyService,
        private limitedTimeLobbyService: LimitedTimeLobbyService,
    ) {}

    ngOnInit(): void {
        this.host = this.lobbyService.host;
        if (this.host) {
            this.socketService.send('createLobby', {
                gameId: this.loginService.getGameId(),
                playerName: this.loginService.getFormData(),
                roomId: this.lobbyService.roomId,
            });
            this.socketService.on('updateQueue', (data: { newQueue: string }) => {
                const queueArray = JSON.parse(data.newQueue);
                this.playerQueue = new Map<string, Player>(queueArray);
            });
        } else if (this.loginService.getLimitedTimeGame()) {
            this.socketService.on('goToCoopGame', (data: { roomId: string; firstGame: number }) => {
                this.limitedTimeLobbyService.firstGame = data.firstGame;
                this.router.navigate(['/limitedOneVsOne']);
                this.limitedTimeLobbyService.roomId = data.roomId;
            });
            this.limitedTimeLobbyService.roomId = uuidv4();
            this.socketService.send('checkLimitedGame', {
                playerName: this.loginService.getFormData(),
                roomId: this.limitedTimeLobbyService.roomId,
            });
        } else {
            this.socketService.send('joinQueue', { gameId: this.loginService.getGameId(), playerName: this.loginService.getFormData() });
            this.refuseListen();
        }
        this.acceptListen();
    }

    cancel() {
        if (this.loginService.getLimitedTimeGame()) {
            this.goToHome();
        } else {
            this.goToGameSelection();
        }
    }

    goToGameSelection(): void {
        this.router.navigate(['/gameSelection']);
        this.socketService.send('removeFromQueue', { socketId: this.socketService.socket.id, gameId: this.lobbyService.roomId });
        this.socketService.disconnect();
    }

    goToHome() {
        this.router.navigate(['/home']);
        this.socketService.send('removeFromQueue', { socketId: this.socketService.socket.id, gameId: this.lobbyService.roomId });
        this.socketService.disconnect();
    }

    acceptListen() {
        this.socketService.on('goToGame', (data: { roomId: string }) => {
            this.router.navigate(['/oneVSone']);
            if (!this.lobbyService.host) {
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
