import { Injectable } from '@angular/core';
import { GameAction, GameActionType } from '@app/interfaces/game-action';
import { Vec2 } from '@app/interfaces/vec2';
import { ActionSaverService } from './action-saver.service';
import { GameManagerService } from './game-manager.service';

const ONE_SECOND = 1000;
@Injectable({
    providedIn: 'root',
})
export class ReplayService {
    replaySpeed = 1;
    currentReplayTime = 0;
    timerId: number;
    isPlaying: boolean = false;

    constructor(private gameManager: GameManagerService, private actionSaver: ActionSaverService) {}

    reset(): void {
        //
        //
    }
    getNextAction(): GameAction {
        const action = this.actionSaver.getNextAction();
        return action;
    }
    setCurrentSpeed(speed: number): void {
        this.replaySpeed = speed;
        this.gameManager.replaySpeed = speed;
        clearInterval(this.timerId);
        this.startTimer(speed);
    }
    getSpeed(): number {
        return this.replaySpeed;
    }
    pauseReplay(): void {
        this.isPlaying = !this.isPlaying;
    }
    restartReplay(): void {
        this.currentReplayTime = 0;
        this.actionSaver.restart();
        // reset the canvas from game Manager
        this.gameManager.restartGame();
        this.isPlaying = true;
        this.startTimer(this.replaySpeed);
    }
    endReplay(): void {
        clearInterval(this.timerId);
    }
    doAction(gameAction: GameAction): void {
        switch (gameAction.type) {
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
        this.timerId = window.setInterval(() => {
            if (this.isPlaying) {
                this.currentReplayTime++;
                while (this.getNextAction().time === this.currentReplayTime) {
                    this.doAction(this.getNextAction());
                    this.actionSaver.nextActionIndex++;
                    if (this.actionSaver.nextActionIndex >= this.actionSaver.getNbActions()) {
                        this.endReplay();
                        break;
                    }
                }
            }
        }, ONE_SECOND / speed);
    }
}
