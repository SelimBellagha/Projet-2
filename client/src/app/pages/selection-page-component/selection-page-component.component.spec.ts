import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectionPageComponentComponent } from './selection-page-component.component';
import SpyObj = jasmine.SpyObj;

describe('SelectionPageComponentComponent', () => {
    let component: SelectionPageComponentComponent;
    let fixture: ComponentFixture<SelectionPageComponentComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectionPageComponentComponent],
            imports: [RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectionPageComponentComponent);
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

    it(' clicking on acceuil button should navigate to home Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToHomePage();
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/home']);
    });

    it(' clicking on acceuil button should navigate to home Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToHomePage();
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/loginPage']);
    });

    it('clicking on suivant should call next()', () => {
        const nextinput: HTMLInputElement = document.getElementById('previousInput') as HTMLInputElement;
        nextinput?.click();
        expect(component.next).toHaveBeenCalled();
    });

    it('clicking on previous should call previous()', () => {
        const previousinput: HTMLInputElement = document.getElementById('previousInput') as HTMLInputElement;
        previousinput?.click();
        expect(component.previous).toHaveBeenCalled();
    });
});
