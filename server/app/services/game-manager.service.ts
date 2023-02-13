import { GameData } from '@app/data/game.interface';
import { Service } from 'typedi';

@Service()
export class GameManager {
    gamesData: GameData[] = [];

    countProperties() {
        return Object.keys(this.gamesData).length;
    }

    async getAllGames(): Promise<GameData[]> {
        return Object.values(this.gamesData);
    }

    async getGamebyId(id: string): Promise<GameData> {
        return this.gamesData[id];
    }

    async addGame(newGame: GameData): Promise<GameData> {
        const id = this.countProperties() + 1;
        const gameId = String(id);
        newGame.id = gameId;
        this.gamesData[id] = newGame;
        return this.gamesData[id];
    }

    async deleteGame(id: string): Promise<null | void> {
        const gameToDelete = await this.getGamebyId(id);
        if (!gameToDelete) {
            return null;
        }
        delete this.gamesData[id];
    }

    async verificationInPicture(positionX: number, positionY: number, id: string) {
        const clickPosition = { x: positionX, y: positionY };
        const game = await this.getGamebyId(id);
        for (let i = 0; i < game.nbDifferences; i++) {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < game.differences[i].length; j++) {
                if (clickPosition.x === game.differences[i][j].x && game.differences[i][j].y === clickPosition.y) {
                    return {
                        result: true,
                        index: i,
                    };
                }
            }
        }
        return {
            result: false,
            index: -1,
        };
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
    }*/
}
