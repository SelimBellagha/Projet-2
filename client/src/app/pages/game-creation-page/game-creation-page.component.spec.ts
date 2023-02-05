import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasManagerService } from '@app/services/canvas-manager.service';
import { GameCreationPageComponent } from './game-creation-page.component';
import SpyObj = jasmine.SpyObj;

describe('GameCreationPageComponent', () => {
    let component: GameCreationPageComponent;
    let fixture: ComponentFixture<GameCreationPageComponent>;
    let canvasManagerServiceSpy: SpyObj<CanvasManagerService>;

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
            imports: [RouterTestingModule],
            providers: [{ provide: CanvasManagerService, useValue: canvasManagerServiceSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCreationPageComponent);
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
    /*
    it('clicking on launchValidation button should call launchVerification in the service', () => {
        component.onValidationLaunched();
        expect(canvasManagerServiceSpy.launchVerification).toHaveBeenCalled();
    });*/

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
});
