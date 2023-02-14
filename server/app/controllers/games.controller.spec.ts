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

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_CREATED = StatusCodes.CREATED;
// const HTTP_SERVER_ERROR = StatusCodes.INTERNAL_SERVER_ERROR;
// const HTTP_NOT_FOUND = StatusCodes.NOT_FOUND;

describe('GameController', async () => {
    const baseGame = {
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
        const app = Container.get(Application);
        expressApp = app.app;
    });

    it('should return an array of games on valid get request to /games', async () => {
        gameService.getAllGames.resolves([baseGame, baseGame]);
        return supertest(expressApp).get('/api/games/').send([baseGame, baseGame]).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });
    /*
    it('should return 500 error on invalid get request to /games', async () => {
        const error = new Error('server error');
        gameService.getAllGames.rejects(error);
        return supertest(expressApp)
            .get('/api/games')
            .expect(HTTP_SERVER_ERROR)
            .then((response) => {
                chai.expect(response.body.message).to.equal(error.message);
            });
    });

    it('should return game from game service on valid get request to root', async () => {
        gameService.getGamebyId.withArgs('1').resolves(baseGame);
        const res = await supertest(expressApp).get('/api/games/1').send(baseGame).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
        expect(res.body).to.deep.equal(baseGame);
    });
    */

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

    it('should return error on invalid post request to /send', async () => {});
});
