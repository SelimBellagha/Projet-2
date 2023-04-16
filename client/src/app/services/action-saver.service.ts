import { Injectable } from '@angular/core';
import { GameAction, GameActionType } from '@app/interfaces/game-action';
import { Vec2 } from '@app/interfaces/vec2';
import { Message } from '@common/chatMessage';

const ONE_SECOND = 1000;

@Injectable({
    providedIn: 'root',
})
export class ActionSaverService {
    nextActionIndex: number = 0;
    isInReplay: boolean = false;
    currentTime: number = 1;
    timerId: number;
    messages: Message[];
    private actionsDone: GameAction[] = [];

    //  constructor(private socketService: SocketClientService) {}

    addAction(actionType: GameActionType, actionTime: number, actionInfo: object): void {
        if (!this.isInReplay) {
            this.actionsDone.push({ type: actionType, time: actionTime, info: actionInfo });
        }
    }
    reset(): void {
        this.actionsDone = [];
        this.nextActionIndex = 0;
        this.isInReplay = false;
        this.currentTime = 1;
        // this.socketService.send('startStopWatch');
        this.startTimer();
    }
    getNextAction(): GameAction {
        return this.actionsDone[this.nextActionIndex];
    }
    restart(): void {
        this.nextActionIndex = 0;
        this.isInReplay = true;
    }
    getNbActions(): number {
        return this.actionsDone.length;
    }
    addClickAction(position: Vec2): void {
        // this.socketService.send('getRealTime');
        this.addAction(GameActionType.Click, this.currentTime, position);
    }
    addCheatEnableAction(enable: boolean): void {
        this.addAction(GameActionType.ActivateCheat, this.currentTime, { isActivating: enable });
    }
    addHintAction(firstPoint: Vec2, endPoint: Vec2): void {
        this.addAction(GameActionType.NormalHint, this.currentTime, { firstPos: firstPoint, endPos: endPoint });
    }
    addLastHintAction(point: Vec2): void {
        this.addAction(GameActionType.LastHint, this.currentTime, point);
    }
    addChatMessageAction(message: Message): void {
        this.addAction(GameActionType.Message, this.currentTime, message);
    }
    addOpponentAction(differenceId: number) {
        this.addAction(GameActionType.OpponentDifference, this.currentTime, { id: differenceId });
    }
    startTimer(): void {
        clearInterval(this.timerId);
        this.timerId = window.setInterval(() => {
            this.currentTime++;
        }, ONE_SECOND);
    }
}
