import { DATABASE_NAME, DATABASE_URL } from '@app/data/db-constants';
import { TopScore } from '@app/data/top-scores.interface';
import { Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;

    get database(): Db {
        return this.db;
    }

    async start(databaseUrl: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            this.client = new MongoClient(databaseUrl);
            await this.client.connect();
            this.db = this.client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateDB(collectionName: string, data: TopScore[]): Promise<void> {
        const collection = this.db.collection(collectionName);
        if ((await collection.find({}).toArray()).length === 0) {
            await collection.insertMany(data);
        }
    }
}
