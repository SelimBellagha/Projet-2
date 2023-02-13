import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GameData } from '@app/interfaces/game-data';
import { BMP_24BIT_FILE_SIZE, CanvasManagerService } from './canvas-manager.service';
import { DifferenceDetectionService } from './difference-detection.service';
import SpyObj = jasmine.SpyObj;

describe('CanvasManagerService', () => {
    let service: CanvasManagerService;
    let differenceDetectionServiceSpy: SpyObj<DifferenceDetectionService>;
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const imageValid: HTMLImageElement = new Image();
    const imageWrongSize: HTMLImageElement = new Image();
    // White RGBO value is 255, 255, 255, 255
    const whiteValue = 255;

    beforeEach(() => {
        imageValid.src = '../assets/tests/image_2_diff.bmp';
        imageWrongSize.src = '../assets/tests/image_wrong_res.bmp';

        differenceDetectionServiceSpy = jasmine.createSpyObj('DifferenceDetectionService', ['launchDifferenceDetection']);
        TestBed.configureTestingModule({
            providers: [{ provide: DifferenceDetectionService, useValue: differenceDetectionServiceSpy }],
        });
        service = TestBed.inject(CanvasManagerService);
        service.leftCanvasContext = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.rightCanvasContext = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.modalCanvasContext = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('launchVerification should call launchDifferenceDetection from the service', async () => {
        const imageDataStub = new ImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
        const imageBitmabStub = await createImageBitmap(imageDataStub);
        const gameDataStub: GameData = {
            id: 'temp',
            name: 'temp',
            originalImage: imageBitmabStub,
            modifiedImage: imageBitmabStub,
            differenceImage: new ImageData(CANVAS_WIDTH, CANVAS_HEIGHT),
            nbDifferences: 0,
            differences: [],
            isDifficult: true,
        };
        const fakeDetection = async () => {
            return gameDataStub;
        };
        differenceDetectionServiceSpy.launchDifferenceDetection.and.callFake(fakeDetection);
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
    it('isFileValid shoul return false if file is null or undefined', () => {
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

    it('resetLeftBackground should put all the canvas pixels to white', () => {
        service.resetLeftBackground();
        const differences = service.leftCanvasContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data.filter((x) => {
            return x !== whiteValue;
        });
        expect(differences.length).toEqual(0);
    });
    it('resetRightBackground should put all the canvas pixels to white', () => {
        service.resetRightBackground();
        const differences = service.rightCanvasContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data.filter((x) => {
            return x !== whiteValue;
        });
        expect(differences.length).toEqual(0);
    });

    it('changeRightBackground should not change canvas if file is in invalid format', () => {
        let imageData = service.rightCanvasContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSize = imageData.filter((x) => x !== whiteValue).length;
        service.changeRightBackground(null as unknown as File);
        imageData = service.rightCanvasContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSize = imageData.filter((x) => x !== whiteValue).length;
        expect(afterSize).toEqual(beforeSize);
    });
    it('changeRightBackground should call notifyFileError if file is in invalid format', () => {
        const spy = spyOn(service, 'notifyFileError');
        service.changeRightBackground(null as unknown as File);
        expect(spy).toHaveBeenCalled();
    });

    it('changeLeftBackground should not change canvas if file is in invalid format', () => {
        let imageData = service.leftCanvasContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSize = imageData.filter((x) => x !== whiteValue).length;
        service.changeLeftBackground(null as unknown as File);
        imageData = service.leftCanvasContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSize = imageData.filter((x) => x !== whiteValue).length;
        expect(afterSize).toEqual(beforeSize);
    });
    it('changeLeftBackground should call notifyFileError if file is in invalid format', () => {
        const spy = spyOn(service, 'notifyFileError');
        service.changeLeftBackground(null as unknown as File);
        expect(spy).toHaveBeenCalled();
    });

    it('changeBothBackground should not change any of the canvas if file is in invalid format', () => {
        let imageData = service.leftCanvasContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSizeLeft = imageData.filter((x) => x !== whiteValue).length;
        imageData = service.rightCanvasContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSizeRight = imageData.filter((x) => x !== whiteValue).length;

        service.changeBothBackgrounds(null as unknown as File);

        imageData = service.leftCanvasContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSizeLeft = imageData.filter((x) => x !== whiteValue).length;
        imageData = service.rightCanvasContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
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

    it('changeBothBackground should call drawImage on both canvas if file is valid', async () => {
        const spyRight = spyOn(service.rightCanvasContext, 'drawImage');
        const spyLeft = spyOn(service.leftCanvasContext, 'drawImage');
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
        const spyLeft = spyOn(service.leftCanvasContext, 'drawImage');
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
        const spyRight = spyOn(service.rightCanvasContext, 'drawImage');
        spyOn(service, 'validateImageSize').and.returnValue(true);
        spyOn(service, 'isFileValid').and.returnValue(true);
        await imageValid.decode();
        await service.changeRightBackground(imageValid as unknown as File);
        expect(spyRight).toHaveBeenCalled();
    });
});
