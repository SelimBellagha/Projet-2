/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createStubInstance } from 'sinon';
import { DatabaseServiceMock } from './database.service.mock';
chai.use(chaiAsPromised);

describe('Database Service Mock', () => {
    let databaseServiceMock: DatabaseServiceMock;

    beforeEach(async () => {
        databaseServiceMock = new DatabaseServiceMock();
        // Start a local test server
        await MongoMemoryServer.create();
    });

    afterEach(async () => {
        if (databaseServiceMock['client']) {
            await databaseServiceMock['client'].close();
        }
    });

    it('should not create a new client if client already exists', async () => {
        const mockClient = createStubInstance(MongoClient);
        databaseServiceMock['client'] = mockClient;
        await databaseServiceMock.start();
        expect(databaseServiceMock['client']).to.equal(mockClient);
        expect(databaseServiceMock['db']).to.be.undefined;
    });

    it('should connect to the database when start is called', async () => {
        await databaseServiceMock.start();
        expect(databaseServiceMock['client']).to.not.be.undefined;
        expect(databaseServiceMock['db'].databaseName).to.equal('database');
    });

    it('closeConnection should call client.close()', async () => {
        const stubMongo = createStubInstance(MongoClient);
        (databaseServiceMock['client'] as unknown) = stubMongo;

        await databaseServiceMock.closeConnection();
        // eslint-disable-next-line deprecation/deprecation
        expect(stubMongo.close.calledOnce).to.be.true;
    });

    it('should close database connection and return a resolved Promise', async () => {
        const result = await databaseServiceMock.closeConnection();

        expect(result).to.be.undefined;
        await expect(databaseServiceMock.closeConnection()).to.be.fulfilled;
    });
});
