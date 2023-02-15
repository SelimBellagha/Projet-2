import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectionPageComponentComponent } from './selection-page-component.component';

describe('SelectionPageComponentComponent', () => {
    let component: SelectionPageComponentComponent;
    let fixture: ComponentFixture<SelectionPageComponentComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectionPageComponentComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
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

    /*
    it('clicking on suivant should call next()', () => {
        component.hasNext = true;
        // component.hasprevious = true;
        const nextSpy = spyOn(component, 'next');
        const nextInput: HTMLInputElement = document.getElementById('nextInput') as HTMLInputElement;
        nextInput?.click();
        expect(nextSpy).toHaveBeenCalled();
    });

    it('clicking on previous should call previous()', () => {
        component.hasNext = false;
        fixture.detectChanges();
        // eslint-disable-next-line no-console
        const previousInput: HTMLInputElement = document.getElementById('previousInput') as HTMLInputElement;
        const previousSpy = spyOn(component, 'previous');
        previousInput?.click();
        expect(previousSpy).toHaveBeenCalled();
    });*/
});
