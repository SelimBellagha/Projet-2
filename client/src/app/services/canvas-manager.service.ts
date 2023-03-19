import { Injectable } from '@angular/core';
import { CanvasAction } from '@app/interfaces/canvas-action';
import { GameData } from '@app/interfaces/game-data';
import { Vec2 } from '@app/interfaces/vec2';
import { Tool } from '@app/pages/game-creation-page/game-creation-page.component';
import { DifferenceDetectionService } from './difference-detection.service';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, DrawService } from './draw.service';
import { MouseHandlerService } from './mouse-handler.service';

export const BMP_24BIT_FILE_SIZE = 921654;

@Injectable({
    providedIn: 'root',
})
export class CanvasManagerService {
    leftCanvasContext: CanvasRenderingContext2D;
    rightCanvasContext: CanvasRenderingContext2D;
    modalCanvasContext: CanvasRenderingContext2D;
    leftBackground: OffscreenCanvas;
    rightBackground: OffscreenCanvas;
    leftForeground: OffscreenCanvas;
    rightForeground: OffscreenCanvas;
    tempRectangleCanvas: OffscreenCanvas;
    activeTool: Tool;
    actionsDone: CanvasAction[] = [];
    actionsUnDone: CanvasAction[] = [];

    constructor(
        private differenceDetector: DifferenceDetectionService,
        private drawService: DrawService,
        private mouseHandler: MouseHandlerService,
    ) {}

    init(): void {
        this.leftBackground = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.rightBackground = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.leftForeground = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.rightForeground = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.resetCanvases();
        this.actionsDone = [];
        this.saveAction();
        this.activeTool = Tool.Pencil;
        this.tempRectangleCanvas = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }

    setTool(tool: Tool) {
        this.activeTool = tool;
    }

    setColor(color: string) {
        this.drawService.setColor(color);
    }

    setWidth(width: number) {
        this.drawService.setWidth(width);
    }
    enableSquare(enable: boolean) {
        this.drawService.enableSquare(enable);
        if (this.activeTool === Tool.Rectangle && this.mouseHandler.isButtonDown())
            this.onMouseMove(this.mouseHandler.currentPosition, this.mouseHandler.isLeftCanvasSelected());
    }

    onMouseDown(clickPosition: Vec2, isLeftImage: boolean): void {
        this.mouseHandler.setFirstClick(clickPosition, isLeftImage);
        if (isLeftImage) {
            this.drawService.drawingContext = this.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        } else {
            this.drawService.drawingContext = this.rightForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        }
        const ctx = this.tempRectangleCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
        switch (this.activeTool) {
            case Tool.Rectangle:
                ctx.save();
                ctx.globalCompositeOperation = 'copy';
                ctx.drawImage(isLeftImage ? this.leftForeground : this.rightForeground, 0, 0);
                ctx.restore();
                break;
            case Tool.Eraser:
                this.drawService.erase(clickPosition);
                break;
            default:
                break;
        }
        this.updateDisplay();
    }

    onMouseMove(mousePosition: Vec2, isLeftImage: boolean): void {
        if (this.mouseHandler.isButtonDown() && isLeftImage === this.mouseHandler.isLeftCanvasSelected()) {
            switch (this.activeTool) {
                case Tool.Pencil:
                    this.drawService.drawLine(mousePosition, this.mouseHandler.getCurrentPosition());
                    break;
                case Tool.Rectangle:
                    this.drawService.drawingContext.save();
                    this.drawService.drawingContext.globalCompositeOperation = 'copy';
                    this.drawService.drawingContext.drawImage(this.tempRectangleCanvas, 0, 0);
                    this.drawService.drawingContext.restore();
                    this.drawService.drawRectangle(this.mouseHandler.getFirstPosition(), mousePosition);
                    break;
                case Tool.Eraser:
                    this.drawService.erase(mousePosition);
                    break;
            }
            this.mouseHandler.updatePosition(mousePosition);
        }
        this.updateDisplay();
    }

    onMouseUp(isLeftImage: boolean): void {
        if (isLeftImage === this.mouseHandler.isLeftCanvasSelected()) {
            this.mouseHandler.endClick();
            this.saveAction();
        }
    }
    saveAction(): void {
        const action = {
            leftCanvasImage: this.leftForeground.getContext('2d')?.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT) as ImageData,
            rightCanvasImage: this.rightForeground.getContext('2d')?.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT) as ImageData,
        };
        this.actionsDone.push(action);
        this.actionsUnDone = [];
    }

    undoAction(): void {
        if (this.actionsDone.length > 1) {
            this.actionsUnDone.push(this.actionsDone.pop() as CanvasAction);
        }
        this.leftForeground.getContext('2d')?.putImageData(this.actionsDone[this.actionsDone.length - 1].leftCanvasImage, 0, 0);
        this.rightForeground.getContext('2d')?.putImageData(this.actionsDone[this.actionsDone.length - 1].rightCanvasImage, 0, 0);
        this.updateDisplay();
    }

    redoAction(): void {
        if (this.actionsUnDone.length > 0) {
            this.actionsDone.push(this.actionsUnDone.pop() as CanvasAction);
            this.leftForeground.getContext('2d')?.putImageData(this.actionsDone[this.actionsDone.length - 1].leftCanvasImage, 0, 0);
            this.rightForeground.getContext('2d')?.putImageData(this.actionsDone[this.actionsDone.length - 1].rightCanvasImage, 0, 0);
            this.updateDisplay();
        }
    }

    updateDisplay(): void {
        this.leftCanvasContext.drawImage(this.leftBackground, 0, 0);
        this.leftCanvasContext.drawImage(this.leftForeground, 0, 0);
        this.rightCanvasContext.drawImage(this.rightBackground, 0, 0);
        this.rightCanvasContext.drawImage(this.rightForeground, 0, 0);
    }
    /*
    duplicateLeft(): void {
        const ctx = this.rightForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.save();
        ctx.globalCompositeOperation = 'copy';
        ctx.drawImage(this.leftForeground, 0, 0);
        ctx.restore();
        this.updateDisplay();
        this.saveAction();
    }
    
    duplicateRight(): void {
        const ctx = this.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.save();
        ctx.globalCompositeOperation = 'copy';
        ctx.drawImage(this.rightForeground, 0, 0);
        ctx.restore();
        this.updateDisplay();
        this.saveAction();
    }*/

    duplicate(left: boolean): void {
        const copy = left ? this.leftForeground : this.rightForeground;
        const target = left ? this.rightForeground : this.leftForeground;

        const ctx = target.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.save();
        ctx.globalCompositeOperation = 'copy';
        ctx.drawImage(copy, 0, 0);
        ctx.restore();
        this.updateDisplay();
        this.saveAction();
    }

    swapForegrounds(): void {
        const tempCanvas = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const tempContext = tempCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
        const leftContext = this.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        const rightContext = this.rightForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        leftContext.save();
        rightContext.save();
        tempContext.globalCompositeOperation = 'copy';
        tempContext.drawImage(this.leftForeground, 0, 0);
        leftContext.globalCompositeOperation = 'copy';
        leftContext.drawImage(this.rightForeground, 0, 0);
        rightContext.globalCompositeOperation = 'copy';
        rightContext.drawImage(tempCanvas, 0, 0);
        leftContext.restore();
        rightContext.restore();
        this.updateDisplay();
        this.saveAction();
    }

    resetCanvases(): void {
        this.resetBackground(true);
        this.resetBackground(false);
        this.resetForeground(true);
        this.resetForeground(false);
    }
    resetForeground(left: boolean) {
        const ctx = (left ? this.leftForeground : this.rightForeground).getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.clearRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.updateDisplay();
        this.saveAction();
    }
    async changeBackgrounds(file: File, changeLeft: boolean, changeRight: boolean): Promise<void> {
        if (this.isFileValid(file)) {
            await createImageBitmap(file).then((image) => {
                if (this.validateImageSize(image)) {
                    if (changeLeft) {
                        const ctx1 = this.leftBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
                        ctx1.drawImage(image, 0, 0);
                    }
                    if (changeRight) {
                        const ctx2 = this.rightBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
                        ctx2.drawImage(image, 0, 0);
                    }
                    this.updateDisplay();
                } else {
                    this.notifyFileError();
                }
            });
        } else {
            this.notifyFileError();
        }
    }

    isFileValid(file: File): boolean {
        return file !== null && file !== undefined && file.type === 'image/bmp' && file.size === BMP_24BIT_FILE_SIZE;
    }

    notifyFileError(): void {
        window.alert("Fichier invalide: l'image doit être en format BMP 24-bit et de taille 640x480");
    }

    resetBackground(left: boolean): void {
        const ctx = (left ? this.leftBackground : this.rightBackground).getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.updateDisplay();
    }

    validateImageSize(image: ImageBitmap) {
        return image.height === DEFAULT_HEIGHT && image.width === DEFAULT_WIDTH;
    }

    async launchVerification(radius: number): Promise<GameData> {
        const leftImageData = this.leftCanvasContext.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const rightImageData = this.rightCanvasContext.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const gameData: GameData = await this.differenceDetector.launchDifferenceDetection(leftImageData, rightImageData, radius);
        const pixelDifferences: Vec2[] = this.differenceDetector.findDifferences(leftImageData, rightImageData);
        const differenceImageData: ImageData = this.differenceDetector.createDifferenceImage(pixelDifferences, radius);
        this.modalCanvasContext.putImageData(differenceImageData, 0, 0);
        return gameData;
    }
}
