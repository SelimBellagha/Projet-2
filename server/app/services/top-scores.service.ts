import { TopScore } from '@app/data/top-scores.interface';
import { Collection, Filter } from 'mongodb';
import { DatabaseService } from './database.service';
import { Service } from 'typedi';
import { DATABASE_COLLECTION } from '@app/data/db-constants';
import * as path from 'path';
import * as fs from 'fs';

const jsonPath = path.join(__dirname + '../../../../../app/data/default_scores.json');

@Service()
export class TopScoresService {
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<TopScore> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    static async readJsonFile(filePath: string) {
        return await fs.promises.readFile(filePath);
    }

    private static async getDefaultScores(): Promise<TopScore[]> {
        const fileBuffer = await TopScoresService.readJsonFile(jsonPath);
        return JSON.parse(fileBuffer.toString()).defaultScores;
    }

    async getAllTopScores(): Promise<TopScore[]> {
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
            .sort({ time: -1 })
            .toArray()
            .then((scores: TopScore[]) => {
                return scores;
            });
    }

    async sortScoresByGame(id: string): Promise<TopScore[]> {
        return this.collection
            .find({ gameId: id })
            .toArray()
            .then((scores: TopScore[]) => {
                return scores;
            });
    }

    async validateScore(newScore: TopScore): Promise<number> {
        const currentScores = await this.sortTopScores(newScore.gameId, newScore.gameType);
        let indexVal = -1;
        for (let i = 0; i < 3; i++) {
            if (currentScores[i].time < newScore.time) {
                indexVal = i;
                break;
            }
        }
        return indexVal;
    }

    async addScore(newScore: TopScore): Promise<boolean> {
        const indexToReplace = await this.validateScore(newScore);
        const allScores = await this.getAllTopScores();
        const noScoreChange = -1;
        if (indexToReplace !== noScoreChange) {
            const scoresLength = allScores.length;
            newScore.id = scoresLength + 1;
            allScores[indexToReplace] = newScore;
            await this.collection.deleteMany({});
            await this.collection.insertMany(allScores);
            return true;
        }
        return false;
    }

    async updateScore(score: TopScore) {
        const allScores = await this.getAllTopScores();
        const theScore = allScores.find((scores) => scores.playerName === score.playerName);
        if (theScore) {
            theScore.playerName = score.playerName;
            theScore.time = score.time;
        }
        await this.collection.deleteMany({});
        await this.collection.insertMany(allScores);
    }

    async modifyScore(score: TopScore): Promise<TopScore[]> {
        const filterQuery: Filter<TopScore> = { playerName: score.playerName };
        return this.collection
            .replaceOne(filterQuery, score)
            .then((scores: TopScore[]) => {
                return scores;
            })
            .catch(() => {
                throw new Error('Failed to update document');
            });
    }

    async deleteScore(playerName: string): Promise<void> {
        return this.collection
            .findOneAndDelete({ playerName })
            .then((res) => {
                if (!res.value) {
                    throw new Error('Could not find score');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete score');
            });
    }

    async resetOneGame(id: string): Promise<void> {
        const defaultScores = await TopScoresService.getDefaultScores();
        for (const score of defaultScores) {
            score.gameId = id;
        }
        this.collection.deleteMany({ gameId: id });
        await this.addDefaultScores(id);
    }

    async resetScores(): Promise<void> {
        await this.collection.deleteMany({});
        await this.databaseService.populateDB(DATABASE_COLLECTION, await TopScoresService.getDefaultScores());
    }

    async addDefaultScores(gameId: string): Promise<void> {
        const defaultScores = await TopScoresService.getDefaultScores();
        for (const score of defaultScores) {
            score.gameId = gameId;
        }
        await this.collection.insertMany(defaultScores);
    }
}
