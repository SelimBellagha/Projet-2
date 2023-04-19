import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { GameData } from '@app/interfaces/game.interface';
import { Player } from '@app/interfaces/player';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LimitedTimeLobbyService } from '@app/services/limited-time-lobby.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Socket } from 'socket.io-client';
import { OneVsOneLimitedTimeComponent } from './one-vs-one-limited-time.component';
import SpyObj = jasmine.SpyObj;

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

const player1: Player = {
    playerName: 'name1',
    socketId: 'id1',
};
const player2: Player = {
    playerName: 'name2',
    socketId: 'id2',
};

const gameMock1: GameData = {
    id: '0',
    name: 'mock',
    originalImage: 'mock',
    modifiedImage: 'mock',
    nbDifferences: 1,
    differences: [],
    isDifficult: true,
};

const gameMock2: GameData = {
    id: '1',
    name: 'mock2',
    originalImage: 'mock2',
    modifiedImage: 'mock2',
    nbDifferences: 2,
    differences: [],
    isDifficult: false,
};

describe('OneVsOneLimitedTimeComponent', () => {
    let component: OneVsOneLimitedTimeComponent;
    let fixture: ComponentFixture<OneVsOneLimitedTimeComponent>;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;
    let displayGamesSpy: SpyObj<DisplayGameService>;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let router: Router;
    let limitedTimeLobbySpy: SpyObj<LimitedTimeLobbyService>;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientService();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        displayGamesSpy = jasmine.createSpyObj('DisplayGameService', ['convertDifficulty', 'loadAllGames', 'addHistory']);
        limitedTimeLobbySpy = jasmine.createSpyObj('LimitedTimeLobbyService', ['getTimeInfo'], { roomId: 1 });
        gameManagerSpy = jasmine.createSpyObj(
            'gameManagerSpy',
            ['putImages', 'initializeGame', 'initializeLimitedGame', 'playWinAudio', 'onPositionClicked'],
            {
                limitedGameData: [gameMock1, gameMock2],
                gameData: gameMock1,
            },
        );

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: SocketClientService, useValue: socketServiceMock },
                { provide: DisplayGameService, useValue: displayGamesSpy },
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: LimitedTimeLobbyService, useValue: limitedTimeLobbySpy },
            ],
            declarations: [OneVsOneLimitedTimeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OneVsOneLimitedTimeComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('receive "getPlayers" event should set playersName', () => {
        socketHelper.peerSideEmit('getPlayers', { firstPlayer: player1, secondPlayer: player2 });
        component.ngOnInit();
        expect(component.firstPlayerName).toBe(player1.playerName);
        expect(component.secondPlayerName).toBe(player2.playerName);
    });

    it('should start timer and call loadAllGames on initialization', async () => {
        const timerSpy = spyOn(component, 'startTimer');
        const time = 30;
        limitedTimeLobbySpy.initialTime = time;
        await component.ngOnInit();
        expect(timerSpy).toHaveBeenCalledWith(time);
        expect(displayGamesSpy.loadAllGames).toHaveBeenCalled();
    });

    it('on initialization, if tempGames, should call initializeGame and initializeLimitedGame', async () => {
        displayGamesSpy.tempGames = [gameMock1];
        await component.ngOnInit();
        expect(gameManagerSpy.initializeGame).toHaveBeenCalled();
        expect(gameManagerSpy.initializeLimitedGame).toHaveBeenCalled();
    });

    it('on initialization, if tempGames, should set game infos', async () => {
        displayGamesSpy.tempGames = [gameMock1];
        displayGamesSpy.convertDifficulty.and.returnValue('difficile');
        await component.ngOnInit();
        expect(component.gameName).toBe('mock');
        expect(component.difficulty).toBe('difficile');
        expect(gameManagerSpy.putImages).toHaveBeenCalled();
    });

    it('receive "LimitedDifferenceUpdate" should change game', () => {
        socketHelper.peerSideEmit('LimitedDifferenceUpdate', { nbDifferences: 1, newGame: 1 });
        expect(gameManagerSpy.initializeGame).toHaveBeenCalledWith(gameMock2);
    });

    it('receive "LimitedDifferenceUpdate" and found all differences, should call endGame', async () => {
        const endSpy = spyOn(component, 'endGame');
        component.nbDifferencesFound = 1;
        gameManagerSpy.gameNumberMax = 1;
        socketHelper.peerSideEmit('LimitedDifferenceUpdate', { nbDifferences: 1, newGame: 1 });
        await component.ngAfterViewInit();
        expect(endSpy).toHaveBeenCalled();
    });

    it('receive "limitedTimeGiveUp" should navigate to soloLimited page', () => {
        const routerSpy = spyOn(router, 'navigate');
        socketHelper.peerSideEmit('limitedTimeGiveUp');
        expect(routerSpy).toHaveBeenCalledWith(['/soloLimitedTime']);
    });

    it('startTimer should start the timer', () => {
        const time = 10;
        const timerSpy = spyOn(component, 'timer');
        component.startTimer(time);
        expect(timerSpy).toHaveBeenCalledWith(time);
    });

    it('stopTimer should clearInterval', () => {
        const time = 10;
        spyOn(window, 'clearInterval');
        component.startTimer(time);
        component.stopTimer();
        expect(window.clearInterval).toHaveBeenCalledWith(component.intervalID);
    });

    it('should start and stop the timer', () => {
        const secondTest = 1000;
        jasmine.clock().install();
        component.timer(3);

        jasmine.clock().tick(secondTest);
        expect(component.minutes).toBe(0);
        expect(component.secondes).toBe(2);

        jasmine.clock().tick(secondTest);
        expect(component.minutes).toBe(0);
        expect(component.secondes).toBe(1);

        component.stopTimer();

        jasmine.clock().tick(secondTest);
        expect(component.minutes).toBe(0);
        expect(component.secondes).toBe(1);
        jasmine.clock().uninstall();
    });

    it('should call endGame when timer ends', () => {
        const secondTest = 1000;
        const endSpy = spyOn(component, 'endGame');
        jasmine.clock().install();
        component.timer(1);
        jasmine.clock().tick(secondTest);
        expect(endSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('endGame should call stopTimer and playWinAudio', async () => {
        const stopTimerSpy = spyOn(component, 'stopTimer');
        component.endGame();
        expect(stopTimerSpy).toHaveBeenCalled();
        expect(displayGamesSpy.addHistory).toHaveBeenCalled();
        expect(gameManagerSpy.playWinAudio).toHaveBeenCalled();
    });

    it('goToHomePage should navigate to home', async () => {
        const routerSpy = spyOn(router, 'navigate');
        await component.goToHomePage();
        expect(routerSpy).toHaveBeenCalledWith(['/home']);
    });

    it('giveUp should two events : "limitedTimeGiveUp" and "systemMessage"', async () => {
        spyOn(router, 'navigate');
        const spySend = spyOn(socketServiceMock, 'send');
        await component.giveUp();
        expect(spySend).toHaveBeenCalledWith('limitedTimeGiveUp', { roomId: limitedTimeLobbySpy.roomId });
        expect(spySend).toHaveBeenCalledWith('systemMessage', ' a abandonné la partie');
    });

    it('should not increment nbDifferencesFound when event.button is not MouseButton.Left', async () => {
        gameManagerSpy.onPositionClicked.and.returnValue(Promise.resolve(false));
        const event = new MouseEvent('click', { button: MouseButton.Right });
        await component.onClick(event);
        expect(component.nbDifferencesFound).toBe(0);
    });

    it('should send "limitedDifferenceFound" event when onPositionClicked returns true', async () => {
        const spySend = spyOn(socketServiceMock, 'send');
        gameManagerSpy.onPositionClicked.and.returnValue(Promise.resolve(true));
        spyOn(component, 'putNewGame');
        const event = new MouseEvent('click', { button: MouseButton.Left });
        await component.onClick(event);
        expect(spySend).toHaveBeenCalledWith('limitedDifferenceFound', { roomId: limitedTimeLobbySpy.roomId });
    });

    it('should show the popup window on goToGiveUp()', async () => {
        const popupWindow = component.popUpWindowGiveUp.nativeElement;
        expect(popupWindow.style.display).toEqual('');
        await component.goToGiveUp();
        expect(popupWindow.style.display).toEqual('block');
    });

    it('should hide the popup window on goToStay()', () => {
        const popupWindow = component.popUpWindowGiveUp.nativeElement;
        popupWindow.style.display = 'block';
        expect(popupWindow.style.display).toEqual('block');
        component.goToStay();
        expect(popupWindow.style.display).toEqual('none');
    });
});
