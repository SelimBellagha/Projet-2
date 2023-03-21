import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DisplayGameService } from '@app/services/display-game.service';
import { LobbyService } from '@app/services/lobby.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { Game, SelectionPageComponentComponent } from './selection-page-component.component';
import SpyObj = jasmine.SpyObj;

describe('SelectionPageComponentComponent', () => {
    let component: SelectionPageComponentComponent;
    let fixture: ComponentFixture<SelectionPageComponentComponent>;
    let router: Router;
    let displayGamesSpy: SpyObj<DisplayGameService>;
    let socketManagerSpy: SpyObj<SocketClientService>;
    let lobbyServiceSpy: SpyObj<LobbyService>;

    beforeEach(async () => {
        displayGamesSpy = jasmine.createSpyObj('DisplayGameService', ['loadAllGames']);
        socketManagerSpy = jasmine.createSpyObj('DisplayGameService', ['isSocketAlive', 'connect']);
        lobbyServiceSpy = jasmine.createSpyObj('LobbyService', ['deleteLobby']);
        await TestBed.configureTestingModule({
            declarations: [SelectionPageComponentComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: DisplayGameService, useValue: displayGamesSpy },
                { provide: SocketClientService, useValue: socketManagerSpy },
                { provide: LobbyService, useValue: lobbyServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectionPageComponentComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' clicking on acceuil button should navigate to home Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToHomePage();
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/home']);
    });

    it('checkGames should be executed on initialization', () => {
        const checkSpy = spyOn(component, 'checkGames');
        component.ngOnInit();
        expect(checkSpy).toHaveBeenCalled();
    });
    it('checkGames should call checkPlayers and nextPage if there are games in the list', async () => {
        const spyCheck = spyOn(component, 'checkPlayers');
        const spyNext = spyOn(component, 'nextPage');
        displayGamesSpy.games = [{} as Game];
        await component.checkGames();
        expect(spyCheck).toHaveBeenCalled();
        expect(spyNext).toHaveBeenCalled();
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
    it('checkPlayers should set playerInGame to "Rejoindre" if there is a player in the game', () => {
        component.gamesDisplayed = [{ playerInGame: '1' } as Game];
        component.checkPlayers();
        expect(component.gamesDisplayed[0].playerInGame).toEqual('Rejoindre');
    });
    it('checkPlayers should set playerInGame to "Créer" if there is no players in the game', () => {
        component.gamesDisplayed = [{ playerInGame: '0' } as Game];
        component.checkPlayers();
        expect(component.gamesDisplayed[0].playerInGame).toEqual('Créer');
    });
});
