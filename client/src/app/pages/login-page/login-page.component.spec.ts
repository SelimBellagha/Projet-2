import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
    let component: LoginPageComponent;
    let fixture: ComponentFixture<LoginPageComponent>;
    // let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoginPageComponent],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginPageComponent);
        // router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it(' clicking on Continuer should call on goToGamePage ', () => {
        fixture.detectChanges();
        const submitSpy = spyOn(component, 'goToGamePage');
        component.username = 'test';
        const submit: HTMLInputElement = document.getElementById('submit') as HTMLInputElement;
        submit?.click();
        expect(submitSpy).toHaveBeenCalled();
    });
    it(' clicking on submit button should call Submit ', () => {
        fixture.detectChanges();
        component.username = 'test';
        const submit: HTMLInputElement = document.getElementById('submit') as HTMLInputElement;
        submit?.click();
        // const clickSpy = spyOn(component, 'onClickSubmit');
        const submitSpy = spyOn(component, 'onClickSubmit');

        component.onClickSubmit('test');
        expect(submitSpy).toHaveBeenCalled();
    });

    it('clicking on return should go back to game selection', () => {
        fixture.detectChanges();
        const returnSpy = spyOn(component, 'goToGameSelection');
        const return1: HTMLInputElement = document.getElementById('return') as HTMLInputElement;
        return1?.click();
        expect(returnSpy).toHaveBeenCalled();
    });
});
