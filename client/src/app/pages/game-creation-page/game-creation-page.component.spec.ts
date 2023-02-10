import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasManagerService } from '@app/services/canvas-manager.service';
import { GameCreationPageComponent } from './game-creation-page.component';
import SpyObj = jasmine.SpyObj;

describe('GameCreationPageComponent', () => {
    let component: GameCreationPageComponent;
    let fixture: ComponentFixture<GameCreationPageComponent>;
    let canvasManagerServiceSpy: SpyObj<CanvasManagerService>;
    let router: Router;

    beforeEach(async () => {
        canvasManagerServiceSpy = jasmine.createSpyObj('CanvasManagerService', [
            'resetLeftBackground',
            'resetRightBackground',
            'launchVerification',
            'changeRightBackground',
            'changeLeftBackground',
            'changeBothBackgrounds',
        ]);

        await TestBed.configureTestingModule({
            declarations: [GameCreationPageComponent],
            imports: [RouterTestingModule.withRoutes([])],
            providers: [{ provide: CanvasManagerService, useValue: canvasManagerServiceSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCreationPageComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('clicking on left reset background button should call resetLeftBackground in the service', () => {
        component.resetBackground(true);
        expect(canvasManagerServiceSpy.resetLeftBackground).toHaveBeenCalled();
    });

    it('clicking on right reset background button should call resetRightBackground in the service', () => {
        component.resetBackground(false);
        expect(canvasManagerServiceSpy.resetRightBackground).toHaveBeenCalled();
    });

    it('clicking on launchValidation button should call launchVerification in the service', () => {
        canvasManagerServiceSpy.launchVerification.and.resolveTo();
        component.onValidationLaunched();
        expect(canvasManagerServiceSpy.launchVerification).toHaveBeenCalled();
    });

    it('updating the file input for the right image should call changeRightBackground from service', () => {
        const input: HTMLInputElement = document.getElementById('rightImageInput') as HTMLInputElement;
        input.dispatchEvent(new Event('change'));
        expect(canvasManagerServiceSpy.changeRightBackground).toHaveBeenCalled();
    });
    it('updating the file input for the left image should call changeLeftBackground from service', () => {
        const input: HTMLInputElement = document.getElementById('leftImageInput') as HTMLInputElement;
        input.dispatchEvent(new Event('change'));
        expect(canvasManagerServiceSpy.changeLeftBackground).toHaveBeenCalled();
    });
    it('updating the file input for the right image should call changeRightBackground from service', () => {
        const input: HTMLInputElement = document.getElementById('middleImageInput') as HTMLInputElement;
        input.dispatchEvent(new Event('change'));
        expect(canvasManagerServiceSpy.changeBothBackgrounds).toHaveBeenCalled();
    });

    it('onClosingPopUp should hide the popUp window', () => {
        const popUp = component.popUpWindow;
        popUp.nativeElement.style.display = 'block';
        component.onClosingPopUp();
        expect(popUp.nativeElement.style.display).toEqual('none');
    });

    it('default radius value should be 3', () => {
        expect(component.radius).toEqual(3);
    });
    /* eslint-disable @typescript-eslint/no-magic-numbers -- */
    it('clicking on a radius button should change the radius', () => {
        const input0 = document.getElementById('radius-input-0');
        const input3 = document.getElementById('radius-input-3');
        const input9 = document.getElementById('radius-input-9');
        const input15 = document.getElementById('radius-input-15');

        input0?.click();
        expect(component.radius).toEqual(0);
        input3?.click();
        expect(component.radius).toEqual(3);
        input9?.click();
        expect(component.radius).toEqual(9);
        input15?.click();
        expect(component.radius).toEqual(15);
    });

    it('onSave should go to configuration page if name is valid', () => {
        const input: HTMLInputElement = document.getElementById('gameName') as HTMLInputElement;
        input.value = 'validName';
        const spy = spyOn(component, 'goToConfiguration');
        component.onSave(input);
        expect(spy).toHaveBeenCalled();
    });

    it('onSave should not go to configuration page if name is invalid', () => {
        const input: HTMLInputElement = document.getElementById('gameName') as HTMLInputElement;
        input.value = '';
        const spy = spyOn(component, 'goToConfiguration');
        component.onSave(input);
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it(' clicking on return button should navigate to configuration Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToConfiguration();
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/gameConfiguration']);
    });
});
