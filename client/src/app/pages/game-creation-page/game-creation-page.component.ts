import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-game-creation-page',
    templateUrl: './game-creation-page.component.html',
    styleUrls: ['./game-creation-page.component.scss'],
})
export class GameCreationPageComponent {
    @ViewChild('modifiedImageCanvas') modifiedImageCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('modifiedImageInput') modifiedImageInput: ElementRef<HTMLInputElement>;
    radius: number = 3;

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

    updateModifiedImageDisplay(): void {
        // this.modifiedImageCanvas.nativeElement.getContext('2d')?.drawImage(this.modifiedImageInput.nativeElement.files[0], 0, 0);
        window.alert('received new file');
    }
}
