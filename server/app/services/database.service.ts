import { Db, MongoClient } from 'mongodb';
import { DATABASE_URL } from '@app/data/db-constants';
import { Service } from 'typedi';
import { TopScore } from '@app/data/top-scores.interface';

@Service()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;

    get database(): Db {
        return this.db;
    }

    async start(): Promise<MongoClient | null> {
        try {
            this.client = new MongoClient(DATABASE_URL);
            await this.client.connect();
            this.db = this.client.db(process.env.DATABASE_NAME);
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
