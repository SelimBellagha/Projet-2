import { Application } from '@app/app';
import { GameHistory } from '@app/data/game-history';
import { GamesHistory } from '@app/services/game-history.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_CREATED = StatusCodes.CREATED;
const HTTP_SERVER_ERROR = StatusCodes.INTERNAL_SERVER_ERROR;

describe('HistoryController', () => {
    const allHistory = [
        {
            startDate: '4/15/2023, 10:37:06 PM',
            gameLength: '0:18',
            gameMode: 'Classique',
            namePlayer1: 'Asimina',
            namePlayer2: '',
            winnerName: '',
            nameAbandon: '',
        },
        {
            startDate: '4/15/2023, 10:37:38 PM',
            gameLength: '0:54',
            gameMode: 'Classique',
            namePlayer1: 'Asiiii',
            namePlayer2: '',
            winnerName: '',
            nameAbandon: 'Asiiii',
        },
        {
            startDate: '4/17/2023, 10:52:40 AM',
            gameLength: '0:02',
            gameMode: 'Classique',
            namePlayer1: 'Asimina',
            namePlayer2: '',
            winnerName: '',
            nameAbandon: 'Asimina',
        },
        {
            startDate: '4/17/2023, 10:56:23 AM',
            gameLength: '0:19',
            gameMode: 'Temps Limite',
            namePlayer1: 'Asimina',
            namePlayer2: '',
            winnerName: '',
            nameAbandon: 'Asimina',
        },
    ] as GameHistory[];
    const newHistory: GameHistory = {
        startDate: 'testDate',
        gameLength: '0:19',
        gameMode: 'Temps Limite',
        namePlayer1: 'testName',
        namePlayer2: '',
        winnerName: '',
        nameAbandon: 'testName',
    };
    let historyService: SinonStubbedInstance<GamesHistory>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        historyService = createStubInstance(GamesHistory);
        historyService.getAllHistory.resolves(allHistory);
        const app = Container.get(Application);
        Object.defineProperty(app['historyController'], 'historyService', { value: historyService });
        expressApp = app.app;
    });

    it('should return an array of game histories on valid get request to /history', async () => {
        return supertest(expressApp)
            .get('/api/history/')
            .send(allHistory)
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(allHistory);
            });
    });

    it('should return 500 error on invalid get request to /scores', async () => {
        const error = new Error('service error');
        historyService.getAllHistory.throws(error);
        return supertest(expressApp).get('/api/history/').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should store history on valid post request to /history', async () => {
        return supertest(expressApp).post('/api/history/').send(newHistory).expect(HTTP_STATUS_CREATED);
    });

    it('should return 500 error on invalid post request to /history', async () => {
        const error = new Error('service error');
        historyService.addGameHistory.throws(error);
        return supertest(expressApp).post('/api/history/').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should delete all histories on valid delete request to /history', async () => {
        return supertest(expressApp).delete('/api/history/').expect(HTTP_STATUS_OK);
    });

    it('should return 500 error on invalid delete request to /history', async () => {
        const error = new Error('service error');
        historyService.deleteAllHistory.throws(error);
        return supertest(expressApp).delete('/api/history/').send(error.message).expect(HTTP_SERVER_ERROR);
    });
});
