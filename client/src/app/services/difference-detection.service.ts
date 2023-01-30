import { Injectable } from '@angular/core';
import { DEFAULT_HEIGHT } from '@app/components/play-area/play-area.component';
import { Vec2 } from '@app/interfaces/vec2';
import { DEFAULT_WIDTH } from './draw.service';

const PIXEL_SIZE = 4;
const DIRECTIONS: Vec2[] = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
];

@Injectable({
    providedIn: 'root',
})
export class DifferenceDetectionService {
    launchDifferenceDetection(imageData1: ImageData, imageData2: ImageData, radius: number): ImageData {
        const pixelDifferences: Vec2[] = this.findDifferences(imageData1, imageData2);
        const differenceImage: ImageData = this.createDifferenceImage(pixelDifferences, radius);
        this.findNumberOfDifference(differenceImage);
        return differenceImage;
    }

    findDifferences(imageData1: ImageData, imageData2: ImageData): Vec2[] {
        const pixelDifferences: Vec2[] = [];
        for (let i = 0; i <= imageData1.data.length / PIXEL_SIZE; i += 1) {
            if (!this.comparePixels(imageData1.data, imageData2.data, i)) {
                pixelDifferences.push({ x: i % imageData1.width, y: Math.floor(i / imageData1.width) });
            }
        }
        // eslint-disable-next-line no-console
        return pixelDifferences;
    }

    comparePixels(array1: Uint8ClampedArray, array2: Uint8ClampedArray, index: number): boolean {
        // On doit comparer 4 eléments à la fois, 1 pixel est représenté sur 4 Uint8
        const indexStartPoint = PIXEL_SIZE * index;
        return (
            array1[indexStartPoint] === array2[indexStartPoint] &&
            array1[indexStartPoint + 1] === array2[indexStartPoint + 1] &&
            array1[indexStartPoint + 2] === array2[indexStartPoint + 2] &&
            array1[indexStartPoint + 3] === array2[indexStartPoint + 3]
        );
    }

    createDifferenceImage(pixelDifferences: Vec2[], radius: number): ImageData {
        const differencesImage: ImageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        // Met tout en blanc
        for (let i = 0; i < differencesImage.data.length; i++) {
            differencesImage.data[i] = 255;
        }
        pixelDifferences.forEach((pixelPosition) => {
            this.drawRadius(differencesImage, radius, pixelPosition);
        });
        return differencesImage;
    }

    drawRadius(differencesImage: ImageData, radius: number, center: Vec2): void {
        for (let i = 0 - radius; i <= radius; i++) {
            for (let j = 0 - radius; j <= radius; j++) {
                const pixelPosition = { x: center.x + j, y: center.y + i };
                if (this.calculateDistance(center, pixelPosition) <= radius) {
                    const pixelStartPosition = PIXEL_SIZE * (pixelPosition.x + pixelPosition.y * DEFAULT_WIDTH);
                    differencesImage.data[pixelStartPosition] = 0;
                    differencesImage.data[pixelStartPosition + 1] = 0;
                    differencesImage.data[pixelStartPosition + 2] = 0;
                    differencesImage.data[pixelStartPosition + 3] = 255;
                } else {
                    // eslint-disable-next-line no-console
                }
            }
        }
    }

    findNumberOfDifference(differenceImage: ImageData): void {
        const differences: Vec2[][] = [];
        let nbDifferences = 0;
        const isPixelChecked: boolean[][] = new Array(DEFAULT_HEIGHT).fill(false).map(() => new Array(DEFAULT_WIDTH).fill(false));

        for (let i = 0; i < differenceImage.data.length / PIXEL_SIZE; i++) {
            const pixelPosition: Vec2 = { x: i % DEFAULT_WIDTH, y: Math.floor(i / DEFAULT_WIDTH) };

            if (differenceImage.data[i * PIXEL_SIZE] === 0 && !isPixelChecked[pixelPosition.y][pixelPosition.x]) {
                const pixelStack: Vec2[] = [];
                pixelStack.push(pixelPosition);
                differences[nbDifferences] = [];

                while (pixelStack.length) {
                    const currentPixel: Vec2 = pixelStack.pop() as Vec2;
                    differences[nbDifferences].push(currentPixel);

                    // Pour chaque direction, vérifier la couleur et push
                    DIRECTIONS.forEach((direction) => {
                        const newPixel: Vec2 = { x: currentPixel.x + direction.x, y: currentPixel.y + direction.y };
                        if (this.isPointBlack(differenceImage, newPixel) && !isPixelChecked[newPixel.y][newPixel.x]) {
                            pixelStack.push(newPixel);
                        }
                        isPixelChecked[newPixel.y][newPixel.x] = true;
                    });
                }

                nbDifferences++;
            }
        }
        // eslint-disable-next-line no-console
        console.log(differences);
        window.alert('nombre de différences:' + nbDifferences);
    }

    isPointBlack(differenceImage: ImageData, pixelPosition: Vec2): boolean {
        // assume que le point est soit noir, soit blanc
        if (pixelPosition.x < 0 || pixelPosition.y < 0) {
            return false;
        } else {
            return differenceImage.data[PIXEL_SIZE * (pixelPosition.x + pixelPosition.y * DEFAULT_WIDTH)] === 0;
        }
    }

    calculateDistance(point1: Vec2, point2: Vec2): number {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }
}