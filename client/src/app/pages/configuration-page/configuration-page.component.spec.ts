import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DisplayGameService } from '@app/services/display-game.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { ConfigurationPageComponent, Game } from './configuration-page.component';
import SpyObj = jasmine.SpyObj;

describe('ConfigurationPageComponent', () => {
    let component: ConfigurationPageComponent;
    let fixture: ComponentFixture<ConfigurationPageComponent>;
    let router: Router;
    let displayGamesSpy: SpyObj<DisplayGameService>;
    let socketManagerSpy: SpyObj<SocketClientService>;

    beforeEach(async () => {
        displayGamesSpy = jasmine.createSpyObj('DisplayGameService', [
            'loadAllGames',
            'getHistory',
            'resetAllScores',
            'deleteGameHistory',
            'deleteAllGames',
        ]);
        socketManagerSpy = jasmine.createSpyObj('DisplayGameService', ['isSocketAlive', 'connect']);

        await TestBed.configureTestingModule({
            declarations: [ConfigurationPageComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: DisplayGameService, useValue: displayGamesSpy },
                { provide: SocketClientService, useValue: socketManagerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfigurationPageComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('checkGames should be executed on initialization', () => {
        const checkSpy = spyOn(component, 'checkGames');
        component.ngOnInit();
        expect(checkSpy).toHaveBeenCalled();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' clicking on acceuil button should navigate to home Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToHomePage();
        expect(routerSpy).toHaveBeenCalledWith(['home']);
    });

    it('clicking on suivant should call next()', () => {
        component.hasNextPage = true;
        component.hasNext = true;
        component.hasPrevious = true;
        fixture.detectChanges();
        const nextSpy = spyOn(component, 'next');
        const nextInput: HTMLInputElement = document.getElementById('nextInput') as HTMLInputElement;
        nextInput?.click();
        expect(nextSpy).toHaveBeenCalled();
    });

    it('on config page clicking on previous should call previous()', () => {
        component.hasNextPage = true;
        component.hasNext = true;
        component.hasPrevious = true;
        fixture.detectChanges();
        const previousInput: HTMLInputElement = document.getElementById('previousInput') as HTMLInputElement;
        const previousSpy = spyOn(component, 'previous');
        previousInput?.click();
        expect(previousSpy).toHaveBeenCalled();
    });

    it('clicking on Accéder à la Vue de création de jeu button should navigate to game creation Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToCreationPage();
        expect(routerSpy).toHaveBeenCalledWith(['gameCreation']);
    });

    it('should show the popup window on goToReset()', async () => {
        const popupWindow = component.popUpResetScores.nativeElement;
        expect(popupWindow.style.display).toEqual('');
        await component.goToReset();
        expect(popupWindow.style.display).toEqual('block');
    });

    it('should show the popup window on goToDelete()', async () => {
        const popupWindow = component.popUpDeleteGames.nativeElement;
        expect(popupWindow.style.display).toEqual('');
        await component.goToDelete();
        expect(popupWindow.style.display).toEqual('block');
    });

    it('should hide the popup window on resetAllScores()', async () => {
        const popupWindow = component.popUpResetScores.nativeElement;
        popupWindow.style.display = 'block';
        expect(popupWindow.style.display).toEqual('block');
        component.resetAllScores();
        expect(displayGamesSpy.resetAllScores).toHaveBeenCalled();
        expect(popupWindow.style.display).toEqual('none');
    });

    it('should show the popup window on goToHistory()', async () => {
        const popupWindow = component.popUpHistory.nativeElement;
        expect(popupWindow.style.display).toEqual('');
        await component.goToHistory();
        expect(displayGamesSpy.getHistory).toHaveBeenCalled();
        expect(popupWindow.style.display).toEqual('block');
    });

    it('should show the popup window on goToDeleteHistory()', async () => {
        const popupWindow = component.popUpDeleteHistory.nativeElement;
        expect(popupWindow.style.display).toEqual('');
        await component.goToDeleteHistory();
        expect(popupWindow.style.display).toEqual('block');
    });

    it('should hide the popup window on onClosingPopUp(history)', () => {
        const popupWindow = component.popUpHistory.nativeElement;
        popupWindow.style.display = 'block';
        expect(popupWindow.style.display).toEqual('block');
        component.onClosingPopUp('history');
        expect(popupWindow.style.display).toEqual('none');
    });

    it('should hide the popup window on deleteAllGames()', () => {
        const popupWindow = component.popUpDeleteGames.nativeElement;
        popupWindow.style.display = 'block';
        expect(popupWindow.style.display).toEqual('block');
        component.deleteAllGames();
        expect(displayGamesSpy.deleteAllGames).toHaveBeenCalled();
        expect(popupWindow.style.display).toEqual('none');
    });

    it('should hide the popup window on onClosingPopUp(reset)', () => {
        const popupWindow = component.popUpResetScores.nativeElement;
        popupWindow.style.display = 'block';
        expect(popupWindow.style.display).toEqual('block');
        component.onClosingPopUp('reset');
        expect(popupWindow.style.display).toEqual('none');
    });

    it('should hide the popup window on onClosingPopUp(deleteHistory)', () => {
        const popupWindow = component.popUpDeleteHistory.nativeElement;
        popupWindow.style.display = 'block';
        expect(popupWindow.style.display).toEqual('block');
        component.onClosingPopUp('deleteHistory');
        expect(popupWindow.style.display).toEqual('none');
    });

    it('should hide the popup window and delete history on deleteHistory', () => {
        const popupWindowDelete = component.popUpDeleteHistory.nativeElement;
        const popupWindowHistory = component.popUpHistory.nativeElement;
        popupWindowDelete.style.display = 'block';
        popupWindowHistory.style.display = 'block';
        expect(popupWindowDelete.style.display).toEqual('block');
        expect(popupWindowHistory.style.display).toEqual('block');
        component.deleteHistory();
        expect(displayGamesSpy.deleteGameHistory).toHaveBeenCalled();
        expect(popupWindowDelete.style.display).toEqual('none');
        expect(popupWindowHistory.style.display).toEqual('none');
    });

    it('nextPage should set hasNextPage to true if the list of games has more than 4 games ', () => {
        component.games = [{} as Game, {} as Game, {} as Game, {} as Game, {} as Game];
        component.hasNextPage = false;
        component.nextPage();
        expect(component.hasNextPage).toBeTrue();
    });
    it('next should change games displayed to the next group of 4 games ', () => {
        component.games = [{} as Game, {} as Game, {} as Game, {} as Game, {} as Game];
        component.next();
        expect(component.gamesDisplayed.length).toEqual(1);
    });
    it('next should change hasNext to false if the new games is the last group of 4 ', () => {
        component.games = [{} as Game, {} as Game, {} as Game, {} as Game, {} as Game];
        component.next();
        expect(component.hasNext).toBeFalse();
    });
    it('previous should change hasPrevious to false if the new games is the first group of 4 ', () => {
        component.games = [{} as Game, {} as Game, {} as Game, {} as Game, {} as Game];
        component.firstGame = 4;
        component.lastGame = 8;
        component.previous();
        expect(component.hasPrevious).toBeFalse();
    });

    it('previous should change games displayed to previous 4 ', () => {
        component.games = [{} as Game, {} as Game, {} as Game, {} as Game, {} as Game];
        component.firstGame = 4;
        component.lastGame = 8;
        component.previous();
        expect(component.firstGame).toEqual(0);
    });
    it('checkGames should call checkPlayers and nextPage if there are games in the list', async () => {
        const spyNext = spyOn(component, 'nextPage');
        displayGamesSpy.games = [];
        await component.checkGames();
        expect(spyNext).toHaveBeenCalled();
    });
});
