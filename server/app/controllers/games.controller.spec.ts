/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/naming-convention */
import { Application } from '@app/app';
import { GameData } from '@app/data/game.interface';
import { GameManager } from '@app/services/game-manager.service';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';
// import sinon = require('sinon');

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_CREATED = StatusCodes.CREATED;
const HTTP_SERVER_ERROR = StatusCodes.INTERNAL_SERVER_ERROR;
const HTTP_NOT_FOUND = StatusCodes.NOT_FOUND;

describe('GameController', async () => {
    let gameService: SinonStubbedInstance<GameManager>;
    const gamesData = [
        {
            id: '0',
            name: 'game1',
            originalImage: '',
            modifiedImage: '',
            nbDifferences: 8,
            differences: [],
            isDifficult: false,
        },
        {
            id: '1',
            name: 'game2',
            originalImage: '',
            modifiedImage: '',
            nbDifferences: 8,
            differences: [],
            isDifficult: false,
        },
    ] as GameData[];
    let expressApp: Express.Application;

    beforeEach(async () => {
        gameService = createStubInstance(GameManager);
        const app = Container.get(Application);
        expressApp = app.app;
    });

    it('should return an array of games on valid get request to /games', async () => {
        gameService.getAllGames.resolves(gamesData);
        return supertest(expressApp).get('/api/games/').send(gamesData).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });

    it('should return 500 error on invalid get request to /games', async () => {
        const error = new Error('service error');
        gameService.getAllGames.throws(error);
        return supertest(expressApp).get('/api/games/').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should return game from game service on valid get request to root', async () => {
        gameService.getGamebyId.withArgs('1').resolves(gamesData[1]);
        return supertest(expressApp).get('/api/games/1').send(gamesData[1]).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });

    it('should return 404 not found if game not found', async () => {
        gameService.getGamebyId.withArgs('2').resolves(undefined);
        return supertest(expressApp).get('/api/games/2').expect(HTTP_NOT_FOUND);
    });

    it('should return 500 error on invalid get request to /:id', async () => {
        const error = new Error('service error');
        gameService.getGamebyId.withArgs('2').throws(error);
        return supertest(expressApp).get('/api/games/2').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should store game in the array on valid post request to /send', async () => {
        const game: GameData = {
            id: '1',
            name: 'testGame',
            originalImage: '',
            modifiedImage: '',
            nbDifferences: 8,
            differences: [],
            isDifficult: false,
        };
        return supertest(expressApp).post('/api/games/send').send(game).set('Accept', 'application/json').expect(HTTP_STATUS_CREATED);
    });

    it('should return 500 error on invalid post request to /send', async () => {
        const game: GameData = {
            id: '1',
            name: 'testGame',
            originalImage: '',
            modifiedImage: '',
            nbDifferences: 8,
            differences: [],
            isDifficult: false,
        };
        const error = new Error('service error');
        gameService.addGame.withArgs(game).throws(error);
        return supertest(expressApp).post('/api/games/send').send(error.message).expect(HTTP_SERVER_ERROR);
    });
});
