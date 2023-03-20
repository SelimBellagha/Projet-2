import { Injectable } from '@angular/core';
import { Player } from '@app/interfaces/player';
import { SocketClientService } from './socket-client-service.service';

@Injectable({
    providedIn: 'root',
})
export class LobbyService {
    opponent: Player;
    gameId: string;
    roomId: string;
    host: boolean = false;
    constructor(private socketService: SocketClientService) {}

    deleteLobby() {
        if (this.roomId) {
            this.socketService.send('deleteLobby', { roomId: this.roomId });
        }
    }

    addOpponent(opponentName: string, opponentId: string) {
        this.opponent = {
            playerName: opponentName,
            socketId: opponentId,
        };
    }
}
