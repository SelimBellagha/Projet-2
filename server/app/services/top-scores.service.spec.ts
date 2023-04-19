import { TopScore } from '@app/data/top-scores.interface';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as spies from 'chai-spies';
import { describe } from 'mocha';
import * as path from 'path';
import { DatabaseServiceMock } from './database.service.mock';
import { TopScoresService } from './top-scores.service';
chai.use(spies);
chai.use(chaiAsPromised); // this allows us to test for rejection

const mockPath = path.join(__dirname + '../../../app/data/default_scores.json');

describe('Score service', () => {
    let scoreService: TopScoresService;
    let databaseService: DatabaseServiceMock;
    // let client: MongoClient;
    let testScores: TopScore[];

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        await databaseService.start();
        scoreService = new TopScoresService(databaseService as never);
        testScores = [
            {
                position: '2',
                gameId: 'defaultID',
                gameType: 'solo',
                time: '1:30',
                playerName: 'TestName',
            },
            {
                position: '1',
                gameId: 'defaultID',
                gameType: 'solo',
                time: '0:30',
                playerName: 'TestName2',
            },
            {
                position: '3',
                gameId: 'defaultID',
                gameType: 'solo',
                time: '2:30',
                playerName: 'TestName2',
            },
        ];
        await scoreService.collection.insertMany(testScores);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all scores from DB', async () => {
        const scores = await scoreService.getAllTopScores();
        expect(scores.length).to.equal(3);
        expect(testScores).to.deep.equals(scores);
    });

    it('should sort scores with same id and type from DB', async () => {
        const scores = await scoreService.sortTopScores('defaultID', 'solo');
        expect(scores.length).to.equal(3);
        expect([testScores[1], testScores[0], testScores[2]]).to.deep.equals(scores);
    });

    it('should return "-1" if new score doesnt beat current scores', async () => {
        const newScore = {
            position: '1',
            gameId: 'defaultID',
            gameType: 'solo',
            time: '4:00',
            playerName: 'TestName2',
        };
        const result = await scoreService.validateScore(newScore);
        expect(result).to.deep.equals('-1');
    });

    it('should return "-1" if new score doesnt beat current scores because it is equal to an existing score', async () => {
        const newScore = {
            position: '1',
            gameId: 'defaultID',
            gameType: 'solo',
            time: '1:30',
            playerName: 'TestName2',
        };
        const result = await scoreService.validateScore(newScore);
        expect(result).to.deep.equals('-1');
    });

    it('should return index to replace if new score beats current score', async () => {
        const newScore = {
            position: '1',
            gameId: 'defaultID',
            gameType: 'solo',
            time: '0:20',
            playerName: 'TestName2',
        };
        const result = await scoreService.validateScore(newScore);
        expect(result).to.deep.equals('1');
    });

    it('should return true and "1" if new score beats current 1st place score', async () => {
        const newScore = {
            position: 'defaultPosition',
            gameId: 'defaultID',
            gameType: 'solo',
            time: '0:20',
            playerName: 'TestName2',
        };
        const result = await scoreService.addScore(newScore);
        expect(result).to.deep.equals({ isAdded: true, positionIndex: '1' });
    });

    it('should return true and "2" if new score beats current 2nd place score', async () => {
        const newScore = {
            position: 'defaultPosition',
            gameId: 'defaultID',
            gameType: 'solo',
            time: '1:10',
            playerName: 'TestName2',
        };
        const result = await scoreService.addScore(newScore);
        expect(result).to.deep.equals({ isAdded: true, positionIndex: '2' });
    });

    it('should return true and "3" if new score beats current 3rd place score', async () => {
        const newScore = {
            position: 'defaultPosition',
            gameId: 'defaultID',
            gameType: 'solo',
            time: '1:35',
            playerName: 'TestName2',
        };
        const result = await scoreService.addScore(newScore);
        expect(result).to.deep.equals({ isAdded: true, positionIndex: '3' });
    });

    it('should return false and "-1" if new score is not added to best scores', async () => {
        const newScore = {
            position: '1',
            gameId: 'defaultID',
            gameType: 'solo',
            time: '4:00',
            playerName: 'TestName2',
        };
        const result = await scoreService.addScore(newScore);
        expect(result).to.deep.equals({ isAdded: false, positionIndex: '-1' });
    });

    it('should delete existing scores for given game id', async () => {
        await scoreService.deleteGameScores('defaultID');
        const scores = await scoreService.collection.find({}).toArray();
        expect(scores.length).to.equal(0);
    });

    it('should reset scores for given game id', async () => {
        scoreService.jsonPath = mockPath;
        await scoreService.resetOneGame('defaultID');
        const scores = await scoreService.getAllTopScores();
        const defaultScoresLength = 6;
        expect(scores.length).to.equal(defaultScoresLength);
    });

    it('should add default scores for a given game', async () => {
        scoreService.jsonPath = mockPath;
        await scoreService.addDefaultScores('defaultID');
        const scores = await scoreService.getAllTopScores();
        const expectedScoresLength = 9; // default scores + existing 3 scores
        expect(scores.length).to.equal(expectedScoresLength);
    });
});
