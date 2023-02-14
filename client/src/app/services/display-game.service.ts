import { Injectable } from '@angular/core';
import { GameData } from '@app/interfaces/game.interface';
import { Game } from '@app/pages/selection-page-component/selection-page-component.component';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class DisplayGameService {
    game: GameData;
    games: Game[] = [];
    tempGames: GameData[] = [];
    gameId: string;
    constructor(private comm: CommunicationService) {}

    loadGame(gameId: number) {
        return this.comm.getGameById(`${gameId}`).subscribe((game) => (this.game = game));
    }

    loadAllGames() {
        this.comm.getAllGames().subscribe((game) => (this.tempGames = game));
        this.convertAllGames();
    }

    convertDifficulty(game: GameData) {
        if (game.isDifficult) {
            return 'Niveau: difficile';
        } else {
            return 'Niveau: facile';
        }
    }

    convertAllGames() {
        const tempArray: Game[] = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.tempGames.length; i++) {
            const game = this.tempGames[i];
            const gameInformation: Game = {
                id: game.id,
                title: game.name,
                difficulty: this.convertDifficulty(game),
                image: game.originalImage,
            };
            tempArray.push(gameInformation);
        }
        this.games = tempArray;
    }

    setGameId(id: string) {
        this.gameId = id;
    }
}
