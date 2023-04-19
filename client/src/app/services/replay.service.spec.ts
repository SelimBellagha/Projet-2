import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { GameAction, GameActionType } from '@app/interfaces/game-action';
import { Message } from '@common/chatMessage';
import { ActionSaverService } from './action-saver.service';
import { GameManagerService } from './game-manager.service';
import { ReplayService } from './replay.service';
import SpyObj = jasmine.SpyObj;
describe('ReplayService', () => {
    let service: ReplayService;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let actionSaverSpy: SpyObj<ActionSaverService>;

    beforeEach(() => {
        gameManagerSpy = jasmine.createSpyObj(
            'GameManagerService',
            ['restartGame', 'onPositionClicked', 'drawLine', 'giveHint3', 'stateChanger', 'flashPixelsCheat', 'opponentFoundDifference'],
            { modifiedImageCanvas: null, originalImageCanvas: null, gameData: { differences: null } },
        );
        actionSaverSpy = jasmine.createSpyObj('ActionSaverService', ['getNextAction', 'restart', 'getNbActions'], {
            messages: [],
            nextActionIndex: 10,
        });
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: ActionSaverService, useValue: actionSaverSpy },
            ],
        });
        service = TestBed.inject(ReplayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getNextAction should call getNextAction from actionService', () => {
        service.getNextAction();
        expect(actionSaverSpy.getNextAction).toHaveBeenCalled();
    });
    it('setCurrentSpeed should change replaySpeed attribute', () => {
        service.setCurrentSpeed(2);
        expect(service.replaySpeed).toEqual(2);
    });
    it('getSpeed should return current replaySpeed', () => {
        service.replaySpeed = 3;
        expect(service.getSpeed()).toEqual(3);
    });
    it('pauseReplay should change isPlaying attribute', () => {
        service.isPlaying = true;
        service.pauseReplay();
        expect(service.isPlaying).toBeFalse();
        service.pauseReplay();
        expect(service.isPlaying).toBeTrue();
    });
    it('restartReplay should change currentReplayTime to 0 ', () => {
        service.currentReplayTime = 2;
        service.restartReplay();
        expect(service.currentReplayTime).toEqual(0);
    });
    it('restartReplay should call restart methods from actionSaver and gameManager to 0 ', () => {
        service.restartReplay();
        expect(gameManagerSpy.restartGame).toHaveBeenCalled();
        expect(actionSaverSpy.restart).toHaveBeenCalled();
    });
    it('restartReplay should call startTimer and put isPlaying to true ', () => {
        const spy = spyOn(service, 'startTimer');
        service.restartReplay();
        expect(spy).toHaveBeenCalled();
        expect(service.isPlaying).toBeTrue();
    });
    it('endReplay should call ShowPopUp  ', () => {
        const spy1 = spyOn(window, 'clearInterval');
        const spy2 = spyOn(service, 'showPopUp');
        service.endReplay();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
    it('showPopUp should change display style of popUp', () => {
        service.endPopUp = new ElementRef(document.createElement('div'));
        service.endPopUp.nativeElement.style.display = 'none';
        service.endReplay();
        expect(service.endPopUp.nativeElement.style.display).toEqual('block');
    });
    it('compareMessage should return true if the message in both texts are the same', () => {
        const message1 = { text: 'aaa' } as Message;
        const message2 = { text: 'aaa' } as Message;
        expect(service.compareMessages(message1, message2)).toBeTrue();
    });
    it('startTimer should call setInterval', () => {
        const spy = spyOn(window, 'setInterval');
        service.startTimer(2);
        expect(spy).toHaveBeenCalled();
    });
    it('doAction should call onPositionClicked from gameManager if gameAction received is of type click', () => {
        const actionMock = { type: GameActionType.Click, info: {} };
        service.doAction(actionMock as GameAction);
        expect(gameManagerSpy.onPositionClicked).toHaveBeenCalled();
    });
    it('doAction should call drawLine from gameManager if gameAction received is of type normalHint', () => {
        const actionMock = { type: GameActionType.NormalHint, info: {} };
        service.doAction(actionMock as GameAction);
        expect(gameManagerSpy.drawLine).toHaveBeenCalled();
    });
    it('doAction should call giveHint3 from gameManager if gameAction received is of type lastHint', () => {
        const actionMock = { type: GameActionType.LastHint, info: {} };
        service.doAction(actionMock as GameAction);
        expect(gameManagerSpy.giveHint3).toHaveBeenCalled();
    });
    it('doAction should call stateChanger from gameManager if gameAction received is of type enableCheat', () => {
        const actionMock = { type: GameActionType.ActivateCheat, info: { isActivating: true } };
        service.doAction(actionMock as GameAction);
        expect(gameManagerSpy.stateChanger).toHaveBeenCalled();
    });
    it('doAction should call opponentFoundDifference from gameManager if gameAction received is of type OpponentDifference', () => {
        const actionMock = { type: GameActionType.OpponentDifference, info: {} };
        service.doAction(actionMock as GameAction);
        expect(gameManagerSpy.opponentFoundDifference).toHaveBeenCalled();
    });
    it('doAction should add an item to messages list from actionSaverif gameAction received is of type Message and list is empty ', () => {
        const actionMock = { type: GameActionType.Message, info: {} };
        service.doAction(actionMock as GameAction);
        expect(actionSaverSpy.messages.length).toEqual(1);
    });
    it('doAction should not add an item to messages list from actionSaver if message is a duplicate from last one  ', () => {
        const actionMock = { type: GameActionType.Message, info: { text: 'a' } };
        actionSaverSpy.messages = [{ text: 'a' } as Message];
        service.doAction(actionMock as GameAction);
        expect(actionSaverSpy.messages.length).toEqual(1);
    });
    it('doAction should add an item to messages list from actionSaver if message is not a duplicate from last one  ', () => {
        const actionMock = { type: GameActionType.Message, info: { text: 'a' } };
        actionSaverSpy.messages.push({ text: 'b34' } as Message);
        service.doAction(actionMock as GameAction);
        expect(actionSaverSpy.messages.length).toEqual(2);
    });
    it('startTimer interval function should increment currentReplayTime each second if replay is playing', () => {
        jasmine.clock().install();
        service.isPlaying = true;
        service.startTimer(1);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        jasmine.clock().tick(1001);
        expect(service.currentReplayTime).toEqual(1);
        jasmine.clock().uninstall();
    });
    it('startTimer interval function should call doAction if  there is an action to do at current time', () => {
        jasmine.clock().install();
        spyOn(service, 'getNextAction').and.returnValue({ time: 1 } as GameAction);
        const spy = spyOn(service, 'doAction');
        spyOn(service, 'endReplay');
        actionSaverSpy.getNbActions.and.returnValue(1);
        service.isPlaying = true;
        service.startTimer(1);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        jasmine.clock().tick(1001);
        expect(spy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('startTimer interval function should call endReplay if last action is done', () => {
        jasmine.clock().install();
        spyOn(service, 'getNextAction').and.returnValue({ time: 1 } as GameAction);
        const spy = spyOn(service, 'endReplay');
        actionSaverSpy.getNbActions.and.returnValue(1);
        service.isPlaying = true;
        service.startTimer(1);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        jasmine.clock().tick(1001);
        expect(spy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });
});
