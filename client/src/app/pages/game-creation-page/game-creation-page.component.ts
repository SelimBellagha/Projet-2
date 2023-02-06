import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GameData } from '@app/interfaces/game-data';
import { CanvasManagerService } from '@app/services/canvas-manager.service';

@Component({
    selector: 'app-game-creation-page',
    templateUrl: './game-creation-page.component.html',
    styleUrls: ['./game-creation-page.component.scss'],
})
export class GameCreationPageComponent implements AfterViewInit {
    @ViewChild('rightCanvas') rightCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('leftCanvas') leftCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('popUpWindow') popUpWindow: ElementRef<HTMLDivElement>;
    @ViewChild('modalCanvas') modalCanvas: ElementRef<HTMLCanvasElement>;

    radius: number = 3;
    currentGameData: GameData;
    constructor(private router: Router, private canvasManager: CanvasManagerService) {}

    ngAfterViewInit(): void {
        this.canvasManager.leftCanvasContext = this.leftCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasManager.rightCanvasContext = this.rightCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasManager.modalCanvasContext = this.modalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasManager.resetLeftBackground();
        this.canvasManager.resetRightBackground();
    }

    resetForeground(leftPicture: boolean): void {
        // enlever les dessins/modifications
        const message: string = 'reset ' + (leftPicture ? 'left' : 'right') + ' foreground';
        window.alert(message);
    }

    resetBackground(leftPicture: boolean): void {
        // Remettre le fond en blanc
        if (leftPicture) {
            this.canvasManager.resetLeftBackground();
        } else {
            this.canvasManager.resetRightBackground();
        }
    }

    replicateForeground(leftPicture: boolean): void {
        // dupliquer l'avant plan du canevas appelé vers l'autre
        const message: string = 'replicated ' + (leftPicture ? 'left' : 'right') + ' foreground';
        window.alert(message);
    }

    onValidationLaunched(): void {
        // lancer la validation des erreurs avec le service créer
        this.canvasManager.launchVerification(this.radius).then((gameData) => {
            this.currentGameData = gameData;

            this.popUpWindow.nativeElement.style.display = 'block';
        });
        this.popUpWindow.nativeElement.style.display = 'block';
    }

    modifyRadius(newRadius: number): void {
        this.radius = newRadius;
    }

    onUpdateRightImageInput(rightImageInput: HTMLInputElement): void {
        const file = rightImageInput.files?.item(0);
        this.canvasManager.changeRightBackground(file as File);
    }

    onUpdateLeftImageInput(leftImageInput: HTMLInputElement): void {
        const file = leftImageInput.files?.item(0);
        this.canvasManager.changeLeftBackground(file as File);
    }

    onUpdateMiddleImageInput(middleImageInput: HTMLInputElement): void {
        const file = middleImageInput.files?.item(0);
        this.canvasManager.changeBothBackgrounds(file as File);
    }
    onClosingPopUp(): void {
        this.popUpWindow.nativeElement.style.display = 'none';
    }

    onSave(gameName: HTMLInputElement): void {
        const name = gameName.value;
        if (name) {
            window.alert('posting the game to server');
            // TODO Implémenter la sauvegarde
            this.goToConfiguration();
        } else {
            window.alert('name not valid');
        }
    }

    goToConfiguration(): void {
        this.router.navigate(['/gameConfiguration']);
    }
}
