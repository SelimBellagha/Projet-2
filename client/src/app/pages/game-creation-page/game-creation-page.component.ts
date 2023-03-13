import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GameData } from '@app/interfaces/game.interface';
import { CanvasManagerService } from '@app/services/canvas-manager.service';
import { CommunicationService } from '@app/services/communication.service';
import { DisplayGameService } from '@app/services/display-game.service';

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
    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private canvasManager: CanvasManagerService,
        private commService: CommunicationService,
        private displayGames: DisplayGameService,
    ) {}

    ngAfterViewInit(): void {
        this.canvasManager.leftCanvasContext = this.leftCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasManager.rightCanvasContext = this.rightCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasManager.modalCanvasContext = this.modalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasManager.resetLeftBackground();
        this.canvasManager.resetRightBackground();
    }

    resetBackground(leftPicture: boolean): void {
        // Remettre le fond en blanc
        if (leftPicture) {
            this.canvasManager.resetLeftBackground();
        } else {
            this.canvasManager.resetRightBackground();
        }
    }

    onValidationLaunched(): void {
        // lancer la validation des erreurs avec le service créer
        this.canvasManager.launchVerification(this.radius).then((gameData) => {
            this.currentGameData = gameData;
            this.currentGameData.originalImage = this.leftCanvas.nativeElement.toDataURL('image/bmp');
            this.currentGameData.modifiedImage = this.rightCanvas.nativeElement.toDataURL('image/bmp');
            this.popUpWindow.nativeElement.style.display = 'block';
        });
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

    async onSave(gameName: HTMLInputElement): Promise<void> {
        const name = gameName.value;
        if (name) {
            window.alert('posting the game to server');
            this.currentGameData.name = name;
            this.commService.addNewGame(this.currentGameData);
            await this.displayGames.loadAllGames().then(() => console.log('games fetched'));
            this.goToConfiguration();
        } else {
            window.alert('name not valid');
        }
    }

    goToConfiguration(): void {
        this.router.navigate(['/config']);
    }
}
