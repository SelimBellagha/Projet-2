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
        loginServiceSpy = jasmine.createSpyObj('LoginFormService', ['setFormData']);
        await TestBed.configureTestingModule({
            declarations: [LoginPageComponent],
            imports: [RouterTestingModule],
            providers: [{ provide: LoginFormService, useValue: loginServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
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

    it('goToGamePage should set the username if input valid and navigate to the game page', () => {
        const name = 'TestName';
        const input = document.createElement('input');
        input.id = 'username';
        input.value = name;
        spyOn(document, 'getElementById').and.returnValue(input);
        const routerSpy = spyOn(router, 'navigate');
        component.goToGamePage();
        expect(component.username).toEqual(name);
        expect(loginServiceSpy.setFormData).toHaveBeenCalledWith(name);
        expect(routerSpy).toHaveBeenCalledWith(['/soloView']);
    });
});
