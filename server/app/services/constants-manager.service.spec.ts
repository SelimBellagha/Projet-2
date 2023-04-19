import { GameConstantsService } from '@app/services/constants-manager.service';
import { Constants, TEST_GAME_CONSTANTS_JSON_PATH } from '@common/constants';
import { expect } from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
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

    it('should get all game constants', async () => {
        const readFileStub = sinon.stub(fs.promises, 'readFile').resolves(JSON.stringify(gameConstantsObject));
        const gamesConstants = await gamesConstantsService.getGameConstants();
        expect(gamesConstants).to.deep.equal(gameConstantsObject);
        readFileStub.restore();
    });

    it('appendJSON should add a game constant to game-constants.json', async () => {
        fs.writeFileSync(TEST_GAME_CONSTANTS_JSON_PATH, JSON.stringify(gameConstantsObject), 'utf-8');
        await gamesConstantsService.appendJSON(newConstants);
        const constantsObject = JSON.parse(fs.readFileSync(TEST_GAME_CONSTANTS_JSON_PATH, 'utf-8'));
        expect(constantsObject).to.deep.equals(newConstants);
        fs.unlinkSync(TEST_GAME_CONSTANTS_JSON_PATH);
    });

    it('addGameConstants should call appendJSON', async () => {
        const appendJSONSpy = (gamesConstantsService['appendJSON'] = sinon.spy());
        await gamesConstantsService.addGameConstants(newConstants);
        sinon.assert.calledWith(appendJSONSpy, newConstants);
    });
});
