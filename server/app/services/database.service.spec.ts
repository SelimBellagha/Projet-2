/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
import { DATABASE_COLLECTION, DATABASE_NAME } from '@app/data/db-constants';
import { TopScore } from '@app/data/top-scores.interface';
import { fail } from 'assert';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createStubInstance } from 'sinon';
import { DatabaseService } from './database.service';
chai.use(chaiAsPromised);

const TEST_DATA: TopScore[] = [
    { gameId: '1234', gameType: 'solo', playerName: 'TestName', time: '1:30', position: '1' },
    { gameId: '1234', gameType: 'solo', playerName: 'TestName2', time: '2:30', position: '2' },
    { gameId: '1234', gameType: 'solo', playerName: 'TestName3', time: '3:30', position: '3' },
];

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        databaseService = new DatabaseService();
        // Start a local test server
        mongoServer = await MongoMemoryServer.create();
    });

    afterEach(async () => {
        if (databaseService['client']) {
            await databaseService['client'].close();
        }
    });

    it('should connect to the database when start is called', async () => {
        const mongoUri = mongoServer.getUri();
        await databaseService.start(mongoUri);
        expect(databaseService['client']).to.not.be.undefined;
        expect(databaseService['db'].databaseName).to.equal(DATABASE_NAME);
    });

    it('should not connect to the database when start is called with wrong URL', async () => {
        databaseService['mongoClient'] = undefined as unknown as MongoClient;
        try {
            await databaseService.start('WRONG URL');
            fail();
        } catch {
            expect(databaseService['client']).to.be.undefined;
        }
        const mongoUri = mongoServer.getUri();
        await databaseService.start(mongoUri);
    });

    it('should populate the database with a helper function', async () => {
        const mongoUri = mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService['db'] = client.db(DATABASE_NAME);

        await databaseService.populateDB(DATABASE_COLLECTION, TEST_DATA);
        const highScores = await databaseService.database.collection(DATABASE_COLLECTION).find({}).toArray();
        expect(highScores.length).to.equal(TEST_DATA.length);
    });

    it('should not populate the database with start function if it is already populated', async () => {
        const mongoUri = mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService['db'] = client.db(DATABASE_NAME);
        await databaseService.populateDB(DATABASE_COLLECTION, TEST_DATA);
        let highScores = await databaseService.database.collection('topScores').find({}).toArray();
        expect(highScores.length).to.equal(TEST_DATA.length);
        await databaseService.populateDB(DATABASE_COLLECTION, TEST_DATA);
        highScores = await databaseService.database.collection('topScores').find({}).toArray();
        expect(highScores.length).to.equal(TEST_DATA.length);
    });

    it('closeConnection should call client.close()', async () => {
        const stubMongo = createStubInstance(MongoClient);
        (databaseService['client'] as unknown) = stubMongo;

        await databaseService.closeConnection();
        // eslint-disable-next-line deprecation/deprecation
        expect(stubMongo.close.calledOnce).to.be.true;
    });
});
