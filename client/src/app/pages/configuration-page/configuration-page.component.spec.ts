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
        displayGamesSpy = jasmine.createSpyObj('DisplayGameService', ['loadAllGames']);
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

    it(' clicking on Accéder à la Vue de création de jeu button should navigate to game creation Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToCreationPage();
        expect(routerSpy).toHaveBeenCalledWith(['gameCreation']);
    });

    it('should show the popup window on goToConstants()', () => {
        const popupWindow = component.popUpWindow.nativeElement;
        expect(popupWindow.style.display).toEqual('');
        component.goToConstants();
        expect(popupWindow.style.display).toEqual('block');
    });

    it('should hide the popup window on onClosingPopUp()', () => {
        const popupWindow = component.popUpWindow.nativeElement;
        popupWindow.style.display = 'block';
        expect(popupWindow.style.display).toEqual('block');
        component.onClosingPopUp();
        expect(popupWindow.style.display).toEqual('none');
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
