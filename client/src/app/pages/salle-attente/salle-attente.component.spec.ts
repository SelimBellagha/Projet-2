import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { LobbyService } from '@app/services/lobby.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Socket } from 'socket.io-client';
import { SalleAttenteComponent } from './salle-attente.component';
import SpyObj = jasmine.SpyObj;

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('SalleAttenteComponent', () => {
    let component: SalleAttenteComponent;
    let fixture: ComponentFixture<SalleAttenteComponent>;
    let mockRouter: Router;
    let mockLobbyService: LobbyService;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;
    let loginSpy: SpyObj<LoginFormService>;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientService();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        loginSpy = jasmine.createSpyObj('LoginFormService', ['getLimitedTimeGame', 'getFormData', 'getGameId']);

        await TestBed.configureTestingModule({
            declarations: [SalleAttenteComponent],
            providers: [
                { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
                { provide: SocketClientService, useValue: socketServiceMock },
                { provide: LoginFormService, useValue: loginSpy },
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

    it('goToHome should send remove from queue', () => {
        const spy = spyOn(socketServiceMock, 'send');
        component.goToHome();
        expect(spy).toHaveBeenCalledWith('removeFromQueue', {
            socketId: socketServiceMock.socket.id,
            gameId: mockLobbyService.roomId,
        });
    });

    it('goToHome should navigate to home', () => {
        component.goToHome();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('goToHome should disconnect', () => {
        const spy = spyOn(socketServiceMock, 'disconnect');
        component.goToHome();
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

    it('receiving "refused" from socket should navigate to gameSelection view', () => {
        component.refuseListen();
        socketHelper.peerSideEmit('refused', { roomId: 0 });
        expect(mockRouter.navigate).toHaveBeenCalled();
    });

    it('receiving "updateQueue" from socket should update the queue', () => {
        mockLobbyService.host = true;
        const newQueueTest = '[["key",{"playerName":"name","socketId":"id"}]]';
        component.ngOnInit();
        socketHelper.peerSideEmit('updateQueue', { newQueue: newQueueTest });
        expect(component.playerQueue.get('key')).toEqual({ playerName: 'name', socketId: 'id' });
    });

    it('receiving "updateQueue" from socket should update the queue', () => {
        loginSpy.getLimitedTimeGame.and.returnValue(true);
        const roomIdTest = '1';
        const firstGameTest = 1;
        component.ngOnInit();
        socketHelper.peerSideEmit('goToCoopGame', { roomId: roomIdTest, firstGame: firstGameTest });
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/limitedOneVsOne']);
    });

    it('receiving "updateQueue" from socket should update the queue', () => {
        const spyRefuse = spyOn(component, 'refuseListen');
        const spySend = spyOn(socketServiceMock, 'send');
        loginSpy.getGameId.and.returnValue('gameId');
        loginSpy.getFormData.and.returnValue('name');
        component.ngOnInit();
        expect(spyRefuse).toHaveBeenCalledWith();
        expect(spySend).toHaveBeenCalledWith('joinQueue', {
            gameId: 'gameId',
            playerName: 'name',
        });
    });

    it('cancel should call goToHome if limitedGame', () => {
        const spyHome = spyOn(component, 'goToHome');
        loginSpy.getLimitedTimeGame.and.returnValue(true);
        component.cancel();
        expect(spyHome).toHaveBeenCalled();
    });

    it('cancel should call goToGameSelection if not limitedGame', () => {
        const spySelection = spyOn(component, 'goToGameSelection');
        loginSpy.getLimitedTimeGame.and.returnValue(false);
        component.cancel();
        expect(spySelection).toHaveBeenCalled();
    });
});
