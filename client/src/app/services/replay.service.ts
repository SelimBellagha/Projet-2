import { Injectable } from '@angular/core';
import { GameAction, GameActionType } from '@app/interfaces/game-action';

@Injectable({
    providedIn: 'root',
})
export class ReplayService {
    actionsDone: GameAction[] = [];
    nextActionIndex: number = 0;

    addAction(actionType: GameActionType, time: number): void {
        this.actionsDone.push({ actionType, time });
    }
    reset(): void {
        this.actionsDone = [];
        this.nextActionIndex = 0;
    }
}
