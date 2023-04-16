import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginFormService } from '@app/services/login-form.service';
import { LoginPageComponent } from './login-page.component';
import SpyObj = jasmine.SpyObj;

describe('LoginPageComponent', () => {
    let component: LoginPageComponent;
    let fixture: ComponentFixture<LoginPageComponent>;
    let router: Router;
    let loginServiceSpy: SpyObj<LoginFormService>;

    beforeEach(async () => {
        loginServiceSpy = jasmine.createSpyObj('LoginFormService', ['setFormData', 'getGameType', 'getLimitedTimeGame']);
        await TestBed.configureTestingModule({
            declarations: [LoginPageComponent],
            imports: [RouterTestingModule],
            providers: [{ provide: LoginFormService, useValue: loginServiceSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.inject(Router);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('goToGameSelection should navigate to selection Page', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.goToGameSelection();
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/gameSelection']);
    });

    it('onClickSubmit should set username and call setFormData', () => {
        const name = 'TestName';
        component.onClickSubmit(name);
        expect(component.username).toEqual(name);
        expect(loginServiceSpy.setFormData).toHaveBeenCalledWith(name);
    });

    it('goToGamePage should show an alert if the input is invalid', () => {
        const alertSpy = spyOn(window, 'alert');
        component.goToGamePage();
        expect(alertSpy).toHaveBeenCalledWith('Nom de joueur invalide: entrez un nom non vide');
    });

    it('goToGamePage should call onClickSubmit and navigate to soloView if input is valid and game type is false', () => {
        const name = 'TestName';
        const input = document.createElement('input');
        input.id = 'username';
        input.value = name;
        spyOn(document, 'getElementById').and.returnValue(input);
        spyOn(component, 'onClickSubmit');
        loginServiceSpy.getGameType.and.returnValue(false);
        const routerSpy = spyOn(router, 'navigate');
        component.goToGamePage();
        expect(component.onClickSubmit).toHaveBeenCalledWith(name);
        expect(routerSpy).toHaveBeenCalledWith(['/soloView']);
    });

    it('goToGamePage should call onClickSubmit and navigate to salleAttente if limitedTimeGame is true ans game time is true', () => {
        const name = 'TestName';
        const input = document.createElement('input');
        input.id = 'username';
        input.value = name;
        spyOn(document, 'getElementById').and.returnValue(input);
        spyOn(component, 'onClickSubmit');
        loginServiceSpy.getGameType.and.returnValue(true);
        loginServiceSpy.getLimitedTimeGame.and.returnValue(true);
        const routerSpy = spyOn(router, 'navigate');
        component.goToGamePage();
        expect(component.onClickSubmit).toHaveBeenCalledWith(name);
        expect(routerSpy).toHaveBeenCalledWith(['/salleAttente']);
    });

    it('goToGamePage should call onClickSubmit and navigate to SoloLimitedTime if limitedTimeGame is true ans game time is false', () => {
        const name = 'TestName';
        const input = document.createElement('input');
        input.id = 'username';
        input.value = name;
        spyOn(document, 'getElementById').and.returnValue(input);
        spyOn(component, 'onClickSubmit');
        loginServiceSpy.getGameType.and.returnValue(false);
        loginServiceSpy.getLimitedTimeGame.and.returnValue(true);
        const routerSpy = spyOn(router, 'navigate');
        component.goToGamePage();
        expect(component.onClickSubmit).toHaveBeenCalledWith(name);
        expect(routerSpy).toHaveBeenCalledWith(['/soloLimitedTime']);
    });

    it('goToGamePage should call onClickSubmit and navigate to salleAttente if input is valid and game type is true', () => {
        const name = 'TestName';
        const input = document.createElement('input');
        input.id = 'username';
        input.value = name;
        spyOn(document, 'getElementById').and.returnValue(input);
        spyOn(component, 'onClickSubmit');
        loginServiceSpy.getGameType.and.returnValue(true);
        const routerSpy = spyOn(router, 'navigate');
        component.goToGamePage();
        expect(component.onClickSubmit).toHaveBeenCalledWith(name);
        expect(routerSpy).toHaveBeenCalledWith(['/salleAttente']);
    });

    it('validateUsername should return false if name is an empty string', () => {
        expect(component.validateUsername('')).toBe(false);
    });

    it('validateUsername should return false if name contains only whitespace characters', () => {
        expect(component.validateUsername('   ')).toBe(false);
    });

    it('validateUsername should return true if name contains non-whitespace characters', () => {
        expect(component.validateUsername('PlayerName')).toBe(true);
    });
});
