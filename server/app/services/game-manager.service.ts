import { GameData } from '@app/data/game.interface';
import { Service } from 'typedi';
import * as fs from 'fs';
import * as path from 'path';

@Service()
export class GameManager {
    gamesData: GameData[] = [];
    tempGame: GameData;
    jsonPath = path.join(__dirname + '../../../../../app/data/games.json');
    idCount: number = 1;
    async countProperties() {
        const games = await this.getAllGames();
        return games.length;
    }

    async getAllGames(): Promise<GameData[]> {
        const fileBuffer = await this.readJsonFile(this.jsonPath);
        return JSON.parse(fileBuffer.toString()).allGames;
    }

    async getGamebyId(id: string): Promise<GameData> {
        const gamesData = await this.getAllGames();
        const game = gamesData.find((games) => games.id === id);
        return game!;
    }

    async addGame(newGame: GameData): Promise<void> {
        const allGames = await this.getAllGames();
        this.idCount++;
        const gameId = String(this.idCount);
        newGame.id = gameId;
        this.gamesData[gameId] = newGame;
        allGames.push(newGame);
        this.writeToJsonFile(this.jsonPath, JSON.stringify({ allGames }));
    }

    async writeToJsonFile(filePath: string, data: string) {
        return await fs.promises.writeFile(filePath, data);
    }

    async readJsonFile(filePath: string) {
        return await fs.promises.readFile(filePath);
    }
    /* async deleteGame(id: string): Promise<null | void> {
        const gameToDelete = await this.getGamebyId(id);
        if (!gameToDelete) {
            return null;
        }
        delete this.gamesData[id];
    }
    */

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
}
