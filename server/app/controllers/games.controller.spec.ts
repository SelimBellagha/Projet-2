/* eslint-disable @typescript-eslint/naming-convention */
import { Application } from '@app/app';
import { GameManager, gamesData } from '@app/services/game-manager.service';
// import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { Container } from 'typedi';

// const HTTP_STATUS_OK = StatusCodes.OK;
// const HTTP_STATUS_CREATED = StatusCodes.CREATED;

describe('GameController', () => {
    let gameService: SinonStubbedInstance<GameManager>;
    // let expressApp: Express.Application;

    beforeEach(async () => {
        gameService = createStubInstance(GameManager);
        gameService.getAllGames.resolves(Object.values(gamesData));
        // gameService.addGame.resolves(gamesData['0']);
        // gameService.getGamebyId.resolves(gamesData[id: string])
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['gameController'], 'gameService', { value: gameService });
        // expressApp = app.app;
    });
});
