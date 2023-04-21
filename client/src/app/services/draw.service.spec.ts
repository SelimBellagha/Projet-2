import { TestBed } from '@angular/core/testing';
import { DrawService } from '@app/services/draw.service';

describe('DrawService', () => {
    let service: DrawService;
    let ctxStub: OffscreenCanvasRenderingContext2D;

    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawService);
        ctxStub = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as OffscreenCanvasRenderingContext2D;
        service.drawingContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' drawline should call lineTo on the canvas', () => {
        const lineToSpy = spyOn(service.drawingContext, 'lineTo').and.callThrough();
        const startPositionMock = { x: 2, y: 4 };
        const endPositionMock = { x: 4, y: 4 };
        service.drawLine(startPositionMock, endPositionMock);
        expect(lineToSpy).toHaveBeenCalled();
    });

    it(' drawLine should color pixels on the canvas', () => {
        let imageData = service.drawingContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        const startPositionMock = { x: 2, y: 4 };
        const endPositionMock = { x: 4, y: 4 };
        service.drawLine(startPositionMock, endPositionMock);
        imageData = service.drawingContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });
    it(' erase should call clearRect on the canvas', () => {
        const clearRectSpy = spyOn(service.drawingContext, 'clearRect').and.callThrough();
        const startPositionMock = { x: 2, y: 4 };
        service.erase(startPositionMock);
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it(' drawRectangle should fillRect on the canvas', () => {
        const fillRectSpy = spyOn(service.drawingContext, 'fillRect').and.callThrough();
        const startPositionMock = { x: 2, y: 4 };
        const endPositionMock = { x: 8, y: 6 };
        service.drawRectangle(startPositionMock, endPositionMock);
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it(' drawRectangle should color pixels on the canvas', () => {
        let imageData = service.drawingContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        const startPositionMock = { x: 2, y: 4 };
        const endPositionMock = { x: 8, y: 6 };
        service.drawRectangle(startPositionMock, endPositionMock);
        imageData = service.drawingContext.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawRectangle should adjust rectangle x dimension if isSquareEnabled is true and y difference is smaller', () => {
        service.isSquareEnabled = true;
        const fillRectSpy = spyOn(service.drawingContext, 'fillRect').and.callThrough();
        const startPositionMock = { x: 2, y: 4 };
        const endPositionMock = { x: 8, y: 6 };
        service.drawRectangle(startPositionMock, endPositionMock);
        expect(fillRectSpy).toHaveBeenCalledOnceWith(startPositionMock.x, startPositionMock.y, 2, 2);
    });
    it(' drawRectangle should adjust rectangle x dimension if isSquareEnabled is true and y difference is smaller', () => {
        service.isSquareEnabled = true;
        const fillRectSpy = spyOn(service.drawingContext, 'fillRect').and.callThrough();
        const startPositionMock = { x: 10, y: 10 };
        const endPositionMock = { x: 4, y: 6 };
        service.drawRectangle(startPositionMock, endPositionMock);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(fillRectSpy).toHaveBeenCalledOnceWith(startPositionMock.x, startPositionMock.y, -4, -4);
    });

    it(' drawRectangle should adjust rectangle y dimension if isSquareEnabled is true and x difference is smaller', () => {
        service.isSquareEnabled = true;
        const fillRectSpy = spyOn(service.drawingContext, 'fillRect').and.callThrough();
        const startPositionMock = { x: 2, y: 4 };
        const endPositionMock = { x: 3, y: 10 };
        service.drawRectangle(startPositionMock, endPositionMock);
        expect(fillRectSpy).toHaveBeenCalledOnceWith(startPositionMock.x, startPositionMock.y, 1, 1);
    });
    it(' drawRectangle should adjust rectangle y dimension if isSquareEnabled is true and x difference is smaller', () => {
        service.isSquareEnabled = true;
        const fillRectSpy = spyOn(service.drawingContext, 'fillRect').and.callThrough();
        const startPositionMock = { x: 2, y: 4 };
        const endPositionMock = { x: 3, y: 0 };
        service.drawRectangle(startPositionMock, endPositionMock);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(fillRectSpy).toHaveBeenCalledOnceWith(startPositionMock.x, startPositionMock.y, 1, -1);
    });
    it('setColor should change color attribute', () => {
        service.setColor('blue');
        expect(service.color).toEqual('blue');
    });
    it('setWidth should change width attribute', () => {
        service.setWidth(2);
        expect(service.width).toEqual(2);
    });
    it('enableSquare should change isSquareEnabled attribute', () => {
        service.enableSquare(true);
        expect(service.isSquareEnabled).toBeTrue();
    });
});
