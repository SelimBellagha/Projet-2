import { GameHistory } from '@app/data/game-history';
import * as fs from 'fs';
import * as path from 'path';
import { Service } from 'typedi';

@Service()
export class GamesHistory {
    jsonPath = path.join(__dirname + '../../../../../app/data/history.json');

    async writeToJsonFile(filePath: string, data: string) {
        return await fs.promises.writeFile(filePath, data);
    }

    async readJsonFile(filePath: string) {
        return await fs.promises.readFile(filePath);
    }

    async getAllHistory(): Promise<GameHistory[]> {
        const fileBuffer = await this.readJsonFile(this.jsonPath);
        return JSON.parse(fileBuffer.toString()).gameHistory;
    }

    async addGameHistory(newGameHistory: GameHistory): Promise<void> {
        const gameHistory = await this.getAllHistory();
        gameHistory.push(newGameHistory);
        this.writeToJsonFile(this.jsonPath, JSON.stringify({ gameHistory }));
    }

    async deleteAllHistory(): Promise<void> {
        const emptyHistory: GameHistory[] = [];
        await this.writeToJsonFile(this.jsonPath, JSON.stringify({ gameHistory: emptyHistory }));
    }
}
