import { Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';

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
    yCadran = 0; // goes up
    // eslint-disable-next-line @typescript-eslint/member-ordering
    xCadran = 0; // goes left
    // eslint-disable-next-line @typescript-eslint/member-ordering
    counter = 0;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    result: Vec2 = { x: 0, y: 0 };
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
                switch (this.counter) {
                    case 0:
                        this.toggle = true;
                        this.gameManager.hintStateChanger();
                        this.status = this.hints[this.counter];
                        this.counter++;
                        // eslint-disable-next-line no-console
                        console.log('hint 1');
                        this.findCadran1(this.setUpCoordinates());
                        break;
                    case 1:
                        this.toggle = true;
                        this.gameManager.hintStateChanger();
                        this.status = this.hints[this.counter];
                        this.counter++;
                        // eslint-disable-next-line no-console
                        console.log('hint 2');
                        this.findCadran2(this.setUpCoordinates());
                        break;
                    case 2:
                        this.toggle = true;
                        this.gameManager.hintStateChanger();
                        this.status = this.hints[this.counter];
                        this.counter++;
                        // eslint-disable-next-line no-console
                        console.log('hint 3');
                        this.findCadran1(this.setUpCoordinates());
                        break;
                }
            } else {
                this.toggle = false;
                this.status = this.hints[this.counter];
                window.alert('Nombre de indice maximum atteint');
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
    setUpCoordinates(): Vec2 {
        const randomHint = this.getRandomNumber(0, 3);
        const pixelDifferences = this.gameManager.gameData.differences[randomHint];

        // // eslint-disable-next-line no-console
        // console.log('pixelDifferences');
        // // eslint-disable-next-line no-console
        // console.log(pixelDifferences);
        this.gameManager.replacePixels(pixelDifferences);

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < pixelDifferences.length; i++) {
            this.result.x += pixelDifferences[i].x;
            this.result.y += pixelDifferences[i].y;
        }
        this.result.x = this.result.x / pixelDifferences.length;
        this.result.y = this.result.y / pixelDifferences.length;
        // eslint-disable-next-line no-console
        // console.log(this.result, this.result.x, this.result.y);
        return this.result;
    }
    findCadran1(coordinate: Vec2): number {
        // return result;

        if (coordinate.y > 240) {
            this.yCadran = 1;
        }
        if (coordinate.x > 320) {
            this.xCadran = 1;
        }

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        switch (10 * this.yCadran + this.xCadran) {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            case 11:
                // eslint-disable-next-line no-console
                console.log('Cadran 4');
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                return 4;
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            case 10:
                // eslint-disable-next-line no-console
                console.log('Cadran 3');
                return 3;
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers, no-octal
            case 1:
                // eslint-disable-next-line no-console
                console.log('Cadran 2');
                return 2;
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers, no-octal
            case 0:
                // eslint-disable-next-line no-console
                console.log('Cadran 1');
                return 1;
        }
        return 0;
    }
    findCadran2(coordinate: Vec2): number {
        const cadran1 = this.findCadran1(coordinate);

        switch (cadran1) {
            case 1:
                if (coordinate.y < 120) {
                    this.yCadran = 1;
                    // eslint-disable-next-line no-console
                    console.log('Cadran 1.1');
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Cadran 1.2');
                }
                return 1;
            case 2:
                if (coordinate.y < 120) {
                    this.yCadran = 1;
                    // eslint-disable-next-line no-console
                    console.log('Cadran 2.1');
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Cadran 2.2');
                }
                return 1;
            case 3:
                if (coordinate.y > 360) {
                    this.yCadran = 1;
                    // eslint-disable-next-line no-console
                    console.log('Cadran 3.2');
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Cadran 3.1');
                }
                // eslint-disable-next-line no-console
                console.log('Cadran 3');
                return 1;
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            case 4:
                if (coordinate.y > 360) {
                    this.yCadran = 1;
                    // eslint-disable-next-line no-console
                    console.log('Cadran 4.2');
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Cadran 4.1');
                }
                return 1;
        }
        return 0;
    }
    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    giveHint(): void {
        if (this.toggle) {
            // // const canvasModifier = this.gameManager.modifiedImageCanvas;
            // const pixelDifferences = this.gameManager.gameData.differences[0];
            // const pixelDifferences2 = this.gameManager.gameData.differences[1];
            // this.gameManager.replacePixels(pixelDifferences);
            // this.gameManager.replacePixels(pixelDifferences2);
            // eslint-disable-next-line no-console
            // console.log(pixelDifferences);
            // this.canvasManager.createHint(true);
        }
        // this.canvasManager.createHint(true);
    }
    getToggle(): boolean {
        return this.toggle;
    }
}
