import { Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { GameManagerService } from '@app/services/game-manager.service';
// import { CanvasManagerService } from '@app/services/canvas-manager.service';

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

    // eslint-disable-next-line @typescript-eslint/member-ordering
    hints: string[] = ['Indice 1', 'Indice 2', 'Indice 3', 'MAX ATTEINT'];
    // eslint-disable-next-line @typescript-eslint/member-ordering
    a: Vec2 = { x: 0, y: 0 };
    // eslint-disable-next-line @typescript-eslint/member-ordering
    b: Vec2 = { x: 5, y: 5 };

    onClick(): void {
        {
            if (this.counter < 3) {
                this.toggle = true;
                this.gameManager.stateChanger();
                this.status = this.hints[this.counter];
                this.counter++;
                this.giveHint();
            } else {
                this.toggle = false;
                this.status = this.hints[this.counter];
                window.alert('Nombre de indice maximum atteint');
                this.giveHint();
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        // eslint-disable-next-line no-console
        if (event.key === 'i' || event.key === 'I') {
            this.onClick();
        }
    }

    giveHint(): void {
        if (this.toggle) {
            // const canvasModifier = this.gameManager.modifiedImageCanvas;
            const pixelDifferences = this.gameManager.gameData.differences[0];

            this.gameManager.replacePixels(pixelDifferences);

            // eslint-disable-next-line no-console
            console.log(pixelDifferences);
        }
    }
    getToggle(): boolean {
        return this.toggle;
    }
}
