import { Injectable } from '@angular/core';
import { GameAction, GameActionType } from '@app/interfaces/game-action';
import { Vec2 } from '@app/interfaces/vec2';

@Injectable({
    providedIn: 'root',
})
export class ActionSaverService {
    nextActionIndex: number = 0;
    isInReplay: boolean = false;
    timeTest: number = 0;
    private actionsDone: GameAction[] = [];

    //  constructor(private socketService: SocketClientService) {}

    addAction(actionType: GameActionType, actionTime: number, actionInfo: object): void {
        if (!this.isInReplay) {
            this.actionsDone.push({ type: actionType, time: actionTime, info: actionInfo });
            console.log(this.actionsDone);
        }
    }
    reset(): void {
        this.actionsDone = [];
        this.nextActionIndex = 0;
        this.isInReplay = false;
        // this.socketService.send('startStopWatch');
        // StartTimer
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
        this.addAction(GameActionType.Click, (this.timeTest += 10), position);
    }
    addCheatEnableAction(enable: boolean): void {
        this.addAction(GameActionType.ActivateCheat, (this.timeTest += 10), { isActivating: enable });
    }
    addHintAction(): void {
        //
    }
}
