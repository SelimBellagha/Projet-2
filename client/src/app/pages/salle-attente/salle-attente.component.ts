import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '@app/interfaces/player';
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
    constructor(private router: Router, private socketService: SocketClientService, private loginService: LoginFormService) {}

    ngOnInit(): void {
        this.host = this.loginService.getPlayerType();
        if (this.host) {
            this.socketService.send('createLobby', { gameId: this.loginService.getGameId(), playerName: this.loginService.getFormData() });
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
        this.socketService.send('removeFromQueue', { socketId: this.socketService.socket.id, gameId: this.loginService.getGameId() });
        this.socketService.disconnect();
    }

    acceptListen() {
        this.socketService.on('goToGame', () => {
            // this.router.navigate(['/1v1']);
        });
    }

    refuseListen() {
        this.socketService.on('refused', () => {
            this.router.navigate(['/home']);
        });
    }
}
