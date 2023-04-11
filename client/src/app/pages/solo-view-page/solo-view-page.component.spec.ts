import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GameData } from '@app/interfaces/game.interface';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SoloViewPageComponent } from './solo-view-page.component';
import SpyObj = jasmine.SpyObj;
const timeTest = 1000;

describe('SoloViewPageComponent', () => {
    let component: SoloViewPageComponent;
    let fixture: ComponentFixture<SoloViewPageComponent>;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let displayServiceSpy: SpyObj<DisplayGameService>;
    let loginServiceSpy: SpyObj<LoginFormService>;
    let router: Router;

    const username = 'testName';
    const gameMock1 = {
        id: '0',
        name: 'mock',
        originalImage: 'mock',
        modifiedImage: 'mock',
        nbDifferences: 1,
        differences: [],
        isDifficult: true,
    };
    /*
    const gameMock2 = {
        id: '1',
        name: 'mock',
        originalImage: 'mock',
        modifiedImage: 'mock',
        nbDifferences: 1,
        differences: [],
        isDifficult: false,
    };*/

    beforeEach(async () => {
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', ['onPositionClicked', 'putImages', 'playWinAudio', 'initializeGame']);
        displayServiceSpy = jasmine.createSpyObj('DisplayGameService', ['loadGame', 'convertDifficulty'], { game: gameMock1 as unknown as GameData });
        loginServiceSpy = jasmine.createSpyObj('LoginFormService', ['getFormData']);

        loginServiceSpy.getFormData.and.returnValue(username);

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [SoloViewPageComponent],
            providers: [
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: DisplayGameService, useValue: displayServiceSpy },
                { provide: LoginFormService, useValue: loginServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SoloViewPageComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('On initialization, getFormData from loginService should be called, and username property should be modified', () => {
        expect(loginServiceSpy.getFormData).toHaveBeenCalled();
        expect(component.username).toEqual(username);
    });

    it('should increment seconds every second', () => {
        const initialSeconds1 = component.secondes;
        jasmine.clock().install();
        component.startStopWatch();
        jasmine.clock().tick(timeTest);
        expect(component.secondes).toBe(initialSeconds1 + 1);
        jasmine.clock().uninstall();
    });

    it(' clicking on return button should navigate to configuration Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.returnSelectionPage();
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/gameSelection']);
    });

    it(' endGame should call playWinAudio from gameManager', () => {
        component.endGame();
        expect(gameManagerSpy.playWinAudio).toHaveBeenCalled();
    });

    it(' endGame should change display of popUp to block', () => {
        const popUp = component.popUpWindow;
        popUp.nativeElement.style.display = 'none';
        component.endGame();
        expect(popUp.nativeElement.style.display).toEqual('block');
    });

    it('OnClick should not increment nbDifferencesFound if button clicked is not leftMouseButton', () => {
        const mouseEvent = {
            offsetX: 0,
            offsetY: 0,
            button: 2,
        } as MouseEvent;
        gameManagerSpy.onPositionClicked.and.resolveTo(true);
        component.onClick(mouseEvent);
        expect(component.nbDifferencesFound).toEqual(0);
    });
    it('OnClick should not increment nbDifferencesFound if onPositionClicked returns false', () => {
        const mouseEvent = {
            offsetX: 0,
            offsetY: 0,
            button: 0,
        } as MouseEvent;
        gameManagerSpy.onPositionClicked.and.resolveTo(false);
        component.onClick(mouseEvent);
        expect(component.nbDifferencesFound).toEqual(0);
    });
    it('OnClick should increment nbDifferencesFound if onPositionClicked returns true and button clicked is left', async () => {
        const mouseEvent = {
            offsetX: 0,
            offsetY: 0,
            button: 0,
        } as MouseEvent;
        gameManagerSpy.onPositionClicked.and.resolveTo(true);
        await component.onClick(mouseEvent);
        expect(gameManagerSpy.onPositionClicked).toHaveBeenCalled();
        expect(component.nbDifferencesFound).toEqual(1);
    });

    it('OnClick should call endGame if nbDifferencesFound reaches nb of difference', async () => {
        const mouseEvent = {
            offsetX: 0,
            offsetY: 0,
            button: 0,
        } as MouseEvent;
        gameManagerSpy.onPositionClicked.and.resolveTo(true);
        const spy = spyOn(component, 'endGame');
        component.nbDifferences = 1;
        await component.onClick(mouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('goToHomePage should navigate to Home Page', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.goToHomePage();
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
    });

    it('goToHomePage should navigate to Home Page', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.goToHomePage();
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
    });

    it('goToCongratulations should update the display style of popup to block', () => {
        const popUp = component.popUpWindow;
        popUp.nativeElement.style.display = 'none';
        component.goToCongratulations();
        expect(popUp.nativeElement.style.display).toEqual('block');
    });

    xit('stopWatch should start', () => {
        const timerTest = 4;
        const waitTime = 5000;

        const time = component.secondes;
        expect(time).toBeGreaterThanOrEqual(0);
        const timerSpy = spyOn(component, 'startStopWatch');
        component.startStopWatch();
        expect(timerSpy).toHaveBeenCalled();
        setTimeout(() => {
            const time2 = component.secondes;
            expect(time2).toBeGreaterThanOrEqual(timerTest);
        }, waitTime);
    });

    it('startTimer should call timer()', () => {
        const spy = spyOn(component, 'stopWatch');
        component.startStopWatch();
        expect(spy).toHaveBeenCalled();
    });
});
