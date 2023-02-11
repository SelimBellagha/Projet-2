import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/components/play-area/play-area.component';
import { GameData } from '@app/interfaces/game-data';
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
        const vec2: Vec2 = { x: DEFAULT_WIDTH - 1, y: DEFAULT_HEIGHT - 1 };
        expect(service.isInCanvas(vec)).toBeTrue();
        expect(service.isInCanvas(vec2)).toBeTrue();
    });

    // TODO Tester launchDifference, findDifferences, createDifferenceImage, findNumber
    it('result of findDifferences should be an empty array if images are the same', () => {
        const imageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const result = service.findDifferences(imageData, imageData);
        expect(result).toEqual([]);
    });
    it('result of findDifferences should be an array of 1 vector if images have 1 pixel that is different', () => {
        const imageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const imageData2 = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        imageData2.data[0] = 255;
        const result = service.findDifferences(imageData, imageData2);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual({ x: 0, y: 0 });
    });

    it('findNumberOfDifferences should return 0 if image given is all white', () => {
        // Met tout en blanc
        const differenceImageMock = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let i = 0; i < differenceImageMock.data.length; i++) {
            differenceImageMock.data[i] = 255;
        }
        expect(service.findNumberOfDifference(differenceImageMock).length).toEqual(0);
    });

    it('findNumberOfDifferences should return 1 if image given has 1 black pixel', () => {
        // Met tout en blanc
        const differenceImageMock = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let i = 0; i < differenceImageMock.data.length; i++) {
            differenceImageMock.data[i] = 255;
        }
        differenceImageMock.data[0] = 0;
        expect(service.findNumberOfDifference(differenceImageMock).length).toEqual(1);
    });

    it('findNumberOfDifferences should return 7 if image given has 7 black distinct shapes', async () => {
        const image: HTMLImageElement = new Image();
        image.src = '../assets/tests/image_7_diff.bmp';
        await image.decode();
        const canvasContext = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        canvasContext.drawImage(image, 0, 0);
        const differenceImageMock = canvasContext.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(service.findNumberOfDifference(differenceImageMock).length).toEqual(7);
    });

    it('createDifferenceImage should return a blank image if array of pixels passed is empty', () => {
        const resultImage = service.createDifferenceImage([], 1);
        const blankImage: ImageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        // Met tout en blanc
        for (let i = 0; i < blankImage.data.length; i++) {
            blankImage.data[i] = 255;
        }
        expect(resultImage.data).toEqual(blankImage.data);
    });

    it('createDifferenceImage should call drawRadius for each pixel in array given', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spy = spyOn(service, 'drawRadius').and.callFake(() => {});
        const mockArray: Vec2[] = [
            { x: 3, y: 6 },
            { x: 9, y: 7 },
            { x: 7, y: 9 },
            { x: 46, y: 29 },
        ];
        service.createDifferenceImage(mockArray, 1);
        expect(spy).toHaveBeenCalledTimes(mockArray.length);
    });

    it('launchDifferencDetection should call findDifferences once', () => {
        const imageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const imageData2 = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const spy = spyOn(service, 'findDifferences').and.callThrough();
        service.launchDifferenceDetection(imageData, imageData2, 0);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('launchDifferencDetection should call createDifferenceImage once', () => {
        const imageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const imageData2 = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const spy = spyOn(service, 'createDifferenceImage').and.callThrough();
        service.launchDifferenceDetection(imageData, imageData2, 0);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('launchDifferencDetection should call findNumberOfDifference once', () => {
        const imageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const imageData2 = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const spy = spyOn(service, 'findNumberOfDifference').and.callThrough();
        service.launchDifferenceDetection(imageData, imageData2, 0);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('launchDifferencDetection should call getDifficulty once', () => {
        const imageData = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const imageData2 = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const spy = spyOn(service, 'getDifficulty').and.callThrough();
        service.launchDifferenceDetection(imageData, imageData2, 0);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('launchDifferenceDetection should return a gameData with 7 differences for files "image_7_diff" and a blank canvas', async () => {
        const image: HTMLImageElement = new Image();
        image.src = '../assets/tests/image_7_diff.bmp';
        await image.decode();
        const canvasContext = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        canvasContext.drawImage(image, 0, 0);
        const imageMock = canvasContext.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const blankMock = new ImageData(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let i = 0; i < blankMock.data.length; i++) {
            blankMock.data[i] = 255;
        }
        const result: GameData = await service.launchDifferenceDetection(imageMock, blankMock, 3);

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(result.nbDifferences).toEqual(7);
    });
});
