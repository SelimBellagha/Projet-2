import { GameManager } from '@app/services/game-manager.service';
import { createStubInstance } from 'sinon';

describe('Date Service', () => {
    let gameService: GameManager;

    beforeEach(async () => {
        gameService = createStubInstance(GameManager);
    });
});
