import { TestBed } from '@angular/core/testing';

import { LoginFormService } from './login-form.service';

describe('LoginFormService', () => {
    let service: LoginFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoginFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the form data', () => {
        const name = 'TestName';
        service.setFormData(name);
        expect(service.getFormData()).toEqual(name);
    });

    it('should set game type', () => {
        const gameType = true;
        service.setGameType(gameType);
        expect(service.getGameType()).toEqual(gameType);
    });

    it('should set player type', () => {
        const playerType = true;
        service.setPlayerType(playerType);
        expect(service.getPlayerType()).toEqual(playerType);
    });

    it('should set game id', () => {
        const gameId = '12345';
        service.setGameId(gameId);
        expect(service.getGameId()).toEqual(gameId);
    });

    it('should set room id', () => {
        const roomId = '12345';
        service.setRoomId(roomId);
        expect(service.getRoomId()).toEqual(roomId);
    });
});
