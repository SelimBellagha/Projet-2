import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { MouseButton } from '@app/components/play-area/play-area.component';
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
    let historyServiceSpy: SpyObj<HistoryService>;
    let router: Router;
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
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientService();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        displayGameSpy = jasmine.createSpyObj('DisplayGameService', ['convertDifficulty', 'loadAllGames', 'addHistory']);
        limitedLobbySpy = jasmine.createSpyObj('LimitedTimeLobbyService', ['getTimeInfo'], { roomId: 'id' });
        historyServiceSpy = jasmine.createSpyObj('HistoryService', ['findGameLength']);
        await TestBed.configureTestingModule({
            declarations: [SoloLimitedTimeComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: DisplayGameService, useValue: displayGameSpy },
                { provide: LimitedTimeLobbyService, useValue: limitedLobbySpy },
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

    it('should call endGame when timer ends', () => {
        const secondTest = 1000;
        const endSpy = spyOn(component, 'endGame');
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

    it('goToHomePage should navigate to home and call stopTimer', async () => {
        const routerSpy = spyOn(router, 'navigate');
        const stopTimerSpy = spyOn(component, 'stopTimer');
        await component.goToHomePage();
        expect(routerSpy).toHaveBeenCalledWith(['home']);
        expect(stopTimerSpy).toHaveBeenCalled();
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

    it('goToHomePageAfterQuit should unShow PopUp and navigate to home', async () => {
        component.popUpWindow.nativeElement.style.display = 'block';
        const routerSpy = spyOn(router, 'navigate');
        await component.ngOnInit();
        component.startDate = new Date();
        component.goToHomePageAfterQuit();
        expect(historyServiceSpy.findGameLength).toHaveBeenCalledWith(component.startDate);
        expect(displayGameSpy.addHistory).toHaveBeenCalledWith(historyServiceSpy.history);
        expect(component.popUpWindow.nativeElement.style.display).toEqual('none');
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
    });

    it('goToCongratulations should show popUp', () => {
        component.popUpWindow.nativeElement.style.display = 'none';
        component.goToCongratulations();
        expect(component.popUpWindow.nativeElement.style.display).toEqual('block');
    });
});
