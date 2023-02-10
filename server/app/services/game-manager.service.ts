/* eslint-disable @typescript-eslint/naming-convention */
import { BaseGame, Game } from '@app/data/game.interface';
import { Games } from '@app/data/games.interface';
import { Service } from 'typedi';

const gamesData: Games = {
    0: {
        id: '0',
        name: 'Jeu 1',
        originalImage: './assets/image_2_diff.bmp',
        modifiedImage: './assets/image_7_diff.bmp',
        differenceImage: '',
        nbDifferences: 7,
        differences: [],
        isDifficult: false,
    },
    1: {
        id: '1',
        name: 'Jeu 2',
        originalImage: './assets/image_3_diff_radius.bmp',
        modifiedImage: './assets/image_2_diff.bmp',
        differenceImage: '',
        nbDifferences: 7,
        differences: [],
        isDifficult: true,
    },
    2: {
        id: '2',
        name: 'Jeu 3',
        originalImage: './assets/image_7_diff.bmp',
        modifiedImage: './assets/image_12_diff.bmp',
        differenceImage: '',
        nbDifferences: 7,
        differences: [],
        isDifficult: true,
    },
    3: {
        id: '3',
        name: 'Jeu 4',
        originalImage: './assets/image_12_diff.bmp',
        modifiedImage: './assets/image_3_diff_radius.bmp',
        differenceImage: '',
        nbDifferences: 7,
        differences: [],
        isDifficult: false,
    },
};

@Service()
export class GameManager {
    countProperties() {
        return Object.keys(gamesData).length;
    }

    async getAllGames(): Promise<Game[]> {
        return Object.values(gamesData);
    }

    async getGamebyId(id: string): Promise<Game> {
        return gamesData[id];
    }

    async addGame(newGame: BaseGame): Promise<Game> {
        const id = this.countProperties() + 1;
        const gameId = String(id);
        gamesData[gameId] = {
            gameId,
            ...newGame,
        };
        return gamesData[id];
    }

    async deleteGame(id: string): Promise<null | void> {
        const gameToDelete = await this.getGamebyId(id);
        if (!gameToDelete) {
            return null;
        }
        delete gamesData[id];
    }

    /*
    async getAllGames(): Promise<Games> {
        const fileBuffer = await this.fileSystemManager.readFile(this.jsonPath);
        return JSON.parse(fileBuffer.toString()).games;
    }

    async getGamebyId(id: string): Promise<Game> {
        const allGames = await this.getAllGames();
        const game = allGames.find((games: Game) => games.id === id);
        return game;
    }

    async addGame(game: Game): Promise<Game> {
        const games = await this.getAllGames();
        game.id = randomUUID();
        games.push(game);
        await this.fileSystemManager.writeToJsonFile(this.jsonPath, JSON.stringify({ games }));
        return game;
    }

    async updateGame(game: Game): Promise<void> {
        const games = await this.getAllGames();
        const theGame = games.find((allGames: Game) => allGames.id === game.id);
        if (theGame) {
            theGame.name = game.name;
            theGame.isDifficult = game.isDifficult;
            await this.fileSystemManager.writeToJsonFile(this.jsonPath, JSON.stringify({ games }));
        }
    }

    async deleteGame(id: string): Promise<boolean> {
        const allGames = await this.getAllGames();
        const gameToDelete = allGames.find((game: Game) => game.id === id);
        if (gameToDelete) {
            const games = allGames.filter((game: Game) => game.id !== id);
            const gameToSave = JSON.stringify({ games }, null, 2);
            await this.fileSystemManager.writeToJsonFile(this.jsonPath, gameToSave);
            return true;
        } else {
            return false;
        }
    }
    */
}
