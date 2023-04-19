/* eslint-disable max-classes-per-file */
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GameData } from '@app/interfaces/game.interface';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { HistoryService } from '@app/services/history.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { SoloViewPageComponent } from './solo-view-page.component';
import SpyObj = jasmine.SpyObj;
const timeTest = 1000;

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
@Component({
    selector: 'app-mode-indice',
    template: '',
})
class MockHintComponent {}

describe('SoloViewPageComponent', () => {
    let component: SoloViewPageComponent;
    let fixture: ComponentFixture<SoloViewPageComponent>;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let displayServiceSpy: SpyObj<DisplayGameService>;
    let loginServiceSpy: SpyObj<LoginFormService>;
    let socketService: SpyObj<SocketClientService>;
    let historyServiceSpy: SpyObj<HistoryService>;
    let router: Router;
    let matDialogSpy: SpyObj<MatDialog>;
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
    const scoreMock1 = {
        position: '1',
        gameId: 'test',
        gameType: 'test',
        time: 'test',
        playerName: 'mock',
    };

    beforeEach(async () => {
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', ['onPositionClicked', 'putImages', 'playWinAudio', 'initializeGame']);
        displayServiceSpy = jasmine.createSpyObj('DisplayGameService', ['loadGame', 'convertDifficulty', 'checkPlayerScore', 'addHistory'], {
            game: gameMock1 as unknown as GameData,
        });
        loginServiceSpy = jasmine.createSpyObj('LoginFormService', ['getFormData']);
        socketService = jasmine.createSpyObj('SocketClientService', ['send']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        historyServiceSpy = jasmine.createSpyObj('HistoryService', ['findGameLength']);
        loginServiceSpy.getFormData.and.returnValue(username);

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [SoloViewPageComponent, MockChatComponent, MockCheatComponent, MockHintComponent],
            providers: [
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: DisplayGameService, useValue: displayServiceSpy },
                { provide: LoginFormService, useValue: loginServiceSpy },
                { provide: SocketClientService, useValue: socketService },
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: HistoryService, useValue: historyServiceSpy },
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

    it('getGameTime should convert time to m:ss format', () => {
        component.minutes = 1;
        component.secondes = 20;
        const result = component.getGameTime();
        expect(result).toEqual('1:20');
    });

    it('getGameTime should convert time to m:0s format if seconds < 10', () => {
        component.minutes = 1;
        component.secondes = 9;
        const result = component.getGameTime();
        expect(result).toEqual('1:09');
    });

    xit(' endGame should call playWinAudio from gameManager', () => {
        const popUp = component.popUpWindow;
        popUp.nativeElement.style.display = 'none';
        component.newScore = scoreMock1;
        const spy = spyOn(component, 'getGameTime');
        component.endGame();
        expect(spy).toHaveBeenCalled();
        expect(historyServiceSpy.findGameLength).toHaveBeenCalledWith(component.startDate);
        expect(displayServiceSpy.checkPlayerScore).toHaveBeenCalledWith(scoreMock1);
        expect(displayServiceSpy.addHistory).toHaveBeenCalledWith(historyServiceSpy.history);
        expect(gameManagerSpy.playWinAudio).toHaveBeenCalled();
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
    /*
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
    */

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

    /*
    it('goToHomePage should navigate to Home Page', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.goToHomePage();
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
    });

    */
    /*
    it('goToCongratulations should update the display style of popup to block', () => {
        const popUp = component.popUpWindow;
        popUp.nativeElement.style.display = 'none';
        component.goToCongratulations();
        expect(popUp.nativeElement.style.display).toEqual('block');
    });*/

    it('abandonGame should call addHistory and navigate to gameSelection', () => {
        const routerSpy = spyOn(router, 'navigate');
        const spy = spyOn(component, 'stopStopWatch');
        component.abandonGame();
        expect(spy).toHaveBeenCalled();
        expect(historyServiceSpy.findGameLength).toHaveBeenCalledWith(component.startDate);
        expect(displayServiceSpy.addHistory).toHaveBeenCalledWith(historyServiceSpy.history);
        expect(routerSpy).toHaveBeenCalledOnceWith(['/gameSelection']);
    });
});
