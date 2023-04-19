import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { GameData } from '@app/interfaces/game.interface';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LimitedTimeLobbyService } from '@app/services/limited-time-lobby.service';
import { SoloLimitedTimeComponent } from './solo-limited-time.component';
import SpyObj = jasmine.SpyObj;

describe('SoloLimitedTimeComponent', () => {
    let component: SoloLimitedTimeComponent;
    let fixture: ComponentFixture<SoloLimitedTimeComponent>;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let displayGameSpy: SpyObj<DisplayGameService>;
    let limitedLobbySpy: SpyObj<LimitedTimeLobbyService>;

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
        displayGameSpy = jasmine.createSpyObj('DisplayGameService', ['convertDifficulty', 'loadAllGames']);
        limitedLobbySpy = jasmine.createSpyObj('LimitedTimeLobbyService', { roomId: 'id' });
        await TestBed.configureTestingModule({
            declarations: [SoloLimitedTimeComponent],
            imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: DisplayGameService, useValue: displayGameSpy },
                { provide: LimitedTimeLobbyService, useValue: limitedLobbySpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SoloLimitedTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('endGame should call stopTimer and playWinAudio', async () => {
        const stopTimerSpy = spyOn(component, 'stopTimer');
        component.endGame();
        expect(stopTimerSpy).toHaveBeenCalled();
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
        displayGameSpy.convertDifficulty.and.returnValue('Niveau: difficile');
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

    it('if firstGame, should call initializeGame', () => {
        limitedLobbySpy.firstGame = 1;
        component.ngOnInit();
        expect(gameManagerSpy.initializeGame).toHaveBeenCalled();
    });
});
