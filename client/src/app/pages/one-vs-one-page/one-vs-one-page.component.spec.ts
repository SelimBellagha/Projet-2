import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { GameData } from '@app/interfaces/game.interface';
import { Player } from '@app/interfaces/player';
import { Vec2 } from '@app/interfaces/vec2';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { HistoryService } from '@app/services/history.service';
import { LobbyService } from '@app/services/lobby.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Socket } from 'socket.io-client';
import { OneVsOnePageComponent } from './one-vs-one-page.component';
import SpyObj = jasmine.SpyObj;

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('OneVsOnePageComponent', () => {
    let component: OneVsOnePageComponent;
    let fixture: ComponentFixture<OneVsOnePageComponent>;
    let socketHelper: SocketTestHelper;
    let lobbyServiceSpy: SpyObj<LobbyService>;
    let displayServiceSpy: SpyObj<DisplayGameService>;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let loginServiceSpy: SpyObj<LoginFormService>;
    let historyServiceSpy: SpyObj<HistoryService>;

    let router: Router;
    let socketServiceMock: SocketClientServiceMock;
    const gameMock1 = {
        id: '0',
        name: 'mock',
        originalImage: 'mock',
        modifiedImage: 'mock',
        nbDifferences: 1,
        differences: [],
        isDifficult: true,
    };
    const scoreMock1 = {
        position: '1',
        gameId: 'test',
        gameType: 'test',
        time: 'test',
        playerName: 'mock',
    };

    beforeEach(async () => {
        lobbyServiceSpy = jasmine.createSpyObj('LobbyService', ['send', 'on']);
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', [
            'onPositionClicked',
            'putImages',
            'playWinAudio',
            'initializeGame',
            'flashImages',
        ]);
        displayServiceSpy = jasmine.createSpyObj('DisplayGameService', ['loadGame', 'convertDifficulty', 'checkPlayerScore', 'addHistory'], {
            game: gameMock1 as unknown as GameData,
        });
        loginServiceSpy = jasmine.createSpyObj('LoginFormService', ['getFormData']);
        historyServiceSpy = jasmine.createSpyObj('HistoryService', ['findGameLength']);

        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientService();
        socketServiceMock.socket = socketHelper as unknown as Socket;

        await TestBed.configureTestingModule({
            declarations: [OneVsOnePageComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: SocketClientService, useValue: socketServiceMock },
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: DisplayGameService, useValue: displayServiceSpy },
                { provide: LoginFormService, useValue: loginServiceSpy },
                { provide: LobbyService, useValue: lobbyServiceSpy },
                { provide: HistoryService, useValue: historyServiceSpy },
            ],
        }).compileComponents();

        lobbyServiceSpy.opponent = { playerName: 'tests' } as Player;
        lobbyServiceSpy.host = true;
        fixture = TestBed.createComponent(OneVsOnePageComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('loseGame should call stopStopWatch and show correct PopUp', () => {
        const spy = spyOn(component, 'stopStopWatch').and.callThrough();
        component.popUpWindowLose.nativeElement.style.display = 'none';
        component.loseGame();
        expect(spy).toHaveBeenCalled();
        expect(component.popUpWindowLose.nativeElement.style.display).toEqual('block');
    });

    it('loseGame should call stopStopWatch, playAudio and show correct popUp', () => {
        const spy = spyOn(component, 'stopStopWatch').and.callThrough();
        component.popUpWindowWin.nativeElement.style.display = 'none';
        component.winGame();
        expect(spy).toHaveBeenCalled();
        expect(gameManagerSpy.playWinAudio).toHaveBeenCalled();
        expect(component.popUpWindowWin.nativeElement.style.display).toEqual('block');
    });

    it('goToGiveUp should show PopUp and send giveUp event to server', () => {
        component.popUpWindowGiveUp.nativeElement.style.display = 'none';
        const socketSpy = spyOn(socketServiceMock, 'send');
        component.roomId = '1';
        component.goToGiveUp();
        expect(socketSpy).toHaveBeenCalledWith('giveUp', { roomId: '1' });
        expect(component.popUpWindowGiveUp.nativeElement.style.display).toEqual('block');
    });

    it('winGameAfterGiveUp() should be called when receiving event "win" from socket', () => {
        const spy = spyOn(component, 'winGameAfterGiveUp');
        socketHelper.peerSideEmit('win');
        expect(spy).toHaveBeenCalled();
    });

    it('score time should be changed and convertTimeToString() should be called when receiving event "getRealTime" from socket', () => {
        historyServiceSpy.history.gameLength = '0:00';
        const spy = spyOn(component, 'convertTimeToString');
        gameManagerSpy.gameData = gameMock1;
        gameManagerSpy.gameData.differences = [{} as Vec2[]];
        socketHelper.peerSideEmit('getRealTime', { realTIme: 0 });
        expect(spy).toHaveBeenCalled();
        expect(historyServiceSpy.history.gameLength).toEqual('0:00');
    });

    it('names in history object should be changed when receiving event "systemMessage" from socket', () => {
        historyServiceSpy.history.nameAbandon = '';
        component.guestName = 'testGuest';
        component.hostName = 'testName';
        socketHelper.peerSideEmit('systemMessage', { name: 'testName' });
        expect(historyServiceSpy.history.nameAbandon).toEqual('testName');
        expect(historyServiceSpy.history.winnerName).toEqual('testGuest');
    });

    it('if returned name is the host name, winnerName in history object should be changed when receiving event "systemMessage" from socket', () => {
        historyServiceSpy.history.nameAbandon = '';
        component.guestName = 'testGuest';
        component.hostName = 'testHost';
        socketHelper.peerSideEmit('systemMessage', { name: 'testGuest' });
        expect(historyServiceSpy.history.nameAbandon).toEqual('testGuest');
        expect(historyServiceSpy.history.winnerName).toEqual('testHost');
    });

    it('convertTimeToString should convert seconds to a string of format m:ss', () => {
        const seconds = 9;
        const result = component.convertTimeToString(seconds);
        expect(result).toEqual('0:09');
    });

    it('winGameAfterGiveUp should call stopStopWatch and show popUp', () => {
        component.popUpWindowAbandonWin.nativeElement.style.display = 'none';
        const spy = spyOn(component, 'stopStopWatch');
        component.winGameAfterGiveUp();
        expect(spy).toHaveBeenCalled();
        expect(gameManagerSpy.playWinAudio).toHaveBeenCalled();
        expect(component.popUpWindowAbandonWin.nativeElement.style.display).toEqual('block');
    });

    it('goToStay should unShow PopUp', () => {
        component.popUpWindowGiveUp.nativeElement.style.display = 'block';
        component.goToStay();
        expect(component.popUpWindowGiveUp.nativeElement.style.display).toEqual('none');
    });

    it('goToHomePageLoser should unShow PopUp and navigate to home', () => {
        component.popUpWindowLose.nativeElement.style.display = 'block';
        const routerSpy = spyOn(router, 'navigate');
        component.goToHomePageLoser();
        expect(component.popUpWindowLose.nativeElement.style.display).toEqual('none');
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
    });

    it('goToHomePageAfterAbandon should unShow PopUp and navigate to home', () => {
        component.popUpWindowGiveUp.nativeElement.style.display = 'block';
        const routerSpy = spyOn(router, 'navigate');
        component.startDate = new Date();
        component.goToHomePageAfterAbandon();
        expect(historyServiceSpy.findGameLength).toHaveBeenCalledWith(component.startDate);
        expect(displayServiceSpy.addHistory).toHaveBeenCalledWith(historyServiceSpy.history);
        expect(component.popUpWindowGiveUp.nativeElement.style.display).toEqual('none');
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
    });

    it('goToHomePageWinner should unShow PopUp and navigate to home', () => {
        component.popUpWindowWin.nativeElement.style.display = 'block';
        const routerSpy = spyOn(router, 'navigate');
        component.newScore = scoreMock1;
        component.goToHomePageWinner();
        expect(displayServiceSpy.checkPlayerScore).toHaveBeenCalledWith(scoreMock1);
        expect(displayServiceSpy.addHistory).toHaveBeenCalledWith(historyServiceSpy.history);
        expect(component.popUpWindowWin.nativeElement.style.display).toEqual('none');
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
    });

    it('goToHomePageAbandonWinner should unShow PopUp and navigate to home', () => {
        component.popUpWindowAbandonWin.nativeElement.style.display = 'block';
        const routerSpy = spyOn(router, 'navigate');
        component.goToHomePageAbandonWinner();
        expect(component.popUpWindowAbandonWin.nativeElement.style.display).toEqual('none');
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
    });

    it('giveUp should call goToHomePageAfterAbandon', () => {
        const spy = spyOn(component, 'goToHomePageAfterAbandon');
        component.giveUp();
        expect(spy).toHaveBeenCalled();
    });

    it('returnSelectionPage should navigate to gameSelection Page', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.returnSelectionPage();
        expect(routerSpy).toHaveBeenCalledOnceWith(['/gameSelection']);
    });
    it('OnClick should call onPositionClicked from gameManager if button pressed is left', () => {
        const mouseEventMock = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        component.onClick(mouseEventMock);
        expect(gameManagerSpy.onPositionClicked).toHaveBeenCalled();
    });

    it('OnClick should call send from socketService if onPositionClicked returns true', async () => {
        const mouseEventMock = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        gameManagerSpy.onPositionClicked.and.resolveTo(true);
        const socketSpy = spyOn(socketServiceMock, 'send');
        await component.onClick(mouseEventMock);
        expect(socketSpy).toHaveBeenCalled();
    });
    it('OnClick should not call send from socketService if onPositionClicked returns false', () => {
        const mouseEventMock = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        gameManagerSpy.onPositionClicked.and.resolveTo(false);
        const socketSpy = spyOn(socketServiceMock, 'send');
        component.onClick(mouseEventMock);
        expect(socketSpy).toHaveBeenCalledTimes(0);
    });

    it('Win check should call winGame if user1 found enough differences', () => {
        component.nbDifferenceToWin = 1;
        component.nbDifferencesFoundUser1 = 1;
        lobbyServiceSpy.host = true;
        component.hostName = 'test';
        const spy = spyOn(component, 'winGame');
        component.winCheck();
        expect(historyServiceSpy.history.winnerName).toEqual('test');
        expect(spy).toHaveBeenCalled();
    });

    it('Win check should call winGame if user2 found enough differences', () => {
        component.nbDifferenceToWin = 1;
        component.nbDifferencesFoundUser1 = 0;
        component.nbDifferencesFoundUser2 = 1;
        lobbyServiceSpy.host = false;
        component.guestName = 'test';
        const spy = spyOn(component, 'winGame');
        component.winCheck();
        expect(historyServiceSpy.history.winnerName).toEqual('test');
        expect(spy).toHaveBeenCalled();
    });

    it('Win check should call loseGame if otherUser found enough differences', () => {
        component.nbDifferenceToWin = 1;
        component.nbDifferencesFoundUser1 = 0;
        component.nbDifferencesFoundUser2 = 1;
        lobbyServiceSpy.host = true;
        const spy = spyOn(component, 'loseGame');
        component.winCheck();
        expect(spy).toHaveBeenCalled();
    });

    it('username attribute should be changed when receiving event "getHostName" from socket', () => {
        lobbyServiceSpy.host = false;
        component.ngOnInit();
        socketHelper.peerSideEmit('getHostName', { hostName: 'test' });
        expect(component.hostName).toEqual('test');
    });
    it('number of differences found per user attributes should be changed when receiving event "differenceUpdate" from socket', () => {
        gameManagerSpy.lastDifferenceFound = 1;
        gameManagerSpy.gameData = gameMock1;
        gameManagerSpy.gameData.differences = [{} as Vec2[]];
        socketHelper.peerSideEmit('differenceUpdate', { nbDifferenceHost: 0, nbDifferenceInvite: 1, differenceId: 0 });
        expect(component.nbDifferencesFoundUser1).toEqual(0);
        expect(component.nbDifferencesFoundUser2).toEqual(1);
        expect(gameManagerSpy.flashImages).toHaveBeenCalled();
    });
});
