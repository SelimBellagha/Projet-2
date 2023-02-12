import { Injectable } from '@angular/core';
import { GameData } from '@app/interfaces/game.interface';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class DisplayGameService {
    game: GameData;
    gameId: string;
    constructor(private comm: CommunicationService) {}

    loadGame() {
        this.comm.getGameById(this.gameId).subscribe((game) => (this.game = game));
        return this.game;
    }

    setGameId(id: string) {
        this.gameId = id;
    }
}
