import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-game-creation-page',
    templateUrl: './game-creation-page.component.html',
    styleUrls: ['./game-creation-page.component.scss'],
})
export class GameCreationPageComponent {
    @ViewChild('rightCanvas') rightCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('leftCanvas') leftCanvas: ElementRef<HTMLCanvasElement>;

    radius: number = 3;
    constructor(private router: Router) {}

    resetForeground(leftPicture: boolean): void {
        // enlever les dessins/modifications
        const message: string = 'reset ' + (leftPicture ? 'left' : 'right') + ' foreground';
        window.alert(message);
    }

    resetBackground(leftPicture: boolean): void {
        // TODO Remettre le fond en blanc
        const message: string = 'reset ' + (leftPicture ? 'left' : 'right') + ' Background';
        window.alert(message);
    }

    replicateForeground(leftPicture: boolean): void {
        // dupliquer l'avant plan du canevas appelé vers l'autre
        const message: string = 'replicated ' + (leftPicture ? 'left' : 'right') + ' foreground';
        window.alert(message);
    }

    launchValidation(): void {
        // TODO lancer la validation des erreurs avec le service créer
        window.alert('validation lancée');
    }

    modifyRadius(newRadius: number): void {
        // TODO changer le radius pour la nouvelle valeur
        this.radius = newRadius;
        window.alert('radius modified');
    }

    onUpdateRightImageInput(rightImageInput: HTMLInputElement): void {
        const file = rightImageInput.files?.item(0);
        if (file !== null && file !== undefined) {
            createImageBitmap(file).then((image) => {
                this.rightCanvas.nativeElement.getContext('2d')?.drawImage(image, 0, 0);
            });
        } else {
            // manage error
            window.alert('error reading file');
        }
    }

    onUpdateLeftImageInput(leftImageInput: HTMLInputElement): void {
        const file = leftImageInput.files?.item(0);
        if (file !== null && file !== undefined) {
            createImageBitmap(file).then((image) => {
                this.leftCanvas.nativeElement.getContext('2d')?.drawImage(image, 0, 0);
            });
        } else {
            // manage error
            window.alert('error reading file');
        }
    }

    goToConfiguration(): void {
        this.router.navigate(['/gameConfiguration']);
    }
}
