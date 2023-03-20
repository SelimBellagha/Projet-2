import { Component, Input } from '@angular/core';
import { LobbyService } from '@app/services/lobby.service';
import { SocketClientService } from '@app/services/socket-client-service.service';

@Component({
    selector: 'app-join-bar',
    templateUrl: './join-bar.component.html',
    styleUrls: ['./join-bar.component.scss'],
})
export class JoinBarComponent {
    @Input() nomJoueur: string;
    @Input() socketId: string;

    constructor(private socketService: SocketClientService, private lobbyService: LobbyService) {}

    refusePlayer() {
        this.socketService.send('removeFromQueue', { socketId: this.socketId, gameId: this.lobbyService.roomId });
    }

    acceptPlayer() {
        this.socketService.send('addToRoom', { opponentId: this.socketId, roomId: this.lobbyService.roomId });
        this.lobbyService.addOpponent(this.nomJoueur, this.socketId);
    }
}
