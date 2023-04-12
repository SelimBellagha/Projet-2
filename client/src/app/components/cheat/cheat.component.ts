import { Component, HostListener } from '@angular/core';
import { GameManagerService } from '@app/services/game-manager.service';

// const QUART_SECOND = 5000;

@Component({
    selector: 'app-cheat',
    templateUrl: './cheat.component.html',
    styleUrls: ['./cheat.component.scss'],
})

// const btn = document.getElementById('btn');
export class CheatComponent {
    constructor(private gameManager: GameManagerService) {}

    // eslint-disable-next-line @typescript-eslint/member-ordering
    toggle = false;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    status = 'Activer Triche';

    onClick(): void {
        {
            this.toggle = !this.toggle;
            this.gameManager.stateChanger();
            this.status = this.toggle ? 'Activer Triche' : 'Désactiver Triche';
            this.giveHint();
        }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        // eslint-disable-next-line no-console
        console.log('Mode triche active');
        if (event.key === 't' || event.key === 'T') {
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
