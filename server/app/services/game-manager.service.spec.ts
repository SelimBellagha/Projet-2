import { GameData } from '@app/data/game.interface';
import { expect } from 'chai';
import { Container } from 'typedi';
import { GameManager } from './game-manager.service';
import * as path from 'path';
import * as fs from 'fs';

describe('Game service', () => {
    let gameService: GameManager;
    const restoreJsonPath = path.join(__dirname, '/initial_test_games.json');
    const testJsonPath = path.join(__dirname, '/games_test.json');
    let allGames: GameData[];

    beforeEach(async () => {
        gameService = Container.get(GameManager);
        gameService.jsonPath = restoreJsonPath;
        allGames = await gameService.getAllGames();
        gameService.jsonPath = testJsonPath;
    });

    afterEach(async () => {
        await restoreGames();
    });

    const restoreGames = async () => {
        const filePath = path.join(__dirname, '/games_test.json');
        await fs.promises.writeFile(filePath, JSON.stringify({ allGames }));
    };

    it('getAllGames should return all games', async () => {
        const result = await gameService.getAllGames();
        expect(result).to.eql(allGames);
    });

    it('getGameById should return the game by its ID', async () => {
        const result = await gameService.getGamebyId('1');
        expect(result).to.eql(allGames[1]);
    });

    it('addGame should add a game', async () => {
        const newGame: GameData = {
            id: '3',
            name: 'Game4',
            originalImage: '',
            modifiedImage: '',
            nbDifferences: 7,
            differences: [[]],
            isDifficult: true,
        };
        await gameService.addGame(newGame);
        gameService.getAllGames().then((result: GameData[]) => {
            expect(result[3]).to.equals(newGame);
        });
        await restoreGames();
    });

    it('deleteGame should delete a game', async () => {
        await gameService.deleteGame('2');
        const games = await gameService.getAllGames();
        expect(games.length).to.equal(2);
        await restoreGames();
    });

    it('deleteGame should not delete a game if id not found', async () => {
        const result = await gameService.deleteGame('12345');
        expect(result).to.equal(false);
        const games = await gameService.getAllGames();
        expect(games).to.deep.equal(allGames);
    });

    it('should return true and index if coordinates are in game', async () => {
        const res = await gameService.verificationInPicture(2, 2, '1');
        expect(res).to.eql({ result: true, index: 0 });
    });

    it('should return false and -1 if coordinates are not in game', async () => {
        const expectedResult = false;
        const expectedIndex = -1;
        gameService.verificationInPicture(3, 3, '2').then((res) => {
            expect(res).to.deep.equals({ result: expectedResult, index: expectedIndex });
        });
    });
});
