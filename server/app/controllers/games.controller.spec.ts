import { Application } from '@app/app';
import { GameData } from '@app/data/game.interface';
import { GameManager } from '@app/services/game-manager.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';
import { Constants } from '@common/constants';
import { GameConstantsService } from '@app/services/constants-manager.service';

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
            differences: [
                [
                    { x: 2, y: 2 },
                    { x: 3, y: 3 },
                ],
            ],
            isDifficult: false,
        },
    ] as GameData[];
    let gameService: SinonStubbedInstance<GameManager>;
    let gamesConstantsService: SinonStubbedInstance<GameConstantsService>;
    let expressApp: Express.Application;
    const baseConstants: Constants = {
        initTime: 30,
        penaltyTime: 5,
        timeBonus: 5,
    };

    beforeEach(async () => {
        gameService = createStubInstance(GameManager);
        gamesConstantsService = createStubInstance(GameConstantsService);
        gameService.getAllGames.resolves(gamesData);
        const app = Container.get(Application);
        Object.defineProperty(app['gamesController'], 'gameService', { value: gameService });
        // Object.defineProperty(app['gamesController'], 'gameConstantsService', { value: gamesConstantsService });
        expressApp = app.app;
    });

    afterEach(() => {
        gamesConstantsService.getGameConstants.restore();
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

    it('should return 404 not found if game not found on get request to /:id', async () => {
        gameService.getGamebyId.withArgs('2').resolves(undefined);
        return supertest(expressApp).get('/api/games/2').expect(HTTP_NOT_FOUND);
    });

    it('should return 500 error on invalid get request to /:id', async () => {
        const error = new Error('service error');
        gameService.getGamebyId.withArgs('2').throws(error);
        return supertest(expressApp).get('/api/games/2').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should store game on valid post request to /send', async () => {
        return supertest(expressApp).post('/api/games/send').expect(HTTP_STATUS_CREATED);
    });

    it('should return 500 error on invalid post request to /send', async () => {
        const error = new Error('service error');
        gameService.addGame.throws(error);
        return supertest(expressApp).post('/api/games/send').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should delete game on valid delete request to /:id', async () => {
        return supertest(expressApp).delete('/api/games/1').expect(HTTP_STATUS_OK);
    });

    it('should return 404 not found if game not found on delete request to /:id', async () => {
        gameService.deleteGame.withArgs('3').resolves(false);
        return supertest(expressApp).delete('/api/games/3').expect(HTTP_NOT_FOUND);
    });

    it('should return 500 error on invalid delete request to /:id', async () => {
        const error = new Error('service error');
        gameService.deleteGame.throws(error);
        return supertest(expressApp).delete('/api/games/1').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should return correct result on valid get request to /difference/:id', async () => {
        const expectedResult = true;
        const expectedIndex = 0;
        gameService.getGamebyId.withArgs('1').resolves(gamesData[1]);
        gameService.verificationInPicture.withArgs(2, 2, '1').resolves({ result: expectedResult, index: expectedIndex });
        return supertest(expressApp)
            .get('/api/games/difference/1')
            .send({ result: expectedResult, index: expectedIndex })
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_OK);
    });

    it('should return 500 error on invalid get request to /difference/:id', async () => {
        const error = new Error('service error');
        gameService.getGamebyId.throws(error);
        gameService.verificationInPicture.throws(error);
        return supertest(expressApp).get('/api/games/difference/1').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should add the game constants on valid post request to /games/constants', async () => {
        return await supertest(expressApp).post('/api/games/constants').send({ baseConstants }).expect(StatusCodes.OK);
    });
});
