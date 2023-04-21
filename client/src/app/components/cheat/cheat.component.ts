import { Component, HostListener } from '@angular/core';
import { MouseFocusService } from '@app/services/mouse-focus.service';
import { ActionSaverService } from '@app/services/action-saver.service';
import { GameManagerService } from '@app/services/game-manager.service';

@Component({
    selector: 'app-cheat',
    templateUrl: './cheat.component.html',
    styleUrls: ['./cheat.component.scss'],
})
export class CheatComponent {
    toggle = false;
    status = 'Activer Triche';
    constructor(private gameManager: GameManagerService, private mouseFocus: MouseFocusService, private actionSaver: ActionSaverService) {}

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if ((event.key === 't' || event.key === 'T') && !this.mouseFocus.isFocusOnchat) {
            this.onClick();
        }
    }
    onClick(): void {
        {
            if (!this.gameManager.replayMode) {
                this.toggle = !this.toggle;
                this.gameManager.stateChanger();
                this.status = this.toggle ? 'Activer Triche' : 'Désactiver Triche';
                this.giveHint();
            }
        }
    }
    giveHint(): void {
        this.actionSaver.addCheatEnableAction(this.toggle);
        if (this.toggle) {
            const canvasModifier = this.gameManager.modifiedImageCanvas;
            const canvasOriginal = this.gameManager.originalImageCanvas;
            const pixelDifferences = this.gameManager.gameData.differences;

            this.gameManager.flashPixelsCheat(pixelDifferences, canvasModifier);
            this.gameManager.flashPixelsCheat(pixelDifferences, canvasOriginal);
        } else {
            return;
        }
    }
    getToggle(): boolean {
        return this.toggle;
    }
}
