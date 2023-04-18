import { Injectable } from '@angular/core';
import { GameData, TopScore } from '@app/interfaces/game.interface';
import { Game } from '@app/pages/selection-page-component/selection-page-component.component';
import { firstValueFrom } from 'rxjs';
import { CommunicationService } from './communication.service';
import { SocketClientService } from './socket-client-service.service';

@Injectable({
    providedIn: 'root',
})
export class DisplayGameService {
    game: GameData;
    games: Game[] = [];
    tempGames: GameData[] = [];
    gameId: string;
    soloScores: TopScore[] = [];
    oneVOneScores: TopScore[] = [];
    isScoreAdded: boolean = false;
    constructor(private comm: CommunicationService, private socketService: SocketClientService) {}

    loadGame(gameId: string) {
        return this.comm.getGameById(`${gameId}`).subscribe((game: GameData) => (this.game = game));
    }

    async loadAllGames() {
        const source = this.comm.getAllGames();
        this.tempGames = await firstValueFrom(source);
        await this.convertAllGames();
    }

    resetAllScores() {
        for (const game of this.tempGames) {
            this.comm.resetGameScores(game.id);
        }
    }

    checkPlayerScore(newScore: TopScore) {
        this.comm.addScore(newScore).subscribe((added: boolean) => this.sendGlobalMessage(added));
    }

    sendGlobalMessage(isNewScore: boolean) {
        console.log('mouad zamel');
        this.socketService.send('globalMessage', isNewScore);
        this.isScoreAdded = isNewScore;
    }

    convertDifficulty(game: GameData) {
        if (game.isDifficult) {
            return 'difficile';
        } else {
            return 'facile';
        }
    }

    async updateLobbyAvailability() {
        for (const game of this.games) {
            game.playerInGame = await this.getPlayersInGame(game.id);
        }
    }

    async convertAllGames() {
        const tempArray: Game[] = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.tempGames.length; i++) {
            const game = this.tempGames[i];
            const playersInGame = await this.getPlayersInGame(game.id);
            const gameInformation: Game = {
                id: game.id,
                title: game.name,
                difficulty: this.convertDifficulty(game),
                image: game.originalImage,
                playerInGame: playersInGame,
            };
            tempArray.push(gameInformation);
        }
        this.games = tempArray;
    }

    setGameId(id: string) {
        this.gameId = id;
    }

    async getPlayersInGame(gameId: string): Promise<string> {
        return new Promise<string>((resolve) => {
            // eslint-disable-next-line object-shorthand
            this.socketService.send('checkPlayersInGame', { gameId });
            this.socketService.on('playersInGame', (data: { playersNumber: string }) => {
                resolve(data.playersNumber);
            });
        });
    }
}
