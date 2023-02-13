import { TestBed } from '@angular/core/testing';
import { GameData } from '@app/interfaces/game-data';

import { HttpClientModule } from '@angular/common/http';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/interfaces/vec2';
import { GameManagerService } from './game-manager.service';

describe('GameManagerService', () => {
    let service: GameManagerService;
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const PIXEL_SIZE = 4;
    const whiteValue = 255;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
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
        service.initalizeGame(gameMock as GameData);
        expect(service.gameData).toEqual(gameMock as GameData);
        expect(service.differencesFound.length).toEqual(gameMock.nbDifferences);
    });
    it('flashImage should call flashPixels once with each canvas', async () => {
        const spy = spyOn(service, 'flashPixels');
        await service.flashImages([]);
        expect(spy).toHaveBeenCalledTimes(2);
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
});
