import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { GameData } from '@app/interfaces/game.interface';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LobbyService } from '@app/services/lobby.service';
import { SoloLimitedTimeComponent } from './solo-limited-time.component';
import SpyObj = jasmine.SpyObj;

describe('SoloLimitedTimeComponent', () => {
    let component: SoloLimitedTimeComponent;
    let fixture: ComponentFixture<SoloLimitedTimeComponent>;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let displayGameSpy: SpyObj<DisplayGameService>;
    let lobbySpy: SpyObj<LobbyService>;
    let router: Router;

    const gameMock1 = {
        id: '0',
        name: 'mock',
        originalImage: 'mock',
        modifiedImage: 'mock',
        nbDifferences: 1,
        differences: [],
        isDifficult: true,
    };

    beforeEach(async () => {
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', ['onPositionClicked', 'putImages', 'playWinAudio', 'initializeGame'], {
            gameData: gameMock1 as unknown as GameData,
        });
        lobbySpy = jasmine.createSpyObj('LobbyService', { firstGame: 0 });
        displayGameSpy = jasmine.createSpyObj('DisplayGameService', ['convertDifficulty']);
        await TestBed.configureTestingModule({
            declarations: [SoloLimitedTimeComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: DisplayGameService, useValue: displayGameSpy },
                { provide: LobbyService, useValue: lobbySpy },
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

    it('timer should countdown the timer', () => {
        spyOn(component, 'endGame');

        jasmine.clock().install();

        const gameTime = 30;
        component.timer(gameTime);
        expect(component.minutes).toBe(0);
        expect(component.secondes).toBe(gameTime % 60);

        jasmine.clock().tick(1000);
        expect(component.minutes).toBe(0);
        expect(component.secondes).toBe((gameTime % 60) - 1);

        jasmine.clock().tick(28000);
        expect(component.minutes).toBe(0);
        expect(component.secondes).toBe(1);

        jasmine.clock().tick(1000);
        expect(component.minutes).toBe(0);
        expect(component.secondes).toBe(0);
        expect(component.endGame).toHaveBeenCalled();

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

    it('goToHomePage should navigate to home and call stopTimer', async () => {
        const routerSpy = spyOn(router, 'navigate');
        const stopTimerSpy = spyOn(component, 'stopTimer');
        await component.goToHomePage();
        expect(routerSpy).toHaveBeenCalledWith(['home']);
        expect(stopTimerSpy).toHaveBeenCalled();
    });
});
