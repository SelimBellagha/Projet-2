import { GameData } from '@app/data/game.interface';
import { expect } from 'chai';
import { Container } from 'typedi';
import { GameManager } from './game-manager.service';

describe('Example service', () => {
    let gameService: GameManager;

    beforeEach(async () => {
        gameService = Container.get(GameManager);
        gameService.gamesData = [
            { id: '0', name: 'game0', originalImage: '', modifiedImage: '', nbDifferences: 8, differences: [], isDifficult: false },
            {
                id: '1',
                name: 'game2',
                originalImage: '',
                modifiedImage: '',
                nbDifferences: 8,
                differences: [
                    [
                        { x: 2, y: 2 },
                        { x: 3, y: 3 },
                    ],
                ],
                isDifficult: false,
            },
        ];
    });

    it('should return a number if countProperties is called', () => {
        const nbProperties = gameService.countProperties();
        expect(nbProperties).to.equals(2);
    });

    it('should return an array of games', (done: Mocha.Done) => {
        gameService.getAllGames().then((result: GameData[]) => {
            expect(result).to.equals(gameService.gamesData);
            done();
        });
    });

    it('should return the game by its ID', (done: Mocha.Done) => {
        gameService.getGamebyId('0').then((result: GameData) => {
            expect(result).to.equals(gameService.gamesData[0]);
            done();
        });
    });

    it('should store a game', (done: Mocha.Done) => {
        const newGame: GameData = {
            id: '2',
            name: 'Game3',
            originalImage: '',
            modifiedImage: '',
            nbDifferences: 8,
            differences: [],
            isDifficult: false,
        };
        gameService.addGame(newGame);
        expect(gameService.gamesData[2]).to.equals(newGame);
        done();
    });
    it('should return true and index if coordinates are in game', () => {
        gameService.verificationInPicture(2, 2, '1').then((res) => {
            expect(res).to.equal({ result: true, index: 0 });
        });
    });
    it('should return false and -1 if coordinates are not in game', () => {
        const expectedResult = false;
        const expectedIndex = 0;
        gameService.verificationInPicture(2, 1, '1').then((res) => {
            expect(res).to.equal({ result: expectedResult, index: expectedIndex });
        });
    });
});
