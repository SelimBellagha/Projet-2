import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LobbyService } from '@app/services/lobby.service';
import { SocketClientService } from '@app/services/socket-client-service.service';

import { SalleAttenteComponent } from './salle-attente.component';

describe('SalleAttenteComponent', () => {
    let component: SalleAttenteComponent;
    let fixture: ComponentFixture<SalleAttenteComponent>;
    let mockRouter: Router;
    let mockSocketService: SocketClientService;
    let mockLobbyService: LobbyService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SalleAttenteComponent],
            providers: [
                { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
                {
                    provide: SocketClientService,
                    useValue: {
                        send: jasmine.createSpy('send'),
                        disconnect: jasmine.createSpy('disconnect'),
                        on: jasmine.createSpy('on'),
                        connect: jasmine.createSpy('connect'),
                        socket: { id: 'testSocketId' },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SalleAttenteComponent);
        component = fixture.componentInstance;
        mockRouter = TestBed.inject(Router);
        mockSocketService = TestBed.inject(SocketClientService) as jasmine.SpyObj<SocketClientService>;
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
        component.goToGameSelection();
        expect(mockSocketService.send).toHaveBeenCalledWith('removeFromQueue', {
            socketId: mockSocketService.socket.id,
            gameId: mockLobbyService.roomId,
        });
    });

    it('goToGameSelection should disconnect', () => {
        component.goToGameSelection();
        expect(mockSocketService.disconnect).toHaveBeenCalled();
    });

    it('refuseListen should disconnect', () => {
        component.goToGameSelection();
        expect(mockSocketService.disconnect).toHaveBeenCalled();
    });
});
