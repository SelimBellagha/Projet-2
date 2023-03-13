import { Component, HostListener, OnInit } from '@angular/core';
import { GameManagerService } from '@app/services/game-manager.service';

const QUART_SECOND = 5000;

@Component({
    selector: 'app-cheat',
    templateUrl: './cheat.component.html',
    styleUrls: ['./cheat.component.scss'],
})

// const btn = document.getElementById('btn');
export class CheatComponent implements OnInit {
    constructor(private gameManager: GameManagerService) {}

    // eslint-disable-next-line @typescript-eslint/member-ordering
    toggle = true;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    status = 'Enable Cheat';

    ngOnInit(): void {}

    onClick(): void {
        {
            this.toggle = !this.toggle;
            this.status = this.toggle ? 'Enable Cheat' : 'Disable Cheat';
            this.giveHint();
        }
        // btn.style.backgroundColor = 'salmon';
        // btn.style.color = 'white';
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
        const canvasModifier = this.gameManager.modifiedImageCanvas;
        const canvasOriginal = this.gameManager.originalImageCanvas;
        const pixelDifferences = this.gameManager.gameData.differences;

        for (let i = 0; i < this.gameManager.gameData.nbDifferences; i++) {
            this.gameManager.flashPixelsCheat(pixelDifferences[i], canvasModifier);
            this.gameManager.flashPixelsCheat(pixelDifferences[i], canvasOriginal);
            this.gameManager.wait(QUART_SECOND);
        }
    }
}
