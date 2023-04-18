import { ElementRef, Injectable } from '@angular/core';
import { GameAction, GameActionType } from '@app/interfaces/game-action';
import { Vec2 } from '@app/interfaces/vec2';
import { Message } from '@common/chatMessage';
import { ActionSaverService } from './action-saver.service';
import { GameManagerService } from './game-manager.service';

export interface CheatInfo {
    isActivating: boolean;
}
export interface NormalHintInfo {
    firstPos: Vec2;
    endPos: Vec2;
}
export interface OpponentDifferenceInfo {
    id: number;
}

const ONE_SECOND = 1000;
@Injectable({
    providedIn: 'root',
})
export class ReplayService {
    replaySpeed = 1;
    currentReplayTime = 0;
    timerId: number;
    isPlaying: boolean = false;
    endPopUp: ElementRef<HTMLDivElement>;
    constructor(private gameManager: GameManagerService, private actionSaver: ActionSaverService) {}

    getNextAction(): GameAction {
        return this.actionSaver.getNextAction();
    }
    setCurrentSpeed(speed: number): void {
        this.replaySpeed = speed;
        this.gameManager.replaySpeed = speed;
        clearInterval(this.timerId);
        this.startTimer(this.replaySpeed);
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
        this.gameManager.restartGame();
        this.isPlaying = true;
        this.actionSaver.messages.length = 0;
        this.startTimer(this.replaySpeed);
    }
    endReplay(): void {
        clearInterval(this.timerId);
        this.endPopUp.nativeElement.style.display = 'block';
    }
    doAction(gameAction: GameAction): void {
        switch (gameAction.type) {
            case GameActionType.Click:
                this.gameManager.onPositionClicked(gameAction.info as Vec2);
                break;
            case GameActionType.NormalHint:
                this.gameManager.drawLine((gameAction.info as NormalHintInfo).firstPos, (gameAction.info as NormalHintInfo).endPos);
                break;
            case GameActionType.LastHint:
                this.gameManager.giveHint3(gameAction.info as Vec2);
                break;
            case GameActionType.ActivateCheat:
                this.gameManager.stateChanger();
                if ((gameAction.info as CheatInfo).isActivating) {
                    const canvasModifier = this.gameManager.modifiedImageCanvas;
                    const canvasOriginal = this.gameManager.originalImageCanvas;
                    const pixelDifferences = this.gameManager.gameData.differences;

                    this.gameManager.flashPixelsCheat(pixelDifferences, canvasModifier);
                    this.gameManager.flashPixelsCheat(pixelDifferences, canvasOriginal);
                }
                break;
            case GameActionType.Message:
                if (this.actionSaver.messages.length) {
                    if (!this.compareMessages(gameAction.info as Message, this.actionSaver.messages[this.actionSaver.messages.length - 1])) {
                        this.actionSaver.messages.push(gameAction.info as Message);
                    }
                } else {
                    this.actionSaver.messages.push(gameAction.info as Message);
                }

                break;
            case GameActionType.OpponentDifference:
                this.gameManager.opponentFoundDifference((gameAction.info as OpponentDifferenceInfo).id);
                break;
        }
    }
    compareMessages(message1: Message, message2: Message) {
        return message1.text === message2.text;
    }

    startTimer(speed: number): void {
        clearInterval(this.timerId);
        this.timerId = window.setInterval(() => {
            if (this.isPlaying) {
                this.currentReplayTime++;
                while (this.getNextAction() && this.getNextAction().time === this.currentReplayTime) {
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
