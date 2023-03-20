import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GameData } from '@app/interfaces/game-data';
import { Vec2 } from '@app/interfaces/vec2';
import { Verification } from '@app/interfaces/verification';
import { DifferenceVerificationService } from './difference-verification.service';
import { GameManagerService } from './game-manager.service';
import SpyObj = jasmine.SpyObj;

describe('GameManagerService', () => {
    let service: GameManagerService;
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const PIXEL_SIZE = 4;
    const whiteValue = 255;
    let differenceVerificationSpy: SpyObj<DifferenceVerificationService>;
    // let canvas: CanvasRenderingContext2D;
    // const mockCanvas = document.createElement('canvas');
    // const mockContext = mockCanvas.getContext('2d') as CanvasRenderingContext2D;
    // const mockImageData = new ImageData(640, 480);

    beforeEach(() => {
        differenceVerificationSpy = jasmine.createSpyObj('DifferenceVerificationService', ['differenceVerification']);
        // spyOn(mockContext, 'getImageData').and.returnValue(mockImageData);
        // spyOn(mockContext, 'putImageData');
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [{ provide: DifferenceVerificationService, useValue: differenceVerificationSpy }],
        });
        service = TestBed.inject(GameManagerService);
        service.originalImageCanvas = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.modifiedImageCanvas = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initilaize game should correctly initialize game parameters', () => {
        const gameMock = { nbDifferences: 2 };
        service.initializeGame(gameMock as GameData);
        expect(service.gameData).toEqual(gameMock as GameData);
        expect(service.differencesFound.length).toEqual(gameMock.nbDifferences);
    });
    it('flashImage should call flashPixels once with each canvas', async () => {
        const spy = spyOn(service, 'flashPixels');
        await service.flashImages([]);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    // it('should flash the given pixels on the canvas', async () => {
    //     const mockSource = '../assets/tests/image_7_diff.bmp';

    //     service.gameData = { originalImage: mockSource, modifiedImage: mockSource } as GameData;
    //     service.state = false;
    //     service.flashPixelsCheat(service.gameData.differences, service.modifiedImageCanvas);
    //     service.gameData = { originalImage: mockSource, modifiedImage: mockSource } as GameData;
    //     // const originalCanvasSpy = spyOn(service.originalImageCanvas, 'drawImage');
    //     // const modifiedCanvasSpy = spyOn(service.modifiedImageCanvas, 'drawImage');

    //     // Check that the putImageData function was called with the correct arguments
    //     expect(canvas.getImageData).toHaveBeenCalled();
    // });

    it('should return the value of toggle', () => {
        service.state = true;
        service.stateChanger();
        expect(service.state).toBe(false);

        service.state = false;
        service.stateChanger();
        expect(service.state).toBe(true);
    });

    it('flashPixels should not change the final canvas', async () => {
        const originalData = service.originalImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const pixelsMock: Vec2[] = [
            { x: 0, y: 1 },
            { x: 2, y: 2 },
        ];
        await service.flashPixels(pixelsMock, service.originalImageCanvas);
        const finalData = service.originalImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        expect(finalData).toEqual(originalData);
    });

    it('replacePixels should copy every specified pixel of the originalCanvas on the modified canvas', () => {
        const pixelsMock: Vec2[] = [
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: 2 },
            { x: 0, y: 6 },
        ];
        service.originalImageCanvas.fillStyle = '#FFFFFF';
        service.originalImageCanvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        service.replacePixels(pixelsMock);
        const imageData = service.modifiedImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const nbModifiedPixels = imageData.filter((x) => x === whiteValue).length;
        expect(nbModifiedPixels).toEqual(pixelsMock.length * PIXEL_SIZE);
    });

    it('errorMessage should call drawError once with each canvas', async () => {
        const spy = spyOn(service, 'drawError');
        const posMock = { x: 3, y: 4 };
        await service.errorMessage(posMock);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('errorMessage should not change the final canvas', async () => {
        const originalData = service.originalImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const posMock = { x: 3, y: 4 };
        await service.errorMessage(posMock);
        const finalData = service.originalImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        expect(finalData).toEqual(originalData);
    });

    it('drawError should call fillText on canvas as many time as letters in "ERREUR" ', () => {
        const posMock = { x: 3, y: 4 };
        const spy = spyOn(service.originalImageCanvas, 'fillText');
        const word = 'ERREUR';
        service.drawError(service.originalImageCanvas, posMock);
        expect(spy).toHaveBeenCalledTimes(word.length);
    });

    it(' drawError should color pixels on the canvas', () => {
        let imageData = service.originalImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        const posMock = { x: 3, y: 4 };
        service.drawError(service.originalImageCanvas, posMock);
        imageData = service.originalImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it('putImages should call drawImage on both of the canvases', async () => {
        const mockSource = '../assets/tests/image_7_diff.bmp';
        service.gameData = { originalImage: mockSource, modifiedImage: mockSource } as GameData;
        const originalCanvasSpy = spyOn(service.originalImageCanvas, 'drawImage');
        const modifiedCanvasSpy = spyOn(service.modifiedImageCanvas, 'drawImage');
        await service.putImages();
        expect(originalCanvasSpy).toHaveBeenCalled();
        expect(modifiedCanvasSpy).toHaveBeenCalled();
    });

    it('verifyDifference should call differenceVerification from service', () => {
        const position: Vec2 = { x: 0, y: 0 };
        service.gameData = { id: 0 } as unknown as GameData;
        differenceVerificationSpy.differenceVerification.and.resolveTo({ result: false, index: -1 });
        service.verifyDifference(position);
        expect(differenceVerificationSpy.differenceVerification).toHaveBeenCalled();
    });

    it('verifyDifference should return true if position is in a difference that is not found yet', async () => {
        service.gameData = { id: 0 } as unknown as GameData;
        const position: Vec2 = { x: 0, y: 0 };
        const result: Verification = { result: true, index: 0 };
        service.differencesFound = [false, false];
        differenceVerificationSpy.differenceVerification.and.resolveTo(result);
        expect(await service.verifyDifference(position)).toBeTrue();
    });
    it('verifyDifference should return false if position is in a difference that is already found ', async () => {
        const position: Vec2 = { x: 0, y: 0 };
        service.gameData = { id: 0 } as unknown as GameData;
        const result: Verification = { result: true, index: 0 };
        service.differencesFound = [false, false];
        differenceVerificationSpy.differenceVerification.and.resolveTo(result);
        await service.verifyDifference(position);
        expect(await service.verifyDifference(position)).toBeFalse();
    });

    it('onPositionClicked should return false if service is locked', async () => {
        const position: Vec2 = { x: 0, y: 0 };
        service.locked = true;
        expect(await service.onPositionClicked(position)).toBeFalse();
    });
    it('onPositionClicked should call errorMessage if position is not in a difference that is not found', async () => {
        const position: Vec2 = { x: 0, y: 0 };
        spyOn(service, 'verifyDifference').and.resolveTo(false);
        const spy = spyOn(service, 'drawError');
        service.locked = false;
        await service.onPositionClicked(position);
        expect(spy).toHaveBeenCalled();
    });
    it('onPositionClicked should call playDifferenceAudio, flashImages and replacePixels if position is verified', async () => {
        const position: Vec2 = { x: 0, y: 0 };
        spyOn(service, 'verifyDifference').and.resolveTo(true);
        service.gameData = { differences: [[]] } as unknown as GameData;
        service.lastDifferenceFound = 0;
        const spy1 = spyOn(service, 'playDifferenceAudio');
        const spy2 = spyOn(service, 'flashImages').and.resolveTo();
        const spy3 = spyOn(service, 'replacePixels').and.resolveTo();
        service.locked = false;
        await service.onPositionClicked(position);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('playDifferenceAudio should call playAudio', () => {
        const spy = spyOn(service, 'playAudio');
        service.playDifferenceAudio();
        expect(spy).toHaveBeenCalled();
    });

    it('playWinAudio should call playAudio', () => {
        const spy = spyOn(service, 'playAudio');
        service.playWinAudio();
        expect(spy).toHaveBeenCalled();
    });
    it('playWinAudio should call playErrorAudio', () => {
        const spy = spyOn(service, 'playErrorAudio');
        service.playErrorAudio();
        expect(spy).toHaveBeenCalled();
    });
});
