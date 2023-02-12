import { Injectable } from '@angular/core';
import { Game } from '@app/interfaces/game';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class DisplayGameService {
    game: Game;
    constructor(private comm: CommunicationService) {}

    loadGame(id: string) {
        this.comm.getGameById(id).subscribe((game) => (this.game = game));
        return this.game;
    }
}
