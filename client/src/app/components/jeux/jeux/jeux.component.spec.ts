import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunicationService } from '@app/services/communication.service';
import { DisplayGameService } from '@app/services/display-game.service';
import { LobbyService } from '@app/services/lobby.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { of } from 'rxjs';
import { JeuxComponent } from './jeux.component';
import SpyObj = jasmine.SpyObj;

describe('JeuxComponent', () => {
    let component: JeuxComponent;
    let fixture: ComponentFixture<JeuxComponent>;
    let router: Router;
    let displayServiceSpy: SpyObj<DisplayGameService>;
    let loginFormSpy: SpyObj<LoginFormService>;
    let lobbyServiceSpy: SpyObj<LobbyService>;
    let commService: CommunicationService;
    let communicationSpy: SpyObj<CommunicationService>;
    let socketService: SpyObj<SocketClientService>;

    beforeEach(async () => {
        displayServiceSpy = jasmine.createSpyObj('DisplayGameService', ['loadGame']);
        loginFormSpy = jasmine.createSpyObj('LoginFormService', ['setGameType', 'setPlayerType', 'setGameId']);
        lobbyServiceSpy = jasmine.createSpyObj('LobbyServiceSpy', ['host']);
        socketService = jasmine.createSpyObj('socketService', ['on']);
        await TestBed.configureTestingModule({
            declarations: [JeuxComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: DisplayGameService, useValue: displayServiceSpy },
                { provide: LoginFormService, useValue: loginFormSpy },
                { provide: LobbyService, useValue: lobbyServiceSpy },
                { provide: CommunicationService, useValue: communicationSpy },
                CommunicationService,
                { provide: SocketClientService, useValue: socketService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(JeuxComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        commService = TestBed.inject(CommunicationService);
        fixture.detectChanges();

        component.customId = 'defaultID';
        spyOn(commService, 'getGameScores').and.returnValue(
            of([
                {
                    position: '2',
                    gameId: 'defaultID',
                    gameType: 'solo',
                    time: '1:30',
                    playerName: 'TestName',
                },
            ]),
        );
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['deleteGame']);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('goToLoginPage should navigate to Login Page and load the game that the component displays', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.customId = '0';

        component.goToLoginPage();
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/loginPage']);
        expect(displayServiceSpy.loadGame).toHaveBeenCalled();
        expect(displayServiceSpy.loadGame).toHaveBeenCalledWith('0');
    });

    it('PlaySolo should call GameType, PlayerType and goToLoginPage', () => {
        const spy = spyOn(component, 'goToLoginPage');
        component.playSolo();
        expect(loginFormSpy.setGameType).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('When host PlayMultiplayer should call GameType, PlayerType with true and goToLoginPage', () => {
        const spy = spyOn(component, 'goToLoginPage');
        component.multiplayerButton = 'Créer';
        component.playMultiplayer();
        expect(loginFormSpy.setGameType).toHaveBeenCalledWith(true);
        expect(lobbyServiceSpy.host).toEqual(true);
        expect(spy).toHaveBeenCalled();
    });

    it('When guest PlayMultiplayer should call GameType, PlayerType with false and goToLoginPage', () => {
        const spy = spyOn(component, 'goToLoginPage');
        component.multiplayerButton = 'Rejoindre';
        component.playMultiplayer();
        expect(loginFormSpy.setGameType).toHaveBeenCalledWith(true);
        expect(loginFormSpy.setPlayerType).toHaveBeenCalledWith(false);
        expect(spy).toHaveBeenCalled();
    });

    it('PlayMultiplayer should should set GameId with the good id', () => {
        const spy = spyOn(component, 'goToLoginPage');
        component.customId = '0';
        component.playMultiplayer();
        expect(loginFormSpy.setGameId).toHaveBeenCalledWith('0');
        expect(spy).toHaveBeenCalled();
    });

    it('should show the popup window on gotToPopUp()', () => {
        const popupWindow = component.popUpWindow.nativeElement;
        expect(popupWindow.style.display).toEqual('');
        component.goToPopUp();
        expect(popupWindow.style.display).toEqual('block');
    });

    it('should show the popup window on gotToPopUp2()', () => {
        const popupWindow = component.popUpWindow2.nativeElement;
        expect(popupWindow.style.display).toEqual('');
        component.goToPopUp2();
        expect(popupWindow.style.display).toEqual('block');
    });

    it('should hide the popup window on onClosingPopUp()', () => {
        const popupWindow = component.popUpWindow.nativeElement;
        popupWindow.style.display = 'block';
        expect(popupWindow.style.display).toEqual('block');
        component.onClosingPopUp();
        expect(popupWindow.style.display).toEqual('none');
    });

    it('should hide the popup window on onClosingPopUp2()', () => {
        const popupWindow = component.popUpWindow2.nativeElement;
        popupWindow.style.display = 'block';
        expect(popupWindow.style.display).toEqual('block');
        component.onClosingPopUp2();
        expect(popupWindow.style.display).toEqual('none');
    });
    /*
    it('deleteGame should delete the game and close pop up', () => {
        component.deleteGame();
        // commService.deleteGame(component.customId);
        expect(communicationSpy.deleteGame).toHaveBeenCalled();
        expect(component.onClosingPopUp()).toHaveBeenCalled();
    });

    it('resetGameScores should reset the game scores and close pop up', () => {
        component.resetGameScores();
        // expect(commService.resetGameScores).toHaveBeenCalled();
        expect(component.onClosingPopUp2()).toHaveBeenCalled();
    });
*/
    it('loadSoloScores should load the top scores', () => {
        component.ngOnInit();
        component.loadSoloScores();
        expect(commService.getGameScores).toHaveBeenCalled();
        expect(commService.getGameScores).toHaveBeenCalledWith(component.customId, 'solo');
        expect(component.soloScores).toEqual([
            {
                position: '2',
                gameId: 'defaultID',
                gameType: 'solo',
                time: '1:30',
                playerName: 'TestName',
            },
        ]);
    });
});
