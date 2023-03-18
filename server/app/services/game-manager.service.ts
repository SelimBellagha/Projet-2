import { GameData } from '@app/data/game.interface';
import { Service } from 'typedi';
const fs = require('fs');

@Service()
export class GameManager {
    gamesData: GameData[] = [];
    tempGame: GameData;
    jsonPath = "C:/Users/asimi/OneDrive/Desktop/projet2/LOG2990-109/server/app/data/games.json";

    countProperties() {
        return this.gamesData.length;
    }

    async getAllGames(): Promise<GameData[]> {
        const fileBuffer = await this.readJsonFile(this.jsonPath);
        return JSON.parse(fileBuffer).allGames;
        // return this.gamesData;
    }

    async getGamebyId(id: string): Promise<GameData> {
        const gamesData = await this.getAllGames();
        const game = gamesData.find((games) => games.id === id);
        return game!;
        /*
        this.tempGame.id = game?.id!;
        this.tempGame.name = game?.name!;
        this.tempGame.originalImage = game?.originalImage!;
        this.tempGame.modifiedImage = game?.modifiedImage!;
        this.tempGame.nbDifferences = game?.nbDifferences!;
        this.tempGame.differences = game?.differences!;
        this.tempGame.isDifficult = game?.isDifficult!;
        return this.tempGame;*/
        // return this.gamesData[id];
    }

    async addGame(newGame: GameData): Promise<void> {
        const allGames = await this.getAllGames();
        const id = this.countProperties();
        const gameId = String(id);
        newGame.id = gameId;
        this.gamesData[id] = newGame;
        allGames.push(newGame);
        this.writeToJsonFile(this.jsonPath, JSON.stringify( {allGames} ));
    }

    async writeToJsonFile(path: string, data: string) {
        return await fs.promises.writeFile(path, data);
    }

    async readJsonFile (path: string) {
        return await fs.promises.readFile(path);
      }
    /*
    async deleteGame(id: string): Promise<null | void> {
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
