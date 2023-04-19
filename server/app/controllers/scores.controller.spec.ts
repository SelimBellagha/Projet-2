import { Application } from '@app/app';
import { TopScore } from '@app/data/top-scores.interface';
import { TopScoresService } from '@app/services/top-scores.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_CREATED = StatusCodes.CREATED;
const HTTP_SERVER_ERROR = StatusCodes.INTERNAL_SERVER_ERROR;

describe('ScoresController', () => {
    const topScores = [
        { position: '3', gameId: 'defaultID', gameType: 'solo', time: '2:30', playerName: 'Mario' },
        { position: '2', gameId: 'defaultID', gameType: 'solo', time: '2:15', playerName: 'Luigi' },
        { position: '1', gameId: 'defaultID', gameType: 'solo', time: '2:00', playerName: 'Minnie' },
        { position: '3', gameId: 'defaultID', gameType: '1v1', time: '2:30', playerName: 'Mickey' },
        { position: '2', gameId: 'defaultID', gameType: '1v1', time: '2:15', playerName: 'Daisy' },
        { position: '1', gameId: 'defaultID', gameType: '1v1', time: '2:00', playerName: 'Pluto' },
    ] as TopScore[];
    // const newScore: TopScore = {
    //     position: '1',
    //     gameId: 'defaultID',
    //     gameType: 'solo',
    //     time: '1:30',
    //     playerName: 'TestName',
    // };
    let scoreService: SinonStubbedInstance<TopScoresService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        scoreService = createStubInstance(TopScoresService);
        scoreService.getAllTopScores.resolves(topScores);
        const app = Container.get(Application);
        Object.defineProperty(app['scoresController'], 'scoreService', { value: scoreService });
        expressApp = app.app;
    });

    it('should return an array of scores on valid get request to /scores', async () => {
        return supertest(expressApp)
            .get('/api/scores/')
            .send(topScores)
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(topScores);
            });
    });

    it('should return 500 error on invalid get request to /scores', async () => {
        const error = new Error('service error');
        scoreService.getAllTopScores.throws(error);
        return supertest(expressApp).get('/api/scores/').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should return scores from score service on valid get request to root', async () => {
        scoreService.sortTopScores.withArgs('defaultID', 'solo').resolves(topScores);
        return supertest(expressApp)
            .get('/api/scores/defaultID/solo')
            .send(topScores)
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(topScores);
            });
    });

    it('should return 500 error on invalid get request to /:gameId/:gameType', async () => {
        const error = new Error('service error');
        scoreService.sortTopScores.withArgs('defaultID', 'solo').throws(error);
        return supertest(expressApp).get('/api/scores/defaultID/solo').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    // it('should store score on valid post request to /scores', async () => {
    //     scoreService.addScore.withArgs(newScore).resolves(true);
    //     return supertest(expressApp)
    //         .post('/api/scores/')
    //         .send(newScore)
    //         .expect(HTTP_STATUS_CREATED)
    //         .then((response) => {
    //             expect(response.body).to.deep.equal(true);
    //         });
    // });

    // it('should store score on valid post request to /scores', async () => {
    //     scoreService.addScore.withArgs(newScore).resolves(false);
    //     return supertest(expressApp)
    //         .post('/api/scores/')
    //         .send(newScore)
    //         .expect(HTTP_STATUS_OK)
    //         .then((response) => {
    //             expect(response.body).to.deep.equal(false);
    //         });
    // });

    it('should return 500 error on invalid post request to /scores', async () => {
        const error = new Error('service error');
        scoreService.addScore.throws(error);
        return supertest(expressApp).post('/api/scores/').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should store default scores on valid post request to /scores/:gameId', async () => {
        scoreService.addDefaultScores.withArgs('defaultID');
        return supertest(expressApp).post('/api/scores/defaultID').expect(HTTP_STATUS_CREATED);
    });

    it('should return 500 error on invalid post request to /scores/:gameId', async () => {
        const error = new Error('service error');
        scoreService.addDefaultScores.withArgs('defaultID').throws(error);
        return supertest(expressApp).post('/api/scores/defaultID').send(error.message).expect(HTTP_SERVER_ERROR);
    });

    it('should reset scores of a game on valid delete request to /:gameId', async () => {
        scoreService.resetOneGame.withArgs('defaultID');
        return supertest(expressApp).delete('/api/scores/defaultID').expect(HTTP_STATUS_OK);
    });

    it('should return 500 error on invalid delete request to /:gameId', async () => {
        const error = new Error('service error');
        scoreService.resetOneGame.throws(error);
        return supertest(expressApp).delete('/api/scores/defaultID').send(error.message).expect(HTTP_SERVER_ERROR);
    });
});
