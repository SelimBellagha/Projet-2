/* eslint-disable max-classes-per-file */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { VictoryComponent } from '@app/components/victory/victory.component';
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
@Component({
    selector: 'app-chat-box',
    template: '',
})
class MockChatComponent {}
@Component({
    selector: 'app-cheat',
    template: '',
})
class MockCheatComponent {}
describe('OneVsOnePageComponent', () => {
    let component: OneVsOnePageComponent;
    let fixture: ComponentFixture<OneVsOnePageComponent>;
    let socketHelper: SocketTestHelper;
    let lobbyServiceSpy: SpyObj<LobbyService>;
    let displayServiceSpy: SpyObj<DisplayGameService>;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let loginServiceSpy: SpyObj<LoginFormService>;
    let matDialogSpy: SpyObj<MatDialog>;
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
    const historyMock1 = {
        startDate: 'testDate',
        gameLength: '0:19',
        gameMode: 'Temps Limite',
        namePlayer1: 'testName',
        namePlayer2: '',
        winnerName: '',
        nameAbandon: 'testName',
    };

    beforeEach(async () => {
        lobbyServiceSpy = jasmine.createSpyObj('LobbyService', ['send', 'on']);
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', [
            'onPositionClicked',
            'putImages',
            'playWinAudio',
            'initializeGame',
            'flashImages',
            'opponentFoundDifference',
            'enableReplay',
        ]);
        displayServiceSpy = jasmine.createSpyObj('DisplayGameService', ['loadGame', 'convertDifficulty', 'checkPlayerScore', 'addHistory'], {
            game: gameMock1 as unknown as GameData,
        });
        loginServiceSpy = jasmine.createSpyObj('LoginFormService', ['getFormData']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        historyServiceSpy = jasmine.createSpyObj('HistoryService', ['findGameLength']);

        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientService();
        socketServiceMock.socket = socketHelper as unknown as Socket;

        await TestBed.configureTestingModule({
            declarations: [OneVsOnePageComponent, MockChatComponent, MockCheatComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: SocketClientService, useValue: socketServiceMock },
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: DisplayGameService, useValue: displayServiceSpy },
                { provide: LoginFormService, useValue: loginServiceSpy },
                { provide: LobbyService, useValue: lobbyServiceSpy },
                { provide: MatDialog, useValue: matDialogSpy },
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
        component.popUpWindowLose = new ElementRef(document.createElement('div'));
        component.popUpWindowLose.nativeElement.style.display = 'none';
        component.loseGame();
        expect(spy).toHaveBeenCalled();
        expect(component.popUpWindowLose.nativeElement.style.display).toEqual('block');
    });

    it('winGame should call stopStopWatch, playAudio and show correct popUp', () => {
        const spy = spyOn(component, 'stopStopWatch').and.callThrough();
        component.winGame();
        expect(spy).toHaveBeenCalled();
        expect(gameManagerSpy.playWinAudio).toHaveBeenCalled();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('goToGiveUp should show PopUp', () => {
        component.goToGiveUp();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('goToHomePage should navigate to Home Page', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.goToHomePage();
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
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

    it('names in history object should be changed when receiving event "systemMessage" from socket', () => {
        historyServiceSpy.history.nameAbandon = '';
        component.guestName = 'testGuest';
        component.hostName = 'testName';
        socketHelper.peerSideEmit('systemMessage', { name: 'testName' });
        expect(historyServiceSpy.history.nameAbandon).toEqual('testName');
        expect(historyServiceSpy.history.winnerName).toEqual('testGuest');
        expect(displayServiceSpy.addHistory).toHaveBeenCalledWith(historyServiceSpy.history);
    });

    it('if returned name is the host name, winnerName in history object should be changed when receiving event "systemMessage" from socket', () => {
        historyServiceSpy.history.nameAbandon = '';
        component.guestName = 'testGuest';
        component.hostName = 'testHost';
        socketHelper.peerSideEmit('systemMessage', { name: 'testGuest' });
        expect(historyServiceSpy.history.nameAbandon).toEqual('testGuest');
        expect(historyServiceSpy.history.winnerName).toEqual('testHost');
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
    it('winGameAfterGiveUp should be called when receiving event "win" from socket', () => {
        const spy = spyOn(component, 'winGameAfterGiveUp');
        socketHelper.peerSideEmit('win');
        expect(spy).toHaveBeenCalled();
    });
    it('number of differences found per user attributes should be changed when receiving event "differenceUpdate" from socket', () => {
        gameManagerSpy.lastDifferenceFound = 1;
        gameManagerSpy.gameData = gameMock1;
        gameManagerSpy.gameData.differences = [{} as Vec2[]];
        socketHelper.peerSideEmit('differenceUpdate', { nbDifferenceHost: 0, nbDifferenceInvite: 1, differenceId: 0 });
        expect(component.nbDifferencesFoundUser1).toEqual(0);
        expect(component.nbDifferencesFoundUser2).toEqual(1);
        expect(gameManagerSpy.opponentFoundDifference).toHaveBeenCalled();
    });
    it('winAfterGiveUp should call playWinAudio from gameManager ', () => {
        component.winGameAfterGiveUp();
        expect(gameManagerSpy.playWinAudio).toHaveBeenCalled();
    });
    it('winAfterGiveUp should show VictoryPopUp ', () => {
        component.newScore = scoreMock1;
        historyServiceSpy.history = historyMock1;
        component.winGameAfterGiveUp();
        expect(matDialogSpy.open).toHaveBeenCalledWith(VictoryComponent, {
            data: { data1: historyMock1, data2: scoreMock1, data3: false },
        });
    });
    it('onReplay() should put component and gameManager in replayMode and', () => {
        component.onReplay();
        expect(component.inReplay).toBeTrue();
        expect(gameManagerSpy.enableReplay).toHaveBeenCalledTimes(1);
    });
});
