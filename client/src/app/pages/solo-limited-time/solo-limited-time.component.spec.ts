import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { TimeOffComponent } from '@app/components/time-off/time-off.component';
import { VictoryComponent } from '@app/components/victory/victory.component';
import { GameHistory } from '@app/interfaces/game-history';
import { GameData } from '@app/interfaces/game.interface';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { HistoryService } from '@app/services/history.service';
import { LimitedTimeLobbyService } from '@app/services/limited-time-lobby.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Socket } from 'socket.io-client';
import { SoloLimitedTimeComponent } from './solo-limited-time.component';
import SpyObj = jasmine.SpyObj;

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('SoloLimitedTimeComponent', () => {
    let component: SoloLimitedTimeComponent;
    let fixture: ComponentFixture<SoloLimitedTimeComponent>;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let displayGameSpy: SpyObj<DisplayGameService>;
    let limitedLobbySpy: SpyObj<LimitedTimeLobbyService>;
    let matDialogSpy: SpyObj<MatDialog>;
    let router: Router;
    let historyServiceSpy: SpyObj<HistoryService>;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;

    const gameMock1: GameData = {
        id: '0',
        name: 'mock',
        originalImage: 'mock',
        modifiedImage: 'mock',
        nbDifferences: 1,
        differences: [],
        isDifficult: true,
    };

    beforeEach(async () => {
        gameManagerSpy = jasmine.createSpyObj(
            'GameManagerService',
            ['onPositionClicked', 'putImages', 'playWinAudio', 'initializeGame', 'initializeLimitedGame'],
            {
                gameData: gameMock1 as unknown as GameData,
            },
        );
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        displayGameSpy = jasmine.createSpyObj('DisplayGameService', ['convertDifficulty', 'loadAllGames']);
        limitedLobbySpy = jasmine.createSpyObj('LimitedTimeLobbyService', { roomId: 'id' });
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientService();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        displayGameSpy = jasmine.createSpyObj('DisplayGameService', ['convertDifficulty', 'loadAllGames', 'addHistory']);
        limitedLobbySpy = jasmine.createSpyObj('LimitedTimeLobbyService', ['getTimeInfo'], { roomId: 'id' });
        historyServiceSpy = jasmine.createSpyObj('HistoryService', ['findGameLength'], {
            history: { nameAbandon: 'null', gameLength: 'null' } as GameHistory,
        });
        await TestBed.configureTestingModule({
            declarations: [SoloLimitedTimeComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: DisplayGameService, useValue: displayGameSpy },
                { provide: LimitedTimeLobbyService, useValue: limitedLobbySpy },
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: HistoryService, useValue: historyServiceSpy },
                { provide: SocketClientService, useValue: socketServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SoloLimitedTimeComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('endGame should call stopTimer and playWinAudio', async () => {
        const stopTimerSpy = spyOn(component, 'stopTimer');
        await component.ngOnInit();
        component.endGame();
        expect(stopTimerSpy).toHaveBeenCalled();
        expect(displayGameSpy.addHistory).toHaveBeenCalled();
        expect(gameManagerSpy.playWinAudio).toHaveBeenCalled();
    });

    it('should clear the interval ID', () => {
        const intervalId = 123;
        spyOn(window, 'clearInterval');
        component.intervalID = intervalId;
        component.stopTimer();
        expect(window.clearInterval).toHaveBeenCalledWith(intervalId);
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

    it('should call timeOff when timer ends', () => {
        const secondTest = 1000;
        const endSpy = spyOn(component, 'timeOff');
        jasmine.clock().install();
        component.timer(1);
        jasmine.clock().tick(secondTest);
        expect(endSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should not increment nbDifferencesFound when event.button is not MouseButton.Left', async () => {
        gameManagerSpy.onPositionClicked.and.returnValue(Promise.resolve(false));
        const event = new MouseEvent('click', { button: MouseButton.Right });
        await component.onClick(event);
        expect(component.nbDifferencesFound).toBe(0);
    });

    it('should increment nbDifferencesFound and put new game when onPositionClicked returns true', async () => {
        gameManagerSpy.onPositionClicked.and.returnValue(Promise.resolve(true));
        spyOn(component, 'putNewGame');
        const event = new MouseEvent('click', { button: MouseButton.Left });
        displayGameSpy.convertDifficulty.and.returnValue('difficile');
        await component.onClick(event);
        expect(component.nbDifferencesFound).toBe(1);
        expect(component.putNewGame).toHaveBeenCalled();
    });

    it('should end game when nbDifferencesFound equals gameNumberMax', async () => {
        gameManagerSpy.onPositionClicked.and.returnValue(Promise.resolve(true));
        spyOn(component, 'endGame');
        gameManagerSpy.gameNumberMax = 1;
        const event = new MouseEvent('click', { button: MouseButton.Left });
        await component.onClick(event);
        expect(component.endGame).toHaveBeenCalled();
    });

    it('if not firstGame, should call loadAllGames', () => {
        expect(displayGameSpy.loadAllGames).toHaveBeenCalled();
    });

    it('if not firstGame and if tempGames, should call initializeLimitedGame', async () => {
        displayGameSpy.tempGames = [gameMock1];
        await component.ngOnInit();
        expect(gameManagerSpy.initializeLimitedGame).toHaveBeenCalled();
    });

    it('if firstGame, should call initializeGame', async () => {
        limitedLobbySpy.firstGame = 1;
        await component.ngOnInit();
        expect(gameManagerSpy.initializeGame).toHaveBeenCalled();
    });
    it('gotToGiveUp should open GiveUpComponent', () => {
        component.goToGiveup();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });
    it('goToHomePageAfterQuit should navigate to home', async () => {
        const routerSpy = spyOn(router, 'navigate');
        component.startDate = new Date();
        component.goToHomePageAfterQuit();
        historyServiceSpy.history = { nameAbandon: 'null', gameLength: 'null' } as GameHistory;
        expect(historyServiceSpy.findGameLength).toHaveBeenCalledWith(component.startDate);
        expect(displayGameSpy.addHistory).toHaveBeenCalledWith(historyServiceSpy.history);
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
    });

    it('goToCongratulations should show popUp', () => {
        component.goToCongratulations();
        expect(matDialogSpy.open).toHaveBeenCalledWith(VictoryComponent);
    });
    it('timeOff should show correct popUp', () => {
        component.timeOff();
        expect(matDialogSpy.open).toHaveBeenCalledWith(TimeOffComponent);
    });
});
