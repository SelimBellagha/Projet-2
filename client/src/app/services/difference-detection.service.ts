import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';

const PIXEL_SIZE = 4;

@Injectable({
    providedIn: 'root',
})
export class DifferenceDetectionService {
    launchDifferenceDetection(imageData1: ImageData, imageData2: ImageData, radius: number): void {
        this.findDifferences(imageData1, imageData2);
        window.alert(radius);
    }

    findDifferences(imageData1: ImageData, imageData2: ImageData): void {
        const pixelDifferences: Vec2[] = [];
        for (let i = 0; i <= imageData1.data.length / PIXEL_SIZE; i += 1) {
            if (!this.comparePixels(imageData1.data, imageData2.data, i)) {
                pixelDifferences.push({ x: i % imageData1.width, y: Math.floor(i / imageData1.width) });
            }
        }
        // eslint-disable-next-line no-console
        console.log(pixelDifferences);
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
}
