import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LobbyService } from '@app/services/lobby.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { JoinBarComponent } from './join-bar.component';
import SpyObj = jasmine.SpyObj;

describe('JoinBarComponent', () => {
    let component: JoinBarComponent;
    let fixture: ComponentFixture<JoinBarComponent>;
    let lobbyServiceSpy: SpyObj<LobbyService>;
    let socketServiceSpy: SpyObj<SocketClientService>;

    beforeEach(async () => {
        lobbyServiceSpy = jasmine.createSpyObj('LobbyService', ['roomId', 'addOpponent']);
        socketServiceSpy = jasmine.createSpyObj('SocketClientService', ['send']);
        await TestBed.configureTestingModule({
            declarations: [JoinBarComponent],
            providers: [
                { provide: SocketClientService, useValue: socketServiceSpy },
                { provide: LobbyService, useValue: lobbyServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(JoinBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('refusePlayer should send a refuse event', () => {
        component.socketId = 'socketId';
        lobbyServiceSpy.roomId = 'roomId';
        component.refusePlayer();
        expect(socketServiceSpy.send).toHaveBeenCalledWith('removeFromQueue', { socketId: component.socketId, gameId: lobbyServiceSpy.roomId });
    });

    it('acceptPlayer should send a addToRoom event', () => {
        component.socketId = 'socketId';
        component.nomJoueur = 'playerName';
        lobbyServiceSpy.roomId = 'roomId';
        component.acceptPlayer();
        expect(socketServiceSpy.send).toHaveBeenCalledWith('addToRoom', { opponentId: component.socketId, roomId: lobbyServiceSpy.roomId });
        expect(lobbyServiceSpy.addOpponent).toHaveBeenCalledWith(component.nomJoueur, component.socketId);
    });
});
