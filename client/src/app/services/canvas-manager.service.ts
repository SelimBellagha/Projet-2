import { Injectable } from '@angular/core';
import { GameData } from '@app/interfaces/game-data';
import { DifferenceDetectionService } from './difference-detection.service';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './draw.service';

const BMP_24BIT_FILE_SIZE = 921654;

@Injectable({
    providedIn: 'root',
})
export class CanvasManagerService {
    leftCanvasContext: CanvasRenderingContext2D;
    rightCanvasContext: CanvasRenderingContext2D;
    modalCanvasContext: CanvasRenderingContext2D;

    constructor(private differenceDetector: DifferenceDetectionService) {}

    changeRightBackground(file: File): void {
        if (this.isFileValid(file)) {
            createImageBitmap(file).then((image) => {
                if (this.validateImageSize(image)) {
                    this.rightCanvasContext.drawImage(image, 0, 0);
                } else {
                    this.notifyFileError();
                }
            });
        } else {
            this.notifyFileError();
        }
    }

    changeLeftBackground(file: File): void {
        if (this.isFileValid(file)) {
            createImageBitmap(file).then((image) => {
                if (this.validateImageSize(image)) {
                    this.leftCanvasContext.drawImage(image, 0, 0);
                } else {
                    this.notifyFileError();
                }
            });
        } else {
            this.notifyFileError();
        }
    }

    changeBothBackgrounds(file: File): void {
        if (this.isFileValid(file)) {
            createImageBitmap(file).then((image) => {
                if (this.validateImageSize(image)) {
                    this.leftCanvasContext.drawImage(image, 0, 0);
                    this.rightCanvasContext.drawImage(image, 0, 0);
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
        this.leftCanvasContext.fillStyle = '#FFFFFF';
        this.leftCanvasContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }
    resetRightBackground(): void {
        this.rightCanvasContext.fillStyle = '#FFFFFF';
        this.rightCanvasContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }

    validateImageSize(image: ImageBitmap) {
        return image.height === DEFAULT_HEIGHT && image.width === DEFAULT_WIDTH;
    }

    async launchVerification(radius: number): Promise<GameData> {
        const leftImageData = this.leftCanvasContext.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const rightImageData = this.rightCanvasContext.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const gameData: GameData = await this.differenceDetector.launchDifferenceDetection(leftImageData, rightImageData, radius);
        this.modalCanvasContext.putImageData(gameData.differenceImage, 0, 0);
        return gameData;
    }
}
