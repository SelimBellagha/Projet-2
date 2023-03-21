import { TestBed } from '@angular/core/testing';

import { LoginFormService } from './login-form.service';

describe('LoginFormService', () => {
    let service: LoginFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoginFormService);
        service = new LoginFormService();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the form data', () => {
        const name = 'TestName';
        service.setFormData(name);
        expect(service.getFormData()).toEqual(name);
    });

    describe('getFormData', () => {
        it('should return the username', () => {
            const name = 'John';
            service.setFormData(name);
            expect(service.getFormData()).toEqual(name);
        });
    });
    it('should set and get game type', () => {
        const isMultiplayer = true;
        service.setGameType(isMultiplayer);
        expect(service.getGameType()).toEqual(isMultiplayer);
    });

    it('should set and get player type', () => {
        const isHost = true;
        service.setPlayerType(isHost);
        expect(service.getPlayerType()).toEqual(isHost);
    });

    it('should set and get game ID', () => {
        const id = '1234';
        service.setGameId(id);
        expect(service.getGameId()).toEqual(id);
    });

    it('should set and get room ID', () => {
        const id = '5678';
        service.setRoomId(id);
        expect(service.getRoomId()).toEqual(id);
    });
});
