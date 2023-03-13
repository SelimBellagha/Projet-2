import { GameData } from '@app/data/game.interface';
import { Service } from 'typedi';

@Service()
export class GameManager {
    gamesData: GameData[] = [];

    countProperties() {
        return this.gamesData.length;
    }

    async getAllGames(): Promise<GameData[]> {
        return this.gamesData;
    }

    async getGamebyId(id: string): Promise<GameData> {
        return this.gamesData[id];
    }

    async addGame(newGame: GameData): Promise<void> {
        const id = this.countProperties();
        const gameId = String(id);
        newGame.id = gameId;
        this.gamesData[id] = newGame;
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
