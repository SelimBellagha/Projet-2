import { TestBed } from '@angular/core/testing';

import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
    let service: MouseHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MouseHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setFirstClick should correctly modify mouseHandler attributes', () => {
        const positionMock = { x: 1, y: 1 };
        service.setFirstClick(positionMock, true);
        expect(service.firstPosition).toEqual(positionMock);
        expect(service.currentPosition).toEqual(positionMock);
        expect(service.isLeftSelected).toBe(true);
        expect(service.isLeftButtonDown).toBeTrue();
    });
    it('updatePosition should change current position', () => {
        const positionMock = { x: 4, y: 6 };
        service.updatePosition(positionMock);
        expect(service.currentPosition).toBe(positionMock);
    });
    it('endClick should set isLeftButtonDOwnToFalse ', () => {
        service.endClick();
        expect(service.isLeftButtonDown).toBeFalse();
    });
    it('getCurrentPosition shoul return current position ', () => {
        service.currentPosition = { x: 1, y: 2 };
        expect(service.getCurrentPosition()).toEqual({ x: 1, y: 2 });
    });
    it('getFirstPosition shoul return first position ', () => {
        service.firstPosition = { x: 1, y: 2 };
        expect(service.getFirstPosition()).toEqual({ x: 1, y: 2 });
    });
    it('isLeftCanvasSelected should return isLeftSelected', () => {
        service.isLeftSelected = false;
        expect(service.isLeftCanvasSelected()).toBeFalse();
    });
    it('endClick should set isLeftButtonDOwnToFalse ', () => {
        service.isLeftButtonDown = false;
        expect(service.isButtonDown()).toBeFalse();
    });
});
