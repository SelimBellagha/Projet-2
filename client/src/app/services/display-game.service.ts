import { Injectable } from '@angular/core';
import { GameData } from '@app/interfaces/game.interface';
import { Game } from '@app/pages/selection-page-component/selection-page-component.component';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class DisplayGameService {
    game: GameData;
    games: Game[];
    tempGames: GameData[];
    gameId: string;
    constructor(private comm: CommunicationService) {}

    loadGame(gameId: number) {
        // this.comm.getGameById(this.gameId).subscribe((game) => (this.game = game));
        return this.comm.getGameById(`${gameId}`).subscribe((game) => (this.game = game));
    }

    loadAllGames() {
        this.comm.getAllGames().subscribe((game) => (this.tempGames = game));
    }

    convertDifficulty(game: GameData) {
        if (game.isDifficult) {
            return 'Niveau: difficile';
        } else {
            return 'Niveau: facile';
        }
    }

    convertAllGames() {
        for (const game of this.tempGames) {
            const a: Game = {
                id: game.id,
                title: game.name,
                difficulty: this.convertDifficulty(game),
                image: game.originalImage,
            };
            this.games.push(a);
        }
    }

    setGameId(id: string) {
        this.gameId = id;
    }
}
