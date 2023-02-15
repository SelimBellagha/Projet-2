import { Application } from '@app/app';
import { GameData } from '@app/data/game.interface';
import { GameManager } from '@app/services/game-manager.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_CREATED = StatusCodes.CREATED;
const HTTP_SERVER_ERROR = StatusCodes.INTERNAL_SERVER_ERROR;
const HTTP_NOT_FOUND = StatusCodes.NOT_FOUND;

describe('GameController', () => {
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
    const game = {
        id: '1',
        name: 'testGame',
        originalImage: '',
        modifiedImage: '',
        nbDifferences: 8,
        differences: [],
        isDifficult: false,
    } as GameData;
    let gameService: SinonStubbedInstance<GameManager>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gameService = createStubInstance(GameManager);
        gameService.getAllGames.resolves(gamesData);
        gameService.addGame.resolves(game);
        const app = Container.get(Application);
        Object.defineProperty(app['gamesController'], 'gameService', { value: gameService });
        expressApp = app.app;
    });

    it('should return an array of games on valid get request to /games', async () => {
        return supertest(expressApp)
            .get('/api/games/')
            .send(gamesData)
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(gamesData);
            });
    });

    it('should return 500 error on invalid get request to /games', async () => {
        const error = new Error('service error');
        gameService.getAllGames.throws(error);
        return supertest(expressApp).get('/api/games/').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should return game from game service on valid get request to root', async () => {
        gameService.getGamebyId.withArgs('0').resolves(gamesData[0]);
        return supertest(expressApp)
            .get('/api/games/0')
            .send(gamesData[0])
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(gamesData[0]);
            });
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
        return supertest(expressApp).post('/api/games/send').send(game).set('Accept', 'application/json').expect(HTTP_STATUS_CREATED);
    });

    it('should return 500 error on invalid post request to /send', async () => {
        const error = new Error('service error');
        gameService.addGame.throws(error);
        return supertest(expressApp).post('/api/games/send').send(error.message).expect(HTTP_SERVER_ERROR);
    });
});
