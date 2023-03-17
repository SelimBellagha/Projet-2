/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GameData } from '@app/interfaces/game-data';
import { Tool } from '@app/pages/game-creation-page/game-creation-page.component';
import { BMP_24BIT_FILE_SIZE, CanvasManagerService } from './canvas-manager.service';
import { DifferenceDetectionService } from './difference-detection.service';
import { DrawService } from './draw.service';
import { MouseHandlerService } from './mouse-handler.service';
import SpyObj = jasmine.SpyObj;

describe('CanvasManagerService', () => {
    let service: CanvasManagerService;
    let differenceDetectionServiceSpy: SpyObj<DifferenceDetectionService>;
    let drawServiceSpy: SpyObj<DrawService>;
    let mouseHandlerSpy: SpyObj<MouseHandlerService>;
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const imageValid: HTMLImageElement = new Image();
    const imageWrongSize: HTMLImageElement = new Image();
    // White RGBO value is 255, 255, 255, 255
    const whiteValue = 255;

    beforeEach(() => {
        imageValid.src = '../assets/tests/image_2_diff.bmp';
        imageWrongSize.src = '../assets/tests/image_wrong_res.bmp';

        differenceDetectionServiceSpy = jasmine.createSpyObj('DifferenceDetectionService', [
            'launchDifferenceDetection',
            'findDifferences',
            'createDifferenceImage',
        ]);

        drawServiceSpy = jasmine.createSpyObj('DrawService', ['erase', 'drawLine', 'drawRectangle', 'setColor', 'setWidth', 'enableSquare']);
        mouseHandlerSpy = jasmine.createSpyObj('MouseHandlerService', [
            'setFirstClick',
            'updatePosition',
            'endClick',
            'getCurrentPosition',
            'getFirstPosition',
            'isLeftCanvasSelected',
            'isButtonDown',
        ]);
        TestBed.configureTestingModule({
            providers: [
                { provide: DifferenceDetectionService, useValue: differenceDetectionServiceSpy },
                { provide: DrawService, useValue: drawServiceSpy },
                { provide: MouseHandlerService, useValue: mouseHandlerSpy },
            ],
        });
        service = TestBed.inject(CanvasManagerService);
        service.leftCanvasContext = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.rightCanvasContext = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.modalCanvasContext = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.leftBackground = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        service.rightBackground = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        service.leftForeground = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        service.rightForeground = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        service.tempRectangleCanvas = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('launchVerification should call launchDifferenceDetection from the service', async () => {
        // const imageDataStub = new ImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
        // const imageBitmabStub = await createImageBitmap(imageDataStub);
        const gameDataStub: GameData = {
            id: 'temp',
            name: 'temp',
            originalImage: 'test',
            modifiedImage: 'test',
            // differenceImage: new ImageData(CANVAS_WIDTH, CANVAS_HEIGHT),
            nbDifferences: 0,
            differences: [],
            isDifficult: true,
        };
        const fakeDetection = async () => {
            return gameDataStub;
        };
        differenceDetectionServiceSpy.launchDifferenceDetection.and.callFake(fakeDetection);
        spyOn(service.modalCanvasContext, 'putImageData');
        service.launchVerification(0);
        expect(differenceDetectionServiceSpy.launchDifferenceDetection).toHaveBeenCalled();
    });
    it('validateImageSize should return false if image is not 640x480 ', async () => {
        await imageWrongSize.decode();
        const bitmap = await createImageBitmap(imageWrongSize);
        expect(service.validateImageSize(bitmap)).toBeFalse();
    });
    it('validateImageSize should return true if image is 640x480 ', async () => {
        await imageValid.decode();
        const bitmap = await createImageBitmap(imageValid);
        expect(service.validateImageSize(bitmap)).toBeTrue();
    });
    it('isFileValid should return false if file is null or undefined', () => {
        const file: File = null as unknown as File;
        const file2: File = undefined as unknown as File;
        expect(service.isFileValid(file)).toBeFalse();
        expect(service.isFileValid(file2)).toBeFalse();
    });
    it('isFileValid should return false if file not in bmp format', () => {
        const fileMock = { type: 'image/png', size: BMP_24BIT_FILE_SIZE };
        expect(service.isFileValid(fileMock as File)).toBeFalse();
    });

    it('isFileValid should return true if file  in bmp 24-bit format', async () => {
        const fileMock = { type: 'image/bmp', size: BMP_24BIT_FILE_SIZE };
        expect(service.isFileValid(fileMock as File)).toBeTrue();
    });

    it('resetLeftBackground should put all the backgroundcanvas pixels to white', () => {
        service.resetLeftBackground();
        const differences = (service.leftBackground.getContext('2d') as OffscreenCanvasRenderingContext2D)
            .getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            .data.filter((x) => {
                return x !== whiteValue;
            });
        expect(differences.length).toEqual(0);
    });
    it('resetRightBackground should put all the background canvas pixels to white', () => {
        service.resetRightBackground();
        const differences = (service.rightBackground.getContext('2d') as OffscreenCanvasRenderingContext2D)
            .getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            .data.filter((x) => {
                return x !== whiteValue;
            });
        expect(differences.length).toEqual(0);
    });

    it('changeRightBackground should not change  background canvas if file is in invalid format', () => {
        const context = service.rightBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        let imageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSize = imageData.filter((x) => x !== whiteValue).length;
        service.changeRightBackground(null as unknown as File);
        imageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSize = imageData.filter((x) => x !== whiteValue).length;
        expect(afterSize).toEqual(beforeSize);
    });
    it('changeRightBackground should call notifyFileError if file is in invalid format', () => {
        const spy = spyOn(service, 'notifyFileError');
        service.changeRightBackground(null as unknown as File);
        expect(spy).toHaveBeenCalled();
    });

    it('changeLeftBackground should not change canvas if file is in invalid format', () => {
        const context = service.leftBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        let imageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSize = imageData.filter((x) => x !== whiteValue).length;
        service.changeLeftBackground(null as unknown as File);
        imageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSize = imageData.filter((x) => x !== whiteValue).length;
        expect(afterSize).toEqual(beforeSize);
    });
    it('changeLeftBackground should call notifyFileError if file is in invalid format', () => {
        const spy = spyOn(service, 'notifyFileError');
        service.changeLeftBackground(null as unknown as File);
        expect(spy).toHaveBeenCalled();
    });

    it('changeBothBackground should not change any of the canvas if file is in invalid format', () => {
        const leftContext = service.leftBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        const rightContext = service.rightBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;

        let imageData = leftContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSizeLeft = imageData.filter((x) => x !== whiteValue).length;
        imageData = rightContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSizeRight = imageData.filter((x) => x !== whiteValue).length;

        service.changeBothBackgrounds(null as unknown as File);

        imageData = leftContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSizeLeft = imageData.filter((x) => x !== whiteValue).length;
        imageData = rightContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSizeRight = imageData.filter((x) => x !== whiteValue).length;

        expect(afterSizeLeft).toEqual(beforeSizeLeft);
        expect(afterSizeRight).toEqual(beforeSizeRight);
    });
    it('changeBothBackground should call notifyFileError if file is in invalid format', () => {
        const spy = spyOn(service, 'notifyFileError');
        service.changeBothBackgrounds(null as unknown as File);
        expect(spy).toHaveBeenCalled();
    });

    it('changeBothBackground should call notifyFileError if file is in wrong size', async () => {
        const spy = spyOn(service, 'notifyFileError');
        spyOn(service, 'validateImageSize').and.returnValue(false);
        spyOn(service, 'isFileValid').and.returnValue(true);
        await imageValid.decode();
        await service.changeBothBackgrounds(imageValid as unknown as File);
        expect(spy).toHaveBeenCalled();
    });

    it('changeBothBackground should call drawImage on both background canvases if file is valid', async () => {
        const leftContext = service.leftBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        const rightContext = service.rightBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;

        const spyRight = spyOn(leftContext, 'drawImage');
        const spyLeft = spyOn(rightContext, 'drawImage');
        spyOn(service, 'validateImageSize').and.returnValue(true);
        spyOn(service, 'isFileValid').and.returnValue(true);
        await imageValid.decode();
        await service.changeBothBackgrounds(imageValid as unknown as File);
        expect(spyLeft).toHaveBeenCalled();
        expect(spyRight).toHaveBeenCalled();
    });

    it('changeLeftBackground should call notifyFileError if file is in wrong size', async () => {
        const spy = spyOn(service, 'notifyFileError');
        spyOn(service, 'validateImageSize').and.returnValue(false);
        spyOn(service, 'isFileValid').and.returnValue(true);
        await imageValid.decode();
        await service.changeLeftBackground(imageValid as unknown as File);
        expect(spy).toHaveBeenCalled();
    });

    it('changeLeftBackground should call drawImage on left canvas if file is valid', async () => {
        const leftContext = service.leftBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        const spyLeft = spyOn(leftContext, 'drawImage');
        spyOn(service, 'validateImageSize').and.returnValue(true);
        spyOn(service, 'isFileValid').and.returnValue(true);
        await imageValid.decode();
        await service.changeLeftBackground(imageValid as unknown as File);
        expect(spyLeft).toHaveBeenCalled();
    });

    it('changeRightBackground should call notifyFileError if file is in wrong size', async () => {
        const spy = spyOn(service, 'notifyFileError');
        spyOn(service, 'validateImageSize').and.returnValue(false);
        spyOn(service, 'isFileValid').and.returnValue(true);
        await imageValid.decode();
        await service.changeRightBackground(imageValid as unknown as File);
        expect(spy).toHaveBeenCalled();
    });

    it('changeRightBackground should call drawImage on right canvas if file is valid', async () => {
        const context = service.rightBackground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        const spyRight = spyOn(context, 'drawImage');
        spyOn(service, 'validateImageSize').and.returnValue(true);
        spyOn(service, 'isFileValid').and.returnValue(true);
        await imageValid.decode();
        await service.changeRightBackground(imageValid as unknown as File);
        expect(spyRight).toHaveBeenCalled();
    });

    it('setTool should correctly change activeTool attribute ', () => {
        service.setTool(Tool.Eraser);
        expect(service.activeTool).toEqual(Tool.Eraser);
    });
    it('setColor should call setColor from drawService', () => {
        const color = 'green';
        service.setColor(color);
        expect(drawServiceSpy.setColor).toHaveBeenCalled();
    });
    it('setWidth should call setWidth from drawService', () => {
        const width = 1;
        service.setWidth(width);
        expect(drawServiceSpy.setWidth).toHaveBeenCalled();
    });
    it('enableSquare should call enableSquare from drawService', () => {
        service.enableSquare(true);
        expect(drawServiceSpy.enableSquare).toHaveBeenCalled();
    });
    it('enableSquare should updateDisplay if rectange tool is currently being used', () => {
        drawServiceSpy.drawingContext = service.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        service.activeTool = Tool.Rectangle;
        mouseHandlerSpy.isButtonDown.and.returnValue(true);
        mouseHandlerSpy.isLeftCanvasSelected.and.returnValue(true);
        const spy = spyOn(service, 'updateDisplay');
        service.enableSquare(true);
        expect(spy).toHaveBeenCalled();
    });
    it('saveAction should add an item to the actionsDone list', () => {
        const length = service.actionsDone.length;
        service.saveAction();
        expect(service.actionsDone.length).toBeGreaterThan(length);
    });

    it('undoAction should add an item to the actionsUndone list', () => {
        service.saveAction();
        service.saveAction();
        const length = service.actionsUnDone.length;
        service.undoAction();
        expect(service.actionsUnDone.length).toBeGreaterThan(length);
    });

    it('undoAction should remove an item from the actionsDone list and update the displays', () => {
        service.saveAction();
        service.saveAction();
        const length = service.actionsDone.length;
        const spy = spyOn(service, 'updateDisplay');
        service.undoAction();
        expect(service.actionsDone.length).toBeLessThan(length);
        expect(spy).toHaveBeenCalled();
    });
    it('redoAction should add an item to the actionsDone list', () => {
        service.saveAction();
        service.saveAction();
        service.undoAction();
        const length = service.actionsDone.length;
        service.redoAction();
        expect(service.actionsDone.length).toBeGreaterThan(length);
    });

    it('redoAction should remove an item from the actionsUnDone list', () => {
        service.saveAction();
        service.saveAction();
        service.undoAction();
        const length = service.actionsUnDone.length;
        service.redoAction();
        expect(service.actionsUnDone.length).toBeLessThan(length);
    });
    it('redoAction should not updateDisplay if  actionsUndone is empty', () => {
        service.saveAction();
        service.saveAction();
        const spy = spyOn(service, 'updateDisplay');
        service.redoAction();
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('updateDisplay should call drawImage 2 times on both canvases', () => {
        const leftSpy = spyOn(service.leftCanvasContext, 'drawImage');
        const rightSpy = spyOn(service.rightCanvasContext, 'drawImage');
        service.updateDisplay();
        expect(leftSpy).toHaveBeenCalledTimes(2);
        expect(rightSpy).toHaveBeenCalledTimes(2);
    });
    it('duplicateLeft should call drawImage on the right foreground', () => {
        const spy = spyOn(service.rightForeground.getContext('2d') as OffscreenCanvasRenderingContext2D, 'drawImage');
        service.duplicateLeft();
        expect(spy).toHaveBeenCalled();
    });

    it('duplicateRight should call drawImage on the left foreground', () => {
        const spy = spyOn(service.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D, 'drawImage');
        service.duplicateRight();
        expect(spy).toHaveBeenCalled();
    });

    it('SwapForegrounds', () => {
        const leftContext = service.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        const rightContext = service.rightForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        leftContext.fillRect(1, 1, 1, 1);
        const originalLeft = leftContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const originalRight = rightContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        service.swapForegrounds();
        expect(leftContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data).toEqual(originalRight);
        expect(rightContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data).toEqual(originalLeft);
    });
    it('resetCanvases should call reset on both foregrounds and backgrounds', () => {
        const spyBackLeft = spyOn(service, 'resetLeftBackground');
        const spyBackRight = spyOn(service, 'resetRightBackground');
        const spyFrontLeft = spyOn(service, 'resetLeftForeground');
        const spyFrontRight = spyOn(service, 'resetRightForeground');
        service.resetCanvases();
        expect(spyBackLeft).toHaveBeenCalled();
        expect(spyBackRight).toHaveBeenCalled();
        expect(spyFrontLeft).toHaveBeenCalled();
        expect(spyFrontRight).toHaveBeenCalled();
    });
    it('resetRightForeground should clear right foreground', () => {
        const rightContext = service.rightForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        rightContext.fillRect(1, 1, 1, 1);
        service.resetRightForeground();
        const length = rightContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data.filter((x) => {
            return x !== 0;
        }).length;
        expect(length).toEqual(0);
    });

    it('resetLeftForeground should clear left foreground', () => {
        const leftContext = service.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        leftContext.fillRect(1, 1, 1, 1);
        service.resetLeftForeground();
        const length = leftContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data.filter((x) => {
            return x !== 0;
        }).length;
        expect(length).toEqual(0);
    });

    it('onMouseUp should call endClick from mouseHandler and save an action', () => {
        mouseHandlerSpy.isLeftCanvasSelected.and.returnValue(true);
        const length = service.actionsDone.length;
        service.onMouseUp(true);
        expect(service.actionsDone.length).toBeGreaterThan(length);
    });

    it('onMouseDown should call setFirstClick', () => {
        service.onMouseDown({ x: 1, y: 1 }, true);
        expect(mouseHandlerSpy.setFirstClick).toHaveBeenCalled();
    });
    it('onMouseDown should call erase from drawService if active tool is eraser', () => {
        service.activeTool = Tool.Eraser;
        service.onMouseDown({ x: 1, y: 1 }, true);
        expect(drawServiceSpy.erase).toHaveBeenCalled();
    });
    it('onMouseDown should call drawImage  on tempRectangle canvas if active tool is rectangle', () => {
        service.activeTool = Tool.Rectangle;
        const spy = spyOn(service.tempRectangleCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D, 'drawImage');
        service.onMouseDown({ x: 1, y: 1 }, true);
        expect(spy).toHaveBeenCalled();
    });
    it('onMouseMouve should call drawline from drawService if active tool is pencil', () => {
        service.activeTool = Tool.Pencil;
        mouseHandlerSpy.isButtonDown.and.returnValue(true);
        mouseHandlerSpy.isLeftCanvasSelected.and.returnValue(true);
        service.onMouseMove({ x: 1, y: 1 }, true);
        expect(drawServiceSpy.drawLine).toHaveBeenCalled();
    });

    it('onMouseMouve should call drawRectangle from drawService if active tool is rectangle', () => {
        drawServiceSpy.drawingContext = service.leftForeground.getContext('2d') as OffscreenCanvasRenderingContext2D;
        service.activeTool = Tool.Rectangle;
        mouseHandlerSpy.isButtonDown.and.returnValue(true);
        mouseHandlerSpy.isLeftCanvasSelected.and.returnValue(true);
        service.onMouseMove({ x: 1, y: 1 }, true);
        expect(drawServiceSpy.drawRectangle).toHaveBeenCalled();
    });
    it('onMouseMouve should call erase from drawService if active tool is eraser', () => {
        service.activeTool = Tool.Eraser;
        mouseHandlerSpy.isButtonDown.and.returnValue(true);
        mouseHandlerSpy.isLeftCanvasSelected.and.returnValue(true);
        service.onMouseMove({ x: 1, y: 1 }, true);
        expect(drawServiceSpy.erase).toHaveBeenCalled();
    });
    it('init should call resetCanvases', () => {
        const spy = spyOn(service, 'resetCanvases');
        service.init();
        expect(spy).toHaveBeenCalled();
    });
});
