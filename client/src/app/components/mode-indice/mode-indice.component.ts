import { Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { MouseFocusService } from '@app/services/mouse-focus.service';
import { GameManagerService } from '@app/services/game-manager.service';

const cadran1 = 0;
const cadran2 = 1;
const cadran3 = 10;
const cadran4 = 11;

const multiplicateur = 10;

@Component({
    selector: 'app-mode-indice',
    templateUrl: './mode-indice.component.html',
    styleUrls: ['./mode-indice.component.scss'],
})
export class ModeIndiceComponent {
    toggle = false;

    yCadran = 0; // goes up

    xCadran = 0; // goes left

    counter = 0;

    result: Vec2 = { x: 0, y: 0 };
    // coordinates for the cadrans
    a: Vec2 = { x: 0, y: 240 };

    c: Vec2 = { x: 320, y: 0 };

    b: Vec2 = { x: 640, y: 240 };

    d: Vec2 = { x: 320, y: 480 };

    e: Vec2 = { x: 0, y: 120 };

    f: Vec2 = { x: 320, y: 120 };

    g: Vec2 = { x: 640, y: 120 };

    h: Vec2 = { x: 0, y: 360 };

    i: Vec2 = { x: 320, y: 360 };

    j: Vec2 = { x: 640, y: 360 };

    centre: Vec2 = { x: 320, y: 240 };

    status = '3 Indices Inactive';

    hints: string[] = ['Indice 1 utilisé', 'Indice 2 utilisé', 'Indice 3 utilisé', 'MAX ATTEINT'];
    constructor(private gameManager: GameManagerService, private mouseFocus: MouseFocusService) {}

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if ((event.key === 'i' || event.key === 'I') && !this.mouseFocus.isFocusOnchat) {
            this.onClick();
        }
    }
    onClick(): void {
        {
            if (this.gameManager.replayMode) {
                return;
            }
            if (this.counter < 3) {
                this.gameManager.sendHintMessage(this.hints[this.counter]);
                switch (this.counter) {
                    case 0:
                        this.toggle = true;
                        this.gameManager.hintStateChanger();
                        this.status = this.hints[this.counter];
                        this.counter++;
                        this.gameManager.timePenalty();
                        this.findCadran1(this.setUpCoordinates());
                        break;
                    case 1:
                        this.toggle = true;
                        this.gameManager.hintStateChanger();
                        this.status = this.hints[this.counter];
                        this.counter++;
                        this.gameManager.timePenalty();
                        this.findCadran2(this.setUpCoordinates());
                        break;
                    case 2:
                        this.toggle = true;
                        this.gameManager.hintStateChanger();
                        this.status = this.hints[this.counter];
                        this.counter++;
                        this.gameManager.timePenalty();
                        this.gameManager.giveHint3(this.setUpCoordinates());
                        break;
                }
            } else {
                this.toggle = false;
                this.status = this.hints[this.counter];
                window.alert('Nombre de indice maximum atteint');
            }
        }
    }

    setUpCoordinates(): Vec2 {
        const randomHint = this.getRandomNumber(0, this.gameManager.gameData.nbDifferences - 1);
        const pixelDifferences = this.gameManager.gameData.differences[randomHint];

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < pixelDifferences.length; i++) {
            this.result.x += pixelDifferences[i].x;
            this.result.y += pixelDifferences[i].y;
        }
        this.result.x = this.result.x / pixelDifferences.length;
        this.result.y = this.result.y / pixelDifferences.length;
        return this.result;
    }
    findCadran1(coordinate: Vec2): number {
        if (coordinate.y >= this.centre.y) {
            this.yCadran = 1;
        }
        if (coordinate.x >= this.centre.x) {
            this.xCadran = 1;
        }

        switch (multiplicateur * this.yCadran + this.xCadran) {
            case cadran4:
                this.gameManager.drawLine(this.b, this.centre);
                this.gameManager.drawLine(this.d, this.centre);

                return 1;

            case cadran3:
                this.gameManager.drawLine(this.a, this.centre);
                this.gameManager.drawLine(this.d, this.centre);
                return 1;

            case cadran2:
                this.gameManager.drawLine(this.b, this.centre);
                this.gameManager.drawLine(this.c, this.centre);
                return 1;

            case cadran1:
                this.gameManager.drawLine(this.a, this.centre);
                this.gameManager.drawLine(this.c, this.centre);
                return 1;
        }
        return 0;
    }
    findCadran2(coordinate: Vec2): number {
        if (coordinate.y >= this.centre.y) {
            this.yCadran = 1;
        } else {
            this.yCadran = 0;
        }
        if (coordinate.x >= this.centre.x) {
            this.xCadran = 1;
        } else {
            this.xCadran = 0;
        }

        switch (multiplicateur * this.yCadran + this.xCadran) {
            case cadran1:
                if (coordinate.y <= this.centre.y / 2) {
                    this.yCadran = 1;
                    this.gameManager.drawLine(this.e, this.f);
                    this.gameManager.drawLine(this.f, this.c);
                    return 1;
                } else {
                    this.gameManager.drawLine(this.e, this.f);
                    this.gameManager.drawLine(this.f, this.centre);
                    this.gameManager.drawLine(this.centre, this.a);
                    return 1;
                }

            case cadran2:
                if (coordinate.y <= this.centre.y / 2) {
                    this.yCadran = 1;
                    this.gameManager.drawLine(this.f, this.g);
                    this.gameManager.drawLine(this.f, this.c);
                    return 1;
                } else {
                    this.gameManager.drawLine(this.f, this.g);
                    this.gameManager.drawLine(this.f, this.centre);
                    this.gameManager.drawLine(this.centre, this.b);
                    return 1;
                }

            case cadran3:
                if (coordinate.y <= (this.centre.y * 3) / 2) {
                    this.yCadran = 1;
                    this.gameManager.drawLine(this.h, this.i);
                    this.gameManager.drawLine(this.i, this.centre);
                    this.gameManager.drawLine(this.centre, this.a);
                    return 1;
                } else {
                    this.gameManager.drawLine(this.centre, this.i);
                    this.gameManager.drawLine(this.i, this.h);
                    return 1;
                }

            case cadran4:
                if (coordinate.y <= (this.centre.y * 3) / 2) {
                    this.yCadran = 1;
                    this.gameManager.drawLine(this.h, this.i);
                    this.gameManager.drawLine(this.i, this.centre);
                    this.gameManager.drawLine(this.centre, this.b);
                    return 1;
                } else {
                    this.gameManager.drawLine(this.i, this.j);
                    this.gameManager.drawLine(this.i, this.centre);
                    return 1;
                }
        }
        return 0;
    }
    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
