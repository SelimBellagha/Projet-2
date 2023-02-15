import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigurationPageComponent } from './configuration-page.component';

describe('ConfigurationPageComponent', () => {
    let component: ConfigurationPageComponent;
    let fixture: ComponentFixture<ConfigurationPageComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConfigurationPageComponent],
            imports: [RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfigurationPageComponent);
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
        expect(routerSpy).toHaveBeenCalledWith(['/home']);
    });

    it('clicking on suivant should call next()', () => {
        component.hasnext = true;
        component.hasprevious = true;
        fixture.detectChanges();
        const nextSpy = spyOn(component, 'next');
        const nextInput: HTMLInputElement = document.getElementById('nextInput') as HTMLInputElement;
        nextInput?.click();
        expect(nextSpy).toHaveBeenCalled();
    });

    it('on config page clicking on previous should call previous()', () => {
        component.hasnext = true;
        component.hasprevious = true;
        fixture.detectChanges();
        const previousInput: HTMLInputElement = document.getElementById('previousInput') as HTMLInputElement;
        const previousSpy = spyOn(component, 'previous');
        previousInput?.click();
        expect(previousSpy).toHaveBeenCalled();
    });

    it(' clicking on Accéder à la Vue de création de jeu button should navigate to game creation Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToCreationPage();
        expect(routerSpy).toHaveBeenCalledWith(['/gameCreation']);
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
});
