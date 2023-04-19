import { DATABASE_COLLECTION } from '@app/data/db-constants';
import { AddedScoreResult, TopScore } from '@app/data/top-scores.interface';
import * as fs from 'fs';
import { Collection } from 'mongodb';
import * as path from 'path';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';
@Service()
export class TopScoresService {
    gameScores: TopScore[] = [];
    jsonPath = path.join(__dirname + '../../../../../app/data/default_scores.json');
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<TopScore> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    static async readJsonFile(filePath: string) {
        return await fs.promises.readFile(filePath);
    }

    private static async getDefaultScores(jsonPath: string): Promise<TopScore[]> {
        const fileBuffer = await TopScoresService.readJsonFile(jsonPath);
        return JSON.parse(fileBuffer.toString()).defaultScores;
    }

    async getAllTopScores(): Promise<TopScore[]> {
        this.gameScores = await this.collection.find({}).toArray();

        return this.collection
            .find({})
            .toArray()
            .then((scores: TopScore[]) => {
                return scores;
            });
    }

    async sortTopScores(id: string, type: string): Promise<TopScore[]> {
        return this.collection
            .find({ gameId: id, gameType: type })
            .sort({ time: 1 })
            .toArray()
            .then((scores: TopScore[]) => {
                return scores;
            });
    }

    async validateScore(newScore: TopScore): Promise<string> {
        const currentScores = await this.sortTopScores(newScore.gameId, newScore.gameType);
        let indexVal = '-1';
        for (const score of currentScores) {
            if (score.time === newScore.time) {
                return indexVal;
            }
        }
        for (const score of currentScores) {
            if (score.time > newScore.time) {
                indexVal = score.position;
                break;
            }
        }
        return indexVal;
    }

    async addScore(newScore: TopScore): Promise<AddedScoreResult> {
        const indexToReplace = await this.validateScore(newScore);
        const noScoreChange = '-1';
        if (indexToReplace !== noScoreChange) {
            switch (indexToReplace) {
                case '1': {
                    await this.collection.deleteOne({ gameId: newScore.gameId, position: '3', gameType: newScore.gameType });
                    await this.collection.updateOne(
                        { gameId: newScore.gameId, position: '1', gameType: newScore.gameType },
                        { $set: { position: '2' } },
                    );
                    await this.collection.updateOne(
                        { gameId: newScore.gameId, position: '2', gameType: newScore.gameType },
                        { $set: { position: '3' } },
                    );
                    newScore.position = '1';
                    await this.collection.insertOne(newScore);

                    break;
                }
                case '2': {
                    await this.collection.deleteOne({ gameId: newScore.gameId, position: '3', gameType: newScore.gameType });
                    await this.collection.updateOne(
                        { gameId: newScore.gameId, position: '2', gameType: newScore.gameType },
                        { $set: { position: '3' } },
                    );
                    newScore.position = '2';
                    await this.collection.insertOne(newScore);

                    break;
                }
                case '3': {
                    await this.collection.updateOne(
                        { gameId: newScore.gameId, position: '3', gameType: newScore.gameType },
                        { $set: { time: newScore.time, playerName: newScore.playerName } },
                    );

                    break;
                }
            }
            return { isAdded: true, positionIndex: indexToReplace };
        } else {
            return { isAdded: false, positionIndex: noScoreChange };
        }
    }

    async deleteGameScores(id: string): Promise<void> {
        this.collection.deleteMany({ gameId: id });
    }

    async resetOneGame(id: string): Promise<void> {
        await this.deleteGameScores(id);
        await this.addDefaultScores(id);
    }

    async addDefaultScores(gameId: string): Promise<void> {
        const defaultScores = await TopScoresService.getDefaultScores(this.jsonPath);
        for (const score of defaultScores) {
            score.gameId = gameId;
        }
        await this.collection.insertMany(defaultScores);
    }
}
