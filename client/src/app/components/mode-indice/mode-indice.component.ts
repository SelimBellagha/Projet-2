import { Component, HostListener } from '@angular/core';
import { GameManagerService } from '@app/services/game-manager.service';

@Component({
    selector: 'app-mode-indice',
    templateUrl: './mode-indice.component.html',
    styleUrls: ['./mode-indice.component.scss'],
})

// const btn = document.getElementById('btn');
export class ModeIndiceComponent {
    constructor(private gameManager: GameManagerService) {}

    // eslint-disable-next-line @typescript-eslint/member-ordering
    toggle = false;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    counter = 0;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    status = 'Mode Indice Inactive';

    onClick(): void {
        {
            if (this.counter < 3) {
                this.toggle = !this.toggle;
                this.gameManager.stateChanger();
                this.status = this.toggle ? 'Mode Indice Active' : 'Mode Indice Inactive';
                this.giveHint();
                this.counter++;
            } else {
                window.alert('Nombre de indice maximum atteint');
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        // eslint-disable-next-line no-console
        console.log('Mode triche active');
        if (event.key === 'i' || event.key === 'I') {
            this.onClick();
        }
    }

    giveHint(): void {
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
