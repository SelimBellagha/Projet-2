// import { TEST_GAME_CONSTANTS_JSON_PATH } from '@app/data/test-constants';
// import { Constants } from '@common/constants';
// import { GameConstantsService } from '@app/services/constants-manager.service';
import { expect } from 'chai';
// import * as fs from 'fs';
// import { Container } from 'typedi';
// import * as sinon from 'sinon';

// describe('Game constants service', () => {
//     let newConstants: Constants;
//     let gamesConstantsService: GameConstantsService;
//     let gameConstantsObject: Constants;
//     beforeEach(async () => {
//         newConstants = {
//             initTime: 30,
//             penaltyTime: 5,
//             timeBonus: 5,
//         };
//         gameConstantsObject = JSON.parse(JSON.stringify(newConstants));
//         gamesConstantsService = Container.get(GameConstantsService);
//         gamesConstantsService['jsonPath'] = TEST_GAME_CONSTANTS_JSON_PATH;
//     });

//     it('should get all game constants', async () => {
//         const string = JSON.stringify(gameConstantsObject);
//         fs.writeFileSync(TEST_GAME_CONSTANTS_JSON_PATH, string, 'utf-8');
//         const gamesConstants = await gamesConstantsService.getGameConstants();
//         expect(gamesConstants).to.deep.equals(gameConstantsObject);
//         fs.unlinkSync(TEST_GAME_CONSTANTS_JSON_PATH);
//     });

//     it('appendJSON should add a game constant to game-constants.json', async () => {
//         fs.writeFileSync(TEST_GAME_CONSTANTS_JSON_PATH, JSON.stringify(gameConstantsObject), 'utf-8');
//         await gamesConstantsService.appendJSON(newConstants);
//         const constantsObject = JSON.parse(fs.readFileSync(TEST_GAME_CONSTANTS_JSON_PATH, 'utf-8'));
//         expect(constantsObject).to.deep.equals(newConstants);
//         fs.unlinkSync(TEST_GAME_CONSTANTS_JSON_PATH);
//     });

//     it('addGameConstants should call appendJSON', async () => {
//         const appendJSONSpy = (gamesConstantsService['appendJSON'] = sinon.spy());
//         await gamesConstantsService.addGameConstants(newConstants);
//         sinon.assert.calledWith(appendJSONSpy, newConstants);
//     });
// });
import { GameConstantsService } from '@app/services/constants-manager.service';
import { Constants } from '@common/constants';
import { readFile } from 'node:fs/promises';

describe('GameConstantsService', () => {
    let gameConstantsService: GameConstantsService;

    beforeEach(() => {
        gameConstantsService = new GameConstantsService();
    });

    it('should return game constants as a JavaScript object', async () => {
        const gameConstants = await gameConstantsService.getGameConstants();
        expect(typeof gameConstants).to.equal('object');
    });

    it('should update game constants in the constants file', async () => {
        const initialConstants: Constants = {
            initTime: 10,
            penaltyTime: 5,
            timeBonus: 2,
        };

        const newConstants: Constants = {
            initTime: 15,
            penaltyTime: 7,
            timeBonus: 3,
        };

        await gameConstantsService.addGameConstants(newConstants);

        const updatedConstantsString = await readFile('./app/data/constantes.json', 'utf8');
        const updatedConstants = JSON.parse(updatedConstantsString);

        expect(updatedConstants).to.deep.equal(newConstants);
        ({
            initTime: newConstants.initTime,
            penaltyTime: newConstants.penaltyTime,
            timeBonus: newConstants.timeBonus,
        });

        // restore the original constants after the test
        await gameConstantsService.appendJSON(initialConstants);
    });
});
