import { Injectable } from '@angular/core';
import { GameAction, GameActionType } from '@app/interfaces/game-action';

@Injectable({
    providedIn: 'root',
})
export class ActionSaverService {
    nextActionIndex: number = 0;
    isInReplay: boolean = false;
    private actionsDone: GameAction[] = [];

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
}
