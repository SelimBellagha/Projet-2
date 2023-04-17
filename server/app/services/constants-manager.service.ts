import { Constants } from '@common/constants';
import { readFile, writeFile } from 'node:fs/promises';
import { Service } from 'typedi';

@Service()
export class GameConstantsService {
    async getGameConstants() {
        return JSON.parse(await readFile('./app/data/constantes.json', 'utf8'));
    }

    async addGameConstants(newConstants: Constants) {
        this.appendJSON(newConstants);
    }

    async appendJSON(newConstants: Constants): Promise<void> {
        const constantsObject: Constants = JSON.parse(await readFile('./app/data/constantes.json', 'utf8'));
        const gamesConstants: Constants = constantsObject;
        gamesConstants.initTime = newConstants.initTime;
        gamesConstants.penaltyTime = newConstants.penaltyTime;
        gamesConstants.timeBonus = newConstants.timeBonus;
        await writeFile('./app/data/constantes.json', JSON.stringify(gamesConstants), 'utf8');
    }
}
