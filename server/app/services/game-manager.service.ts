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
}
