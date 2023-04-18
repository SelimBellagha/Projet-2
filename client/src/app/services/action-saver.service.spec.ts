import { TestBed } from '@angular/core/testing';

import { GameActionType } from '@app/interfaces/game-action';
import { Vec2 } from '@app/interfaces/vec2';
import { Message } from '@common/chatMessage';
import { ActionSaverService } from './action-saver.service';

describe('ActionSaverService', () => {
    let service: ActionSaverService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ActionSaverService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('addAction should  add an item to actionsDone List', () => {
        const mockAction = { actionType: GameActionType.Click, actionTime: 1, actionInfo: {} };
        service.addAction(mockAction.actionType, mockAction.actionTime, mockAction.actionInfo);
        expect(service.getNbActions()).toEqual(1);
    });
    it('addAction should not add an item to actionsDone List if isInReplay is true', () => {
        service.isInReplay = true;
        const mockAction = { actionType: GameActionType.Click, actionTime: 1, actionInfo: {} };
        service.addAction(mockAction.actionType, mockAction.actionTime, mockAction.actionInfo);
        expect(service.getNbActions()).toEqual(0);
    });
    it('reset should empty the actionsDone list', () => {
        const mockAction = { actionType: GameActionType.Click, actionTime: 1, actionInfo: {} };
        service.addAction(mockAction.actionType, mockAction.actionTime, mockAction.actionInfo);
        service.reset();
        expect(service.getNbActions()).toEqual(0);
    });
    it(' getNextAction should return the action at nextActionIndex value', () => {
        const mockAction1 = { actionType: GameActionType.Click, actionTime: 1, actionInfo: {} };
        service.addAction(mockAction1.actionType, mockAction1.actionTime, mockAction1.actionInfo);
        const mockAction2 = { actionType: GameActionType.Message, actionTime: 1, actionInfo: {} };
        service.addAction(mockAction2.actionType, mockAction2.actionTime, mockAction2.actionInfo);
        service.nextActionIndex = 1;
        expect(service.getNextAction().type).toEqual(mockAction2.actionType);
    });
    it('restart should change nextActionIndex to 0 and put service in replayMode', () => {
        service.nextActionIndex = 10;
        service.restart();
        expect(service.nextActionIndex).toEqual(0);
        expect(service.isInReplay).toBeTrue();
    });
    it('getNbActions should return the length of the actionsDone Array', () => {
        expect(service.getNbActions()).toEqual(0);
        const mockAction = { actionType: GameActionType.Click, actionTime: 1, actionInfo: {} };
        service.addAction(mockAction.actionType, mockAction.actionTime, mockAction.actionInfo);
        expect(service.getNbActions()).toEqual(1);
    });
    it('addClickAction should call addAction with correct actionType', () => {
        const spy = spyOn(service, 'addAction');
        service.currentTime = 0;
        service.addClickAction({} as Vec2);
        expect(spy).toHaveBeenCalledWith(GameActionType.Click, 0, {});
    });
    it('addCheatEnableActionAction should call addAction with correct actionType', () => {
        const spy = spyOn(service, 'addAction');
        service.currentTime = 0;
        service.addCheatEnableAction(true);
        expect(spy).toHaveBeenCalledWith(GameActionType.ActivateCheat, 0, { isActivating: true });
    });
    it('addHintAction should call addAction with correct actionType', () => {
        const spy = spyOn(service, 'addAction');
        service.currentTime = 0;
        service.addHintAction({} as Vec2, {} as Vec2);
        expect(spy).toHaveBeenCalledWith(GameActionType.NormalHint, 0, { firstPos: {}, endPos: {} });
    });
    it('addLastHintAction should call addAction with correct actionType', () => {
        const spy = spyOn(service, 'addAction');
        service.currentTime = 0;
        service.addLastHintAction({} as Vec2);
        expect(spy).toHaveBeenCalledWith(GameActionType.LastHint, 0, {});
    });

    it('addChatMessageAction should call addAction with correct actionType', () => {
        const spy = spyOn(service, 'addAction');
        service.currentTime = 0;
        service.addChatMessageAction({} as Message);
        expect(spy).toHaveBeenCalledWith(GameActionType.Message, 0, {});
    });

    it('addOpponentAction should call addAction with correct actionType', () => {
        const spy = spyOn(service, 'addAction');
        service.currentTime = 0;
        service.addOpponentAction(1);
        expect(spy).toHaveBeenCalledWith(GameActionType.OpponentDifference, 0, { id: 1 });
    });
});
