import { Constants, STRINGIFY_SPACES, TEST_GAME_CONSTANTS_JSON_PATH } from '@common/constants';
import { GameConstantsService } from '@app/services/constants-manager.service';
import { expect } from 'chai';
import * as fs from 'fs';
import { Container } from 'typedi';

describe('Game constants service', () => {
    let newConstants: Constants;
    let gamesConstantsService: GameConstantsService;
    let gameConstantsObject: Constants;
    beforeEach(async () => {
        newConstants = {
            initTime: 30,
            penaltyTime: 5,
            timeBonus: 5,
        };
        gameConstantsObject = JSON.parse(JSON.stringify(newConstants));
        gamesConstantsService = Container.get(GameConstantsService);
        gamesConstantsService['jsonPath'] = TEST_GAME_CONSTANTS_JSON_PATH;
    });

    /* it('should get all game constants', async () => {
        fs.writeFileSync(TEST_GAME_CONSTANTS_JSON_PATH, JSON.stringify(gameConstantsObject, null, STRINGIFY_SPACES), 'utf-8');
        const gamesConstants = await gamesConstantsService.getGameConstants();
        expect(gamesConstants).to.deep.equals(gameConstantsObject);
        fs.unlinkSync(TEST_GAME_CONSTANTS_JSON_PATH);
    });*/

    it('addGameConstants should add a game constant to game-constants.json', (done) => {
        fs.writeFileSync(TEST_GAME_CONSTANTS_JSON_PATH, JSON.stringify(gameConstantsObject, null, STRINGIFY_SPACES), 'utf-8');
        gamesConstantsService.addGameConstants(newConstants);
        const constantsObject = JSON.parse(fs.readFileSync(TEST_GAME_CONSTANTS_JSON_PATH, 'utf-8'));
        expect(constantsObject).to.deep.equals(newConstants);
        done();
    });
});
