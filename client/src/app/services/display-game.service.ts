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
    constructor(private comm: CommunicationService, private socketService: SocketClientService) {}

    loadGame(gameId: string) {
        return this.comm.getGameById(`${gameId}`).subscribe((game: GameData) => (this.game = game));
    }

    async loadAllGames() {
        const source = this.comm.getAllGames();
        this.tempGames = await firstValueFrom(source);
        await this.convertAllGames();
    }

    loadScores(gameId: string) {
        /*
        const source = this.comm.getGameScores(gameId, "solo");
        this.soloScores = await firstValueFrom(source);
        const source2 = this.comm.getGameScores(gameId, "1v1");
        this.oneVOneScores = await firstValueFrom(source2);
        */
        this.comm.getGameScores(gameId, 'solo').subscribe((scores: TopScore[]) => (this.soloScores = scores));
        this.comm.getGameScores(gameId, '1v1').subscribe((scores: TopScore[]) => (this.oneVOneScores = scores));
    }

    convertDifficulty(game: GameData) {
        if (game.isDifficult) {
            return 'difficile';
        } else {
            return 'facile';
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
