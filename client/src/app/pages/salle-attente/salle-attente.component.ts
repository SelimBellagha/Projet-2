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
    playerQueue: Map<string, Player>;
    host: boolean;
    constructor(private router: Router, private socketService: SocketClientService, private loginService: LoginFormService) {}

    ngOnInit(): void {
        this.host = this.loginService.getPlayerType();
        if (this.host) {
            this.socketService.send('createLobby', { gameId: this.loginService.getGameId(), playerName: this.loginService.getFormData() });
            this.socketService.on('updateQueue', (data: { newQueue: string }) => {
                const queueArray = JSON.parse(data.newQueue);
                this.playerQueue = new Map<string, Player>(queueArray);
                console.log(queueArray);
            });
        } else {
            this.socketService.send('joinQueue', { gameId: this.loginService.getGameId(), playerName: this.loginService.getFormData() });
        }
    }

    goToGameSelection(): void {
        this.router.navigate(['/gameSelection']);
        this.socketService.disconnect();
        // this.socketService.send('leaveRoom', { roomName: this.displayService.game.id });
    }
}
