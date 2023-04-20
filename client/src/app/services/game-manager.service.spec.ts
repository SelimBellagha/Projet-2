/* eslint-disable max-lines */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GameData } from '@app/interfaces/game-data';
import { Vec2 } from '@app/interfaces/vec2';
import { Verification } from '@app/interfaces/verification';
import { ActionSaverService } from './action-saver.service';
import { DifferenceVerificationService } from './difference-verification.service';
import { GameManagerService } from './game-manager.service';
import { SocketClientService } from './socket-client-service.service';
import SpyObj = jasmine.SpyObj;

describe('GameManagerService', () => {
    let service: GameManagerService;
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const PIXEL_SIZE = 4;
    const whiteValue = 255;
    let differenceVerificationSpy: SpyObj<DifferenceVerificationService>;
    let actionSaverSpy: SpyObj<ActionSaverService>;
    let socketServiceSpy: SpyObj<SocketClientService>;
    let routerSpy: SpyObj<Router>;
    const pointA: Vec2 = { x: 0, y: 240 };

    beforeEach(() => {
        differenceVerificationSpy = jasmine.createSpyObj('DifferenceVerificationService', ['differenceVerification']);
        actionSaverSpy = jasmine.createSpyObj('ActionSaverService', [
            'addClickAction',
            'reset',
            'addHintAction',
            'addOpponentAction',
            'addLastHintAction',
        ]);
        routerSpy = jasmine.createSpyObj('Router', [], { url: '/soloLimitedTime' });
        socketServiceSpy = jasmine.createSpyObj('SocketClientService', ['send']);
        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule],
            providers: [
                { provide: DifferenceVerificationService, useValue: differenceVerificationSpy },
                { provide: ActionSaverService, useValue: actionSaverSpy },
                { provide: SocketClientService, useValue: socketServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
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
    it('flashImage should call flashPixels once with each canvas and then call replacePixels', async () => {
        const spy = spyOn(service, 'flashPixels');
        const spy2 = spyOn(service, 'replacePixels');
        service.gameData = { differences: [{} as Vec2[], {} as Vec2[]] } as GameData;
        service.lastDifferenceFound = 0;
        await service.flashImages([]);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy2).toHaveBeenCalled();
    });

    it('should return the value of toggle', () => {
        service.cheatState = true;
        service.stateChanger();
        expect(service.cheatState).toBe(false);

        service.cheatState = false;
        service.stateChanger();
        expect(service.cheatState).toBe(true);
    });

    it('should return the value of hint toggle', () => {
        service.hintState = true;
        service.hintStateChanger();
        expect(service.hintState).toBe(false);

        service.hintState = false;
        service.hintStateChanger();
        expect(service.hintState).toBe(true);
    });

    it('should return the value of difference toggle', () => {
        service.foundDifferenceCheat = true;
        service.differenceCheatChanger();
        expect(service.foundDifferenceCheat).toBe(false);

        service.foundDifferenceCheat = false;
        service.differenceCheatChanger();
        expect(service.foundDifferenceCheat).toBe(true);
    });
    it('should draw a line between two points with red color and width of 1', () => {
        const firstPoint = pointA;
        const endPoint = pointA;
        spyOn(service.originalImageCanvas, 'beginPath').and.callThrough();
        spyOn(service.originalImageCanvas, 'moveTo').and.callThrough();
        spyOn(service.originalImageCanvas, 'lineTo').and.callThrough();
        spyOn(service.originalImageCanvas, 'stroke').and.callThrough();

        service.drawLine(firstPoint, endPoint);

        expect(service.originalImageCanvas.beginPath).toHaveBeenCalled();
        expect(service.originalImageCanvas.moveTo).toHaveBeenCalledWith(firstPoint.x, firstPoint.y);
        expect(service.originalImageCanvas.lineTo).toHaveBeenCalledWith(endPoint.x, endPoint.y);
        expect(service.originalImageCanvas.strokeStyle).toEqual('#ff0000');
        expect(service.originalImageCanvas.lineWidth).toEqual(1);
        expect(service.originalImageCanvas.stroke).toHaveBeenCalled();
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
        const spyAudio = spyOn(service, 'playAudio');
        const spy = spyOn(service, 'drawError');
        const posMock = { x: 3, y: 4 };
        await service.errorMessage(posMock);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spyAudio).toHaveBeenCalled();
    });

    it('errorMessage should not change the final canvas', async () => {
        const spy = spyOn(service, 'playAudio');
        const originalData = service.originalImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const posMock = { x: 3, y: 4 };
        await service.errorMessage(posMock);
        const finalData = service.originalImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        expect(finalData).toEqual(originalData);
        expect(spy).toHaveBeenCalled();
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
        const spy2 = spyOn(service, 'playErrorAudio');
        service.locked = false;
        await service.onPositionClicked(position);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
    it('onPositionClicked should call playDifferenceAudio and  flashImages if position is verified', async () => {
        const position: Vec2 = { x: 0, y: 0 };
        spyOn(service, 'verifyDifference').and.resolveTo(true);
        service.gameData = { differences: [[]] } as unknown as GameData;
        service.lastDifferenceFound = 0;
        const spy1 = spyOn(service, 'playDifferenceAudio');
        const spy2 = spyOn(service, 'flashImages').and.resolveTo();
        service.locked = false;
        spyOn(service, 'changeGame');
        await service.onPositionClicked(position);

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
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

    it('playErrorAudio should call playAudio', () => {
        const spy = spyOn(service, 'playAudio');
        service.playErrorAudio();
        expect(spy).toHaveBeenCalled();
    });

    it('playErrorAudio should call playAudio', () => {
        const spy = spyOn(service, 'playAudio');
        service.playErrorAudio();
        expect(spy).toHaveBeenCalled();
    });

    it('flashPixelsCheat should not modify the images after the execution ', async () => {
        const originalData = service.originalImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const pixelsMock: Vec2[][] = [
            [
                { x: 0, y: 1 },
                { x: 2, y: 2 },
            ],
        ];
        service.gameData = { nbDifferences: 1 } as GameData;
        service.cheatState = true;
        setTimeout(() => {
            service.cheatState = false;
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        }, 1000);
        await service.flashPixelsCheat(pixelsMock, service.originalImageCanvas);
        const finalData = service.originalImageCanvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        expect(finalData).toEqual(originalData);
    });

    it('flashPixelsCheat should call replacePixels if foundDifferenceCheat is true', async () => {
        const spy = spyOn(service, 'replacePixels');
        const pixelsMock: Vec2[][] = [
            [
                { x: 0, y: 1 },
                { x: 2, y: 2 },
            ],
        ];
        service.gameData = { nbDifferences: 1, differences: [{} as Vec2[]] } as GameData;
        service.cheatState = true;
        service.foundDifferenceCheat = true;
        service.differencesFound = [false];
        setTimeout(() => {
            service.cheatState = false;
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        }, 1000);
        await service.flashPixelsCheat(pixelsMock, service.originalImageCanvas);
        expect(spy).toHaveBeenCalled();
    });
    it('flashPixelsCheat should call replacePixels twice if foundDifferenceCheat true but difference is already found', async () => {
        const spy = spyOn(service, 'replacePixels');
        const pixelsMock: Vec2[][] = [
            [
                { x: 0, y: 1 },
                { x: 2, y: 2 },
            ],
        ];
        service.gameData = { nbDifferences: 1, differences: [{} as Vec2[]] } as GameData;
        service.cheatState = true;
        service.foundDifferenceCheat = true;
        service.differencesFound = [true];
        setTimeout(() => {
            service.cheatState = false;
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        }, 1000);
        await service.flashPixelsCheat(pixelsMock, service.originalImageCanvas);
        expect(spy).toHaveBeenCalledWith(pixelsMock[0]);
    });
    it('opponentFoundDifference should call flashImages with the id received', () => {
        const spy = spyOn(service, 'flashImages');
        service.gameData = { differences: [{} as Vec2[]] } as GameData;
        service.gameData.differences[0] = [];
        service.opponentFoundDifference(0);
        expect(spy).toHaveBeenCalledOnceWith([]);
    });
    it('restartGame should call putImages to reset the canvases', () => {
        service.gameData = { nbDifferences: 1 } as GameData;
        const spy = spyOn(service, 'putImages');
        service.restartGame();
        expect(spy).toHaveBeenCalled();
    });
    it('restartGame should reset gameAttributes ', () => {
        service.gameData = { nbDifferences: 1 } as GameData;
        service.differencesFound = [true];
        spyOn(service, 'putImages');
        service.restartGame();
        expect(service.differencesFound[0]).toBeFalse();
    });
    it('enableReplay should change replayMode attribute to true', () => {
        service.replayMode = false;
        service.enableReplay();
        expect(service.replayMode).toBeTrue();
    });
    it('giveHint3 should call addLastHintAction from actionSaver', () => {
        service.giveHint3({ x: 1, y: 1 } as Vec2);
        expect(actionSaverSpy.addLastHintAction).toHaveBeenCalled();
    });
    it('giveHint3 should call strokeText from originalCanvas', () => {
        const spy = spyOn(service.originalImageCanvas, 'strokeText');
        service.giveHint3({ x: 1, y: 1 } as Vec2);
        expect(spy).toHaveBeenCalled();
    });
    it('sendHintMessage should call send  from socketService', () => {
        service.sendHintMessage('test');
        expect(socketServiceSpy.send).toHaveBeenCalledWith('systemMessageSolo', 'test');
    });
    it('changeGame should get a new random game, initilaize it and put the new images on the canvas', () => {
        const spyGetRandom = spyOn(service, 'getRandomGame').and.returnValue({} as GameData);
        const spyInitilaize = spyOn(service, 'initializeGame');
        const spyPut = spyOn(service, 'putImages');
        service.changeGame();
        expect(spyGetRandom).toHaveBeenCalled();
        expect(spyInitilaize).toHaveBeenCalled();
        expect(spyPut).toHaveBeenCalled();
    });
    it('getRandomGame should return one of the games from limitedGameData', () => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        spyOn(Math, 'random').and.returnValue(0.99);
        service.limitedGameData = [{ name: '1' } as GameData, { name: '1' } as GameData];
        service.getRandomGame();
        expect(service.getRandomGame()).toEqual({ name: '1' } as GameData);
    });
    it('initializeLimitedGame should set limitedGameData and gameNumberMax attributes', () => {
        const data = [{ name: '1' } as GameData, { name: '12' } as GameData];
        spyOn(service, 'getRandomGame').and.returnValue({} as GameData);
        service.initializeLimitedGame(data);
        spyOn(service, 'initializeGame');
        expect(service.limitedGameData).toEqual(data);
    });
});
