import { Injectable } from '@angular/core';
import { GameAction, GameActionType } from '@app/interfaces/game-action';
import { Vec2 } from '@app/interfaces/vec2';
import { GameManagerService } from './game-manager.service';

const ONE_SECOND = 1000;
@Injectable({
    providedIn: 'root',
})
export class ReplayService {
    private actionsDone: GameAction[] = [];
    private nextActionIndex: number = 0;
    private replaySpeed = 1;
    private currentReplayTime = 0;
    private timerId: number;
    private isPlaying: boolean;

    constructor(private gameManager: GameManagerService) {}

    addAction(actionType: GameActionType, time: number, info: object): void {
        this.actionsDone.push({ actionType, time, info });
    }
    reset(): void {
        this.actionsDone = [];
        this.nextActionIndex = 0;
    }
    getNextAction(): GameAction {
        return this.actionsDone[this.nextActionIndex++];
    }
    setCurrentSpeed(speed: number): void {
        this.replaySpeed = speed;
        clearInterval(this.timerId);
        this.startTimer(speed);
    }
    getSpeed(): number {
        return this.replaySpeed;
    }
    pauseReplay(): void {
        this.isPlaying = false;
    }
    resumeReplay(): void {
        this.isPlaying = true;
    }
    restartReplay(): void {
        this.currentReplayTime = 0;
        this.nextActionIndex = 0;
        // reset the canvas from game Manager
        this.startTimer(this.replaySpeed);
    }
    endReplay(): void {
        this.setCurrentSpeed(1);
        clearInterval(this.timerId);
    }
    doAction(gameAction: GameAction): void {
        switch (gameAction.actionType) {
            case GameActionType.Click:
                this.gameManager.onPositionClicked(gameAction.info as Vec2);
                break;
            case GameActionType.Hint:
                break;
            case GameActionType.ActivateCheat:
                break;
            case GameActionType.Message:
                break;
        }
    }

    startTimer(speed: number): void {
        this.timerId = window.setInterval(this.timerFunction, ONE_SECOND / speed);
    }

    timerFunction(): void {
        if (this.isPlaying) {
            this.currentReplayTime++;
            while (this.actionsDone[this.nextActionIndex].time === this.currentReplayTime) {
                this.doAction(this.actionsDone[this.nextActionIndex]);
                if (this.nextActionIndex === this.actionsDone.length - 1) {
                    this.endReplay();
                    break;
                }
                this.nextActionIndex++;
            }
        }
    }
}
