import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DisplayGameService } from '@app/services/display-game.service';
import { LoginFormService } from '@app/services/login-form.service';
import { JeuxComponent } from './jeux.component';
import SpyObj = jasmine.SpyObj;

describe('JeuxComponent', () => {
    let component: JeuxComponent;
    let fixture: ComponentFixture<JeuxComponent>;
    let router: Router;
    let displayServiceSpy: SpyObj<DisplayGameService>;
    let loginFormSpy: SpyObj<LoginFormService>;

    beforeEach(async () => {
        displayServiceSpy = jasmine.createSpyObj('DisplayGameService', ['loadGame']);
        loginFormSpy = jasmine.createSpyObj('LoginFormService', ['setGameType', 'setPlayerType', 'setGameId']);
        await TestBed.configureTestingModule({
            declarations: [JeuxComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: DisplayGameService, useValue: displayServiceSpy },
                { provide: LoginFormService, useValue: loginFormSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(JeuxComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
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
        expect(displayServiceSpy.loadGame).toHaveBeenCalledWith(0);
    });

    it('PlaySolo should call GameType, PlayerType and goToLoginPage', () => {
        const spy = spyOn(component, 'goToLoginPage');
        component.playSolo();
        expect(loginFormSpy.setGameType).toHaveBeenCalled();
        expect(loginFormSpy.setPlayerType).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('When host PlayMultiplayer should call GameType, PlayerType with true and goToLoginPage', () => {
        const spy = spyOn(component, 'goToLoginPage');
        component.multiplayerButton = 'Créer';
        component.playMultiplayer();
        expect(loginFormSpy.setGameType).toHaveBeenCalledWith(true);
        expect(loginFormSpy.setPlayerType).toHaveBeenCalledWith(true);
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
});
