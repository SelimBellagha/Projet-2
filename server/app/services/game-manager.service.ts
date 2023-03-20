import { GameData } from '@app/data/game.interface';
import { Service } from 'typedi';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Service()
export class GameManager {
    tempGame: GameData;
    jsonPath = path.join(__dirname + '../../../../../app/data/games.json');

    async writeToJsonFile(filePath: string, data: string) {
        return await fs.promises.writeFile(filePath, data);
    }

    async readJsonFile(filePath: string) {
        return await fs.promises.readFile(filePath);
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
        const gameId = String(uuidv4());
        newGame.id = gameId;
        allGames.push(newGame);
        this.writeToJsonFile(this.jsonPath, JSON.stringify({ allGames }));
    }

    async deleteGame(id: string): Promise<boolean> {
        const gamesData = await this.getAllGames();
        const gameToDelete = gamesData.find((games) => games.id === id);
        if (gameToDelete) {
            const allGames = gamesData.filter((games) => games.id !== id);
            const gamesToSave = JSON.stringify({ allGames });
            await this.writeToJsonFile(this.jsonPath, gamesToSave);
            return true;
        } else {
            return false;
        }
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
}
