import { TestBed } from '@angular/core/testing';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/components/play-area/play-area.component';
import { Vec2 } from '@app/interfaces/vec2';

import { DifferenceDetectionService } from './difference-detection.service';

describe('DifferenceDetectionService', () => {
    let service: DifferenceDetectionService;
    const whiteValue = 255;
    const blackValue = 0;
    const pixelSize = 4;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DifferenceDetectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('calculateDistance should return the correct Distance', () => {
        const pos1: Vec2 = { x: 3, y: 4 };
        const pos2: Vec2 = { x: 0, y: 0 };
        const pos3: Vec2 = { x: -3, y: -4 };
        const expectedResult = 5;
        expect(service.calculateDistance(pos1, pos2)).toEqual(expectedResult);
        expect(service.calculateDistance(pos3, pos2)).toEqual(expectedResult);
    });

    it('calculateSumOfLengths should return the total length of arrays in an array', () => {
        const vec: Vec2 = { x: 0, y: 0 };
        const array: Vec2[][] = [[vec, vec], [vec], [vec, vec, vec], []];
        const expectedResult = 6;
        expect(service.calculateSumOfLengths(array)).toEqual(expectedResult);
    });

    it('calculateSumOfLengths should return 0 if array is empty', () => {
        const array: Vec2[][] = [];
        const expectedResult = 0;
        expect(service.calculateSumOfLengths(array)).toEqual(expectedResult);
    });
    it('getDifficulty should return false if number of differences is less than 7 and area covered is less than 15%', () => {
        const nbDifferences = 6;
        const array: Vec2[][] = new Array(nbDifferences);
        expect(service.getDifficulty(array)).toBeFalse();
    });
    it('getDifficulty should return true if number of differences is 7 or more and area covered is less than 15%', () => {
        const nbDifferences = 7;
        const array: Vec2[][] = new Array(nbDifferences);
        expect(service.getDifficulty(array)).toBeTrue();
    });
    it('getDifficulty should return false if number of differences is 7 or more but area covered is more than 15%', () => {
        const nbDifferences = 7;
        const array: Vec2[][] = new Array(nbDifferences);
        array.push(new Array(DEFAULT_HEIGHT * DEFAULT_WIDTH));
        expect(service.getDifficulty(array)).toBeFalse();
    });
    it('getDifficulty should return false if number of differences is less than 7 and area covered is more than 15%', () => {
        const nbDifferences = 5;
        const array: Vec2[][] = new Array(nbDifferences);
        array.push(new Array(DEFAULT_HEIGHT * DEFAULT_WIDTH));
        expect(service.getDifficulty(array)).toBeFalse();
    });
    it('isPointBlack should return false if point is not black', () => {
        const imageData: ImageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        imageData.data.fill(whiteValue);
        const vector: Vec2 = { x: 3, y: 4 };
        expect(service.isPointBlack(imageData, vector)).toBeFalse();
    });
    it('isPointBlack should return true if point is black', () => {
        const imageData: ImageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        imageData.data.fill(blackValue);
        const vector: Vec2 = { x: 3, y: 4 };
        expect(service.isPointBlack(imageData, vector)).toBeTrue();
    });
    it('isPointBlack should return false if point is not valid', () => {
        const imageData: ImageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const vector: Vec2 = { x: -1, y: 4 };
        expect(service.isPointBlack(imageData, vector)).toBeFalse();
    });

    it('comparePixels should return true if the arrays have the same RGBO values at specified index', () => {
        const array1: Uint8ClampedArray = new Uint8ClampedArray([0, 0, 1, 0]);
        const array2: Uint8ClampedArray = new Uint8ClampedArray([0, 0, 1, 0]);
        expect(service.comparePixels(array1, array2, 0)).toBeTrue();
    });

    it('comparePixels should return true if the arrays have a different R,G,B or O value at specified index', () => {
        const array1: Uint8ClampedArray = new Uint8ClampedArray([0, 0, 1, 0, 0, 1, 1, 0]);
        const array2: Uint8ClampedArray = new Uint8ClampedArray([0, 0, 1, 0, 0, 0, 1, 0]);
        expect(service.comparePixels(array1, array2, 1)).toBeFalse();
    });

    it('drawRadius should but in black every pixel that is in radius of center', () => {
        const center: Vec2 = { x: 0, y: 0 };
        const radius = 1;
        const imageData: ImageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        imageData.data.fill(whiteValue);
        service.drawRadius(imageData, radius, center);
        expect(imageData.data[0]).toEqual(blackValue);
        expect(imageData.data[pixelSize + 1]).toEqual(blackValue);
        expect(imageData.data[pixelSize * DEFAULT_WIDTH]).toEqual(blackValue);
        expect(imageData.data[pixelSize * (DEFAULT_WIDTH + 1)]).toEqual(whiteValue);
    });
    it('isInCanvas should be false if position is not in the canvas', () => {
        const vec: Vec2 = { x: -1, y: -1 };
        const vec2: Vec2 = { x: DEFAULT_WIDTH, y: 0 };
        expect(service.isInCanvas(vec)).toBeFalse();
        expect(service.isInCanvas(vec2)).toBeFalse();
    });
    it('isInCanvas should be true if position is in the canvas', () => {
        const vec: Vec2 = { x: 0, y: 0 };
        const vec2: Vec2 = { x: DEFAULT_HEIGHT - 1, y: DEFAULT_HEIGHT - 1 };
        expect(service.isInCanvas(vec)).toBeTrue();
        expect(service.isInCanvas(vec2)).toBeTrue();
    });

    // TODO Tester launchDifference, findDifferences, createDifferenceImage, findNumber
});
