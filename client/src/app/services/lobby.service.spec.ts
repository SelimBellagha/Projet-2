import { TestBed } from '@angular/core/testing';
import { LobbyService } from './lobby.service';
import { SocketClientService } from './socket-client-service.service';

describe('LobbyService', () => {
    let service: LobbyService;
    let socketServiceSpy: jasmine.SpyObj<SocketClientService>;

    beforeEach(() => {
        socketServiceSpy = jasmine.createSpyObj('SocketClientService', ['send']);
        TestBed.configureTestingModule({
            providers: [LobbyService, { provide: SocketClientService, useValue: socketServiceSpy }],
        });
        service = TestBed.inject(LobbyService);
        socketServiceSpy = TestBed.inject(SocketClientService) as jasmine.SpyObj<SocketClientService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('deleteLobby should send deleteLobby event with roomId', () => {
        service.roomId = 'testRoomId';
        service.deleteLobby();
        expect(socketServiceSpy.send).toHaveBeenCalledWith('deleteLobby', { roomId: 'testRoomId' });
    });

    it('addOpponent should set opponent with the opponentName and opponentId', () => {
        service.addOpponent('OpponentName', 'OpponentId');
        expect(service.opponent).toEqual({
            playerName: 'OpponentName',
            socketId: 'OpponentId',
        });
    });
});
