import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { LobbyService } from '@app/services/lobby.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Socket } from 'socket.io-client';

import { SalleAttenteComponent } from './salle-attente.component';

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('SalleAttenteComponent', () => {
    let component: SalleAttenteComponent;
    let fixture: ComponentFixture<SalleAttenteComponent>;
    let mockRouter: Router;
    // let mockSocketService: SocketClientService;
    let mockLobbyService: LobbyService;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientService();
        socketServiceMock.socket = socketHelper as unknown as Socket;

        await TestBed.configureTestingModule({
            declarations: [SalleAttenteComponent],
            providers: [
                { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
                { provide: SocketClientService, useValue: socketServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SalleAttenteComponent);
        component = fixture.componentInstance;
        mockRouter = TestBed.inject(Router);
        mockLobbyService = TestBed.inject(LobbyService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('goToGameSelection should navigate to gameSelection', () => {
        component.goToGameSelection();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/gameSelection']);
    });

    it('goToGameSelection should send remove from queue', () => {
        const spy = spyOn(socketServiceMock, 'send');
        component.goToGameSelection();
        expect(spy).toHaveBeenCalledWith('removeFromQueue', {
            socketId: socketServiceMock.socket.id,
            gameId: mockLobbyService.roomId,
        });
    });

    it('goToGameSelection should disconnect', () => {
        const spy = spyOn(socketServiceMock, 'disconnect');
        component.goToGameSelection();
        expect(spy).toHaveBeenCalled();
    });

    it('if user is host, send from socketClientService should be called', () => {
        mockLobbyService.host = true;
        component.host = true;
        const spy = spyOn(socketServiceMock, 'send');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('if user isnt host, receiving "goToGame" from socket navigate to 1v1 view', () => {
        mockLobbyService.host = false;
        mockLobbyService.roomId = '1';
        component.acceptListen();
        socketHelper.peerSideEmit('goToGame', { roomId: '0' });
        expect(mockRouter.navigate).toHaveBeenCalled();
        expect(mockLobbyService.roomId).toEqual('0');
    });

    it('receiving "refused" from socket navigate to gameSelection view', () => {
        component.refuseListen();
        socketHelper.peerSideEmit('refused', { roomId: 0 });
        expect(mockRouter.navigate).toHaveBeenCalled();
    });
});
