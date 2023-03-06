import { Injectable } from '@angular/core';
import { GameData } from '@app/interfaces/game-data';
import { Vec2 } from '@app/interfaces/vec2';
import { Tool } from '@app/pages/game-creation-page/game-creation-page.component';
import { DifferenceDetectionService } from './difference-detection.service';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './draw.service';

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

    activeTool: Tool;

    constructor(private differenceDetector: DifferenceDetectionService) {}

    init(): void {
        this.leftBackground = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.rightBackground = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.leftForeground = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.rightForeground = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.resetCanvases();
    }

    setTool(tool: Tool) {
        this.activeTool = tool;
    }

    onMouseDown(): void {
        // Down = true
        switch (this.activeTool) {
            case Tool.Pencil:
                // set le premier point
                break;
            case Tool.Rectangle:
                // save l'image avant le rectangle
                break;
            case Tool.Eraser:
                // mettre la position courant transparent + size
                break;
            default:
                // error
                break;
        }
    }

    onMouseMove(): void {
        switch (this.activeTool) {
            case Tool.Pencil:
                // faire un trait depuis le dernier point
                break;
            case Tool.Rectangle:
                // reset l'image à la dernière save
                // dessiner un rectangle de pt de départ à point courant
                break;
            case Tool.Eraser:
                // mettre la position courant transparent + size
                break;
            default:
                // error
                break;
        }
        // changer dernière position avecf pos courante
    }

    onMouseUp(): void {
        // down = false
        // Save l'avant plan courant
        // Switch prob pas nécéssaire
        switch (this.activeTool) {
            case Tool.Pencil:
                //
                break;
            case Tool.Rectangle:
                //
                break;
            case Tool.Eraser:
                //
                break;
            default:
                // error
                break;
        }
    }

    updateDisplay(): void {
        this.leftCanvasContext.drawImage(this.leftBackground, 0, 0);
        this.leftCanvasContext.drawImage(this.leftForeground, 0, 0);
        this.rightCanvasContext.drawImage(this.rightBackground, 0, 0);
        this.rightCanvasContext.drawImage(this.rightForeground, 0, 0);
    }

    duplicateLeft(): void {
        const ctx = this.rightForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.drawImage(this.leftForeground, 0, 0);
        this.updateDisplay();
    }

    duplicateRight(): void {
        const ctx = this.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.drawImage(this.rightForeground, 0, 0);
        this.updateDisplay();
    }

    swapForegrounds(): void {
        const tempCanvas = new OffscreenCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const tempContext = tempCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
        const leftContext = this.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        const rightContext = this.rightForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        tempContext.drawImage(this.leftForeground, 0, 0);
        leftContext.drawImage(this.rightBackground, 0, 0);
        rightContext.drawImage(tempCanvas, 0, 0);
        this.updateDisplay();
    }

    resetCanvases(): void {
        this.resetLeftBackground();
        this.resetRightBackground();
        this.resetLeftForeground();
        this.resetRightForeground();
    }

    resetRightForeground(): void {
        const ctx = this.rightForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.updateDisplay();
    }

    resetLeftForeground(): void {
        const ctx = this.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.updateDisplay();
    }

    async changeRightBackground(file: File): Promise<void> {
        if (this.isFileValid(file)) {
            await createImageBitmap(file).then((image) => {
                if (this.validateImageSize(image)) {
                    const ctx = this.rightBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
                    ctx.drawImage(image, 0, 0);
                    this.updateDisplay();
                } else {
                    this.notifyFileError();
                }
            });
        } else {
            this.notifyFileError();
        }
    }

    async changeLeftBackground(file: File): Promise<void> {
        if (this.isFileValid(file)) {
            await createImageBitmap(file).then((image) => {
                if (this.validateImageSize(image)) {
                    const ctx = this.leftBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
                    ctx.drawImage(image, 0, 0);
                    this.updateDisplay();
                } else {
                    this.notifyFileError();
                }
            });
        } else {
            this.notifyFileError();
        }
    }

    async changeBothBackgrounds(file: File): Promise<void> {
        if (this.isFileValid(file)) {
            await createImageBitmap(file).then((image) => {
                if (this.validateImageSize(image)) {
                    const ctx1 = this.leftBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
                    ctx1.drawImage(image, 0, 0);
                    const ctx2 = this.rightBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
                    ctx2.drawImage(image, 0, 0);
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

    resetLeftBackground(): void {
        const ctx = this.leftBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.updateDisplay();
    }
    resetRightBackground(): void {
        const ctx = this.rightBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
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
