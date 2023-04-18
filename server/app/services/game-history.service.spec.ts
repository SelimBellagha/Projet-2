import { GameHistory } from '@app/data/game-history';
import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { Container } from 'typedi';
import { GamesHistory } from './game-history.service';

describe('Game History service', () => {
    let historyService: GamesHistory;
    const restoreJsonPath = path.join(__dirname, '/initial-history-test.json');
    const testJsonPath = path.join(__dirname, '/history-test.json');
    let gameHistory: GameHistory[];

    beforeEach(async () => {
        historyService = Container.get(GamesHistory);
        historyService.jsonPath = restoreJsonPath;
        gameHistory = await historyService.getAllHistory();
        historyService.jsonPath = testJsonPath;
    });

    afterEach(async () => {
        await restoreHistory();
    });

    const restoreHistory = async () => {
        const filePath = path.join(__dirname, '/history-test.json');
        await fs.promises.writeFile(filePath, JSON.stringify({ gameHistory }));
    };

    it('getAllHistory should return all histories', async () => {
        const result = await historyService.getAllHistory();
        expect(result).to.deep.equal(gameHistory);
    });

    it('addGameHistory should add a history', async () => {
        const newHistory: GameHistory = {
            startDate: 'testDate',
            gameLength: '0:19',
            gameMode: 'Temps Limite',
            namePlayer1: 'testName',
            namePlayer2: '',
            winnerName: '',
            nameAbandon: 'testName',
        };
        await historyService.addGameHistory(newHistory);
        historyService.getAllHistory().then((result: GameHistory[]) => {
            expect(result[3]).to.equals(newHistory);
        });
        await restoreHistory();
    });

    it('deleteAllHistory should delete all histories', async () => {
        await historyService.deleteAllHistory();
        const histories = await historyService.getAllHistory();
        expect(histories.length).to.equal(0);
        await restoreHistory();
    });
});
