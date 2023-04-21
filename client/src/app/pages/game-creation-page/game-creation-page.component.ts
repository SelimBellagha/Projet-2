import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { GameData } from '@app/interfaces/game.interface';
import { Inputs } from '@app/interfaces/inputs';
import { CanvasManagerService } from '@app/services/canvas-manager.service';
import { CommunicationService } from '@app/services/communication.service';

export enum Tool {
    Pencil,
    Rectangle,
    Eraser,
}

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
    inputsStates: Inputs = { isShiftPressed: false, isControlPressed: false, isZPressed: false };
    constructor(private router: Router, private canvasManager: CanvasManagerService, private commService: CommunicationService) {}

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ShiftRight':
            case 'ShiftLeft':
                this.inputsStates.isShiftPressed = true;
                this.canvasManager.enableSquare(true);
                break;
            case 'ControlLeft':
            case 'ControlRight':
                this.inputsStates.isControlPressed = true;
                break;
            case 'KeyZ':
                if (this.inputsStates.isControlPressed) {
                    if (this.inputsStates.isShiftPressed) {
                        this.canvasManager.redoAction();
                    } else {
                        this.canvasManager.undoAction();
                    }
                }
                break;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent) {
        switch (event.code) {
            case 'ShiftRight':
            case 'ShiftLeft':
                this.inputsStates.isShiftPressed = false;
                this.canvasManager.enableSquare(false);
                break;
            case 'ControlLeft':
            case 'ControlRight':
                this.inputsStates.isControlPressed = false;
                break;
        }
    }

    ngAfterViewInit(): void {
        this.canvasManager.leftCanvasContext = this.leftCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasManager.rightCanvasContext = this.rightCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasManager.modalCanvasContext = this.modalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasManager.init();
    }

    changeTool(tool: Tool) {
        this.canvasManager.setTool(tool);
    }

    resetBackground(leftPicture: boolean): void {
        this.canvasManager.resetBackground(leftPicture);
    }

    onValidationLaunched(): void {
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

    onUpdateInput(imageInput: HTMLInputElement, changeLeft: boolean, changeRight: boolean): void {
        const file = imageInput.files?.item(0);
        this.canvasManager.changeBackgrounds(file as File, changeLeft, changeRight);
        imageInput.value = '';
    }

    onSwap(): void {
        this.canvasManager.swapForegrounds();
    }
    onDuplicate(leftImage: boolean): void {
        this.canvasManager.duplicate(leftImage);
    }

    onResetForeground(leftImage: boolean) {
        this.canvasManager.resetForeground(leftImage);
    }

    onUndo(): void {
        this.canvasManager.undoAction();
    }

    onRedo(): void {
        this.canvasManager.redoAction();
    }

    onSetWidth(width: string): void {
        this.canvasManager.setWidth(Number(width));
    }

    onChangeColor(color: string) {
        this.canvasManager.setColor(color);
    }
    onClosingPopUp(): void {
        this.popUpWindow.nativeElement.style.display = 'none';
    }

    onSave(gameName: HTMLInputElement): void {
        const name = gameName.value;
        if (name && !name.includes(' ')) {
            this.currentGameData.name = name;
            this.commService.addNewGame(this.currentGameData);
            this.goToConfiguration();
        } else {
            window.alert('name not valid');
        }
    }

    goToConfiguration(): void {
        this.router.navigate(['/config']);
    }

    onMouseDown(event: MouseEvent, isLeftImage: boolean): void {
        if (event.button === MouseButton.Left) {
            const clickPosition = { x: event.offsetX, y: event.offsetY };
            this.canvasManager.onMouseDown(clickPosition, isLeftImage);
        }
    }

    onMouseMove(event: MouseEvent, isLeftImage: boolean): void {
        const clickPosition = { x: event.offsetX, y: event.offsetY };
        this.canvasManager.onMouseMove(clickPosition, isLeftImage);
    }

    onMouseUp(event: MouseEvent, isLeftImage: boolean): void {
        if (event.button === MouseButton.Left) {
            this.canvasManager.onMouseUp(isLeftImage);
        }
    }
}
