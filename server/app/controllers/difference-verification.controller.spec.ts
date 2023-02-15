import { Application } from '@app/app';
import { GameData } from '@app/data/game.interface';
import { GameManager } from '@app/services/game-manager.service';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_SERVER_ERROR = StatusCodes.INTERNAL_SERVER_ERROR;

describe('DifferenceVerificationController', () => {
    const gamesData = [
        {
            id: '0',
            name: 'game1',
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
    let gameManager: SinonStubbedInstance<GameManager>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gameManager = createStubInstance(GameManager);
        gameManager.getAllGames.resolves(gamesData);
        const app = Container.get(Application);
        Object.defineProperty(app['differenceController'], 'gameManager', { value: gameManager });
        expressApp = app.app;
    });

    it('should return correct result on valid get request to /difference/:id', async () => {
        const expectedResult = true;
        const expectedIndex = 0;
        gameManager.getGamebyId.withArgs('1').resolves(gamesData[1]);
        gameManager.verificationInPicture.withArgs(2, 2, '1').resolves({ result: expectedResult, index: expectedIndex });
        return supertest(expressApp)
            .get('/api/difference/1')
            .send({ result: expectedResult, index: expectedIndex })
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_OK);
    });

    it('should return 500 error on invalid get request to /difference/:id', async () => {
        const error = new Error('service error');
        gameManager.getGamebyId.throws(error);
        gameManager.verificationInPicture.throws(error);
        return supertest(expressApp).get('/api/difference/1').send(error.message).expect(HTTP_SERVER_ERROR);
    });
});
