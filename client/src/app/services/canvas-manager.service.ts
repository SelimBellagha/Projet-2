import { Injectable } from '@angular/core';
import { DifferenceDetectionService } from './difference-detection.service';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './draw.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasManagerService {
    leftCanavsContext: CanvasRenderingContext2D;
    rightCanavsContext: CanvasRenderingContext2D;

    constructor(private differenceDetector: DifferenceDetectionService) {}

    changeRightBackground(file: File): void {
        if (file !== null && file !== undefined) {
            createImageBitmap(file).then((image) => {
                if (this.validateImageSize(image)) {
                    this.rightCanavsContext.drawImage(image, 0, 0);
                } else {
                    window.alert('Image height or width was not in correct 480 by 640 pixels size');
                }
            });
        } else {
            // manage error
            window.alert('error reading file');
        }
    }

    changeLeftBackground(file: File): void {
        if (file !== null && file !== undefined) {
            createImageBitmap(file).then((image) => {
                if (this.validateImageSize(image)) {
                    this.leftCanavsContext.drawImage(image, 0, 0);
                } else {
                    window.alert('Image height or width was not in correct 480 by 640 pixels size');
                }
            });
        } else {
            // manage error
            window.alert('error reading file');
        }
    }

    changeBothBackgrounds(file: File): void {
        if (file !== null && file !== undefined) {
            createImageBitmap(file).then((image) => {
                if (this.validateImageSize(image)) {
                    this.leftCanavsContext.drawImage(image, 0, 0);
                    this.rightCanavsContext.drawImage(image, 0, 0);
                } else {
                    window.alert('Image height or width was not in correct 480 by 640 pixels size');
                }
            });
        } else {
            // manage error
            window.alert('error reading file');
        }
    }

    resetLeftBackground(): void {
        this.leftCanavsContext.fillStyle = '#FFFFFF';
        this.leftCanavsContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }
    resetRightBackground(): void {
        this.rightCanavsContext.fillStyle = '#FFFFFF';
        this.rightCanavsContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }

    validateImageSize(image: ImageBitmap) {
        return image.height === DEFAULT_HEIGHT && image.width === DEFAULT_WIDTH;
    }

    launchVerification(radius: number) {
        const leftImageData = this.leftCanavsContext.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const rightImageData = this.rightCanavsContext.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const differenceImage = this.differenceDetector.launchDifferenceDetection(leftImageData, rightImageData, radius);
        // TEMP TO TEST
        this.rightCanavsContext.putImageData(differenceImage, 0, 0);
    }
}
