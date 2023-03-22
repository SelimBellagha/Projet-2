import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { GameData } from '@app/interfaces/game.interface';
import { Player } from '@app/interfaces/player';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LobbyService } from '@app/services/lobby.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { OneVsOnePageComponent } from './one-vs-one-page.component';
import SpyObj = jasmine.SpyObj;

describe('OneVsOnePageComponent', () => {
    let component: OneVsOnePageComponent;
    let fixture: ComponentFixture<OneVsOnePageComponent>;

    let socketServiceSpy: SpyObj<SocketClientService>;
    let lobbyServiceSpy: SpyObj<LobbyService>;
    let displayServiceSpy: SpyObj<DisplayGameService>;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let loginServiceSpy: SpyObj<LoginFormService>;

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
        socketServiceSpy = jasmine.createSpyObj('SocketClientService', ['send', 'on']);
        lobbyServiceSpy = jasmine.createSpyObj('LobbyService', ['send', 'on']);
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', ['onPositionClicked', 'putImages', 'playWinAudio', 'initializeGame']);
        displayServiceSpy = jasmine.createSpyObj('DisplayGameService', ['loadGame', 'convertDifficulty'], { game: gameMock1 as unknown as GameData });
        loginServiceSpy = jasmine.createSpyObj('LoginFormService', ['getFormData']);
        await TestBed.configureTestingModule({
            declarations: [OneVsOnePageComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: SocketClientService, useValue: socketServiceSpy },
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: DisplayGameService, useValue: displayServiceSpy },
                { provide: LoginFormService, useValue: loginServiceSpy },
                { provide: LobbyService, useValue: lobbyServiceSpy },
            ],
        }).compileComponents();

        lobbyServiceSpy.opponent = { playerName: 'tests' } as Player;
        lobbyServiceSpy.host = true;
        fixture = TestBed.createComponent(OneVsOnePageComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('loseGame should call stopTimer and show correct PopUp', () => {
        const spy = spyOn(component, 'stopTimer').and.callThrough();
        component.popUpWindowLose.nativeElement.style.display = 'none';
        component.loseGame();
        expect(spy).toHaveBeenCalled();
        expect(component.popUpWindowLose.nativeElement.style.display).toEqual('block');
    });

    it('loseGame should call stopTimer, playAudio and show correct popUp', () => {
        const spy = spyOn(component, 'stopTimer').and.callThrough();
        component.popUpWindowWin.nativeElement.style.display = 'none';
        component.winGame();
        expect(spy).toHaveBeenCalled();
        expect(gameManagerSpy.playWinAudio).toHaveBeenCalled();
        expect(component.popUpWindowWin.nativeElement.style.display).toEqual('block');
    });

    it('giveUp should call goToHomePage and send a event to socketService', () => {
        const spy = spyOn(component, 'goToHomePage');
        component.roomId = '1';
        component.giveUp();
        expect(spy).toHaveBeenCalled();
        expect(socketServiceSpy.send).toHaveBeenCalledWith('giveUp', { roomId: '1' });
    });
    it('goToGiveUp should show PopUp', () => {
        component.popUpWindowGiveUp.nativeElement.style.display = 'none';
        component.goToGiveUp();
        expect(component.popUpWindowGiveUp.nativeElement.style.display).toEqual('block');
    });

    it('goToStay should unShow PopUp', () => {
        component.popUpWindowGiveUp.nativeElement.style.display = 'block';
        component.goToStay();
        expect(component.popUpWindowGiveUp.nativeElement.style.display).toEqual('none');
    });
    it('goToHomePage should navigate to Home Page and close PopUps', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.popUpWindowWin.nativeElement.style.display = 'block';
        component.popUpWindowLose.nativeElement.style.display = 'block';
        component.goToHomePage();
        expect(component.popUpWindowWin.nativeElement.style.display).toEqual('none');
        expect(component.popUpWindowLose.nativeElement.style.display).toEqual('none');
        expect(routerSpy).toHaveBeenCalledOnceWith(['home']);
    });

    it('returnSelectionPage should navigate to gameSelection Page', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.returnSelectionPage();
        expect(routerSpy).toHaveBeenCalledOnceWith(['/gameSelection']);
    });
    it('OnClick should call onPositionClicked from gameManager if button pressed is left', () => {
        const mouseEventMock = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        component.onClick(mouseEventMock);
        expect(gameManagerSpy.onPositionClicked).toHaveBeenCalled();
    });

    it('OnClick should call send from socketService if onPositionClicked returns true', async () => {
        const mouseEventMock = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        gameManagerSpy.onPositionClicked.and.resolveTo(true);
        await component.onClick(mouseEventMock);
        expect(socketServiceSpy.send).toHaveBeenCalled();
    });
    it('OnClick should not call send from socketService if onPositionClicked returns false', () => {
        const mouseEventMock = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        gameManagerSpy.onPositionClicked.and.resolveTo(false);
        component.onClick(mouseEventMock);
        expect(socketServiceSpy.send).toHaveBeenCalledTimes(0);
    });
    it('Win check should call winGame if user1 found enough differences', () => {
        component.nbDifferenceToWin = 1;
        component.nbDifferencesFoundUser1 = 1;
        lobbyServiceSpy.host = true;
        const spy = spyOn(component, 'winGame');
        component.winCheck();
        expect(spy).toHaveBeenCalled();
    });
    it('Win check should call winGame if user2 found enough differences', () => {
        component.nbDifferenceToWin = 1;
        component.nbDifferencesFoundUser1 = 0;
        component.nbDifferencesFoundUser2 = 1;
        lobbyServiceSpy.host = false;
        const spy = spyOn(component, 'winGame');
        component.winCheck();
        expect(spy).toHaveBeenCalled();
    });
    it('Win check should call loseGame if otherUser found enough differences', () => {
        component.nbDifferenceToWin = 1;
        component.nbDifferencesFoundUser1 = 0;
        component.nbDifferencesFoundUser2 = 1;
        lobbyServiceSpy.host = true;
        const spy = spyOn(component, 'loseGame');
        component.winCheck();
        expect(spy).toHaveBeenCalled();
    });
});
