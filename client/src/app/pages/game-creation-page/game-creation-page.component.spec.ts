import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { GameData } from '@app/interfaces/game.interface';
import { CanvasManagerService } from '@app/services/canvas-manager.service';
import { CommunicationService } from '@app/services/communication.service';
import { GameCreationPageComponent, Tool } from './game-creation-page.component';
import SpyObj = jasmine.SpyObj;

describe('GameCreationPageComponent', () => {
    let component: GameCreationPageComponent;
    let fixture: ComponentFixture<GameCreationPageComponent>;
    let canvasManagerServiceSpy: SpyObj<CanvasManagerService>;
    let communicationSpy: SpyObj<CommunicationService>;
    let router: Router;

    beforeEach(async () => {
        canvasManagerServiceSpy = jasmine.createSpyObj('CanvasManagerService', [
            'resetBackground',
            'launchVerification',
            'changeBackgrounds',
            'init',
            'setTool',
            'swapForegrounds',
            'duplicate',
            'resetForeground',
            'undoAction',
            'redoAction',
            'setWidth',
            'setColor',
            'onMouseUp',
            'onMouseDown',
            'onMouseMove',
            'enableSquare',
        ]);
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['addNewGame']);

        await TestBed.configureTestingModule({
            declarations: [GameCreationPageComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: CanvasManagerService, useValue: canvasManagerServiceSpy },
                { provide: CommunicationService, useValue: communicationSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCreationPageComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('clicking on left reset background button should call resetBackground from canvasManager', () => {
        component.resetBackground(true);
        expect(canvasManagerServiceSpy.resetBackground).toHaveBeenCalledOnceWith(true);
    });

    it('clicking on right reset background button should call resetBackground from canvasManager', () => {
        component.resetBackground(false);
        expect(canvasManagerServiceSpy.resetBackground).toHaveBeenCalledOnceWith(false);
    });

    it('clicking on launchValidation button should call launchVerification in the service', () => {
        canvasManagerServiceSpy.launchVerification.and.resolveTo({ originalImage: '', modifiedImage: '' } as GameData);
        component.onValidationLaunched();
        expect(canvasManagerServiceSpy.launchVerification).toHaveBeenCalled();
    });

    it('updating the file input for the right image should call changeBackgrounds from canvasManager', () => {
        const input: HTMLInputElement = document.getElementById('rightImageInput') as HTMLInputElement;
        input.dispatchEvent(new Event('input'));
        expect(canvasManagerServiceSpy.changeBackgrounds).toHaveBeenCalled();
    });
    it('updating the file input for the left image should call changeBackgrounds from canvasManager', () => {
        const input: HTMLInputElement = document.getElementById('leftImageInput') as HTMLInputElement;
        input.dispatchEvent(new Event('input'));
        expect(canvasManagerServiceSpy.changeBackgrounds).toHaveBeenCalled();
    });
    it('updating the file input for the right image should call changeBackgrounds from canvasManager', () => {
        const input: HTMLInputElement = document.getElementById('middleImageInput') as HTMLInputElement;
        input.dispatchEvent(new Event('input'));
        expect(canvasManagerServiceSpy.changeBackgrounds).toHaveBeenCalled();
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
        const inputMock = { value: 'ValidName' } as HTMLInputElement;
        const spy = spyOn(component, 'goToConfiguration');
        component.currentGameData = { name: 'mock' } as GameData;
        component.onSave(inputMock);
        expect(spy).toHaveBeenCalled();
    });

    it('onSave should call addNewGame from communicationService  if name is valid', () => {
        const inputMock = { value: 'ValidName' } as HTMLInputElement;
        component.currentGameData = { name: 'mock' } as GameData;
        spyOn(component, 'goToConfiguration');
        component.onSave(inputMock);
        expect(communicationSpy.addNewGame).toHaveBeenCalled();
    });

    it('onSave should not go to configuration page if name is invalid', () => {
        const inputMock = { value: '' } as HTMLInputElement;
        const spy = spyOn(component, 'goToConfiguration');
        component.onSave(inputMock);
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it(' clicking on return button should navigate to configuration Page', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.goToConfiguration();
        expect(routerSpy).toHaveBeenCalled();
    });
    it('changeTool should call setTool from canvasManager ', () => {
        component.changeTool(Tool.Eraser);
        expect(canvasManagerServiceSpy.setTool).toHaveBeenCalled();
    });

    it('onSwap should call swapForegrounds from canvasManager ', () => {
        component.onSwap();
        expect(canvasManagerServiceSpy.swapForegrounds).toHaveBeenCalled();
    });
    it(' onDuplicate should call duplicate from canvasManager with left set to true if parameter leftImage is true', () => {
        component.onDuplicate(true);
        expect(canvasManagerServiceSpy.duplicate).toHaveBeenCalledWith(true);
    });
    it(' onDuplicate should call duplicate from canvasManagerwith left set to false if parameter leftImage is false', () => {
        component.onDuplicate(false);
        expect(canvasManagerServiceSpy.duplicate).toHaveBeenCalledWith(false);
    });
    it(' onResetForeground should call resetleftForeground from canvasManager if parameter leftImage is true', () => {
        component.onResetForeground(true);
        expect(canvasManagerServiceSpy.resetForeground).toHaveBeenCalledWith(true);
    });
    it(' onResetForeground should call resetRightForeground from canvasManager if parameter leftImage is false', () => {
        component.onResetForeground(false);
        expect(canvasManagerServiceSpy.resetForeground).toHaveBeenCalledOnceWith(false);
    });
    it('onUndo should call undoAction from canvasManager ', () => {
        component.onUndo();
        expect(canvasManagerServiceSpy.undoAction).toHaveBeenCalled();
    });
    it(' onRedo should call redoAction from canvasManager', () => {
        component.onRedo();
        expect(canvasManagerServiceSpy.redoAction).toHaveBeenCalled();
    });
    it(' onSetWidth should call setWwidth from canvasManager', () => {
        component.onSetWidth('1');
        expect(canvasManagerServiceSpy.setWidth).toHaveBeenCalled();
    });
    it('onChangeColor should call setColor from canvasManager ', () => {
        component.onChangeColor('red');
        expect(canvasManagerServiceSpy.setColor).toHaveBeenCalled();
    });
    it('onMouseDown should call onMouseDown from canvasManager if button pressed is left button ', () => {
        const eventMock = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        component.onMouseDown(eventMock, true);
        expect(canvasManagerServiceSpy.onMouseDown).toHaveBeenCalled();
    });
    it('onMouseDown should not call onMouseDown from canvasManager if button pressed is not left button ', () => {
        const eventMock = { button: MouseButton.Right, offsetX: 0, offsetY: 0 } as MouseEvent;
        component.onMouseDown(eventMock, true);
        expect(canvasManagerServiceSpy.onMouseDown).toHaveBeenCalledTimes(0);
    });
    it('onMouseMove should call onMouseMove from canvasManager', () => {
        const eventMock = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        component.onMouseMove(eventMock, true);
        expect(canvasManagerServiceSpy.onMouseMove).toHaveBeenCalled();
    });
    it('onMouseUp should call onMouseUp from canvasManager if button unpressed is left button ', () => {
        const eventMock = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        component.onMouseUp(eventMock, true);
        expect(canvasManagerServiceSpy.onMouseUp).toHaveBeenCalled();
    });
    it('onMouseUp should not call onMouseUp from canvasManager if button unpressed is not left button ', () => {
        const eventMock = { button: MouseButton.Right, offsetX: 0, offsetY: 0 } as MouseEvent;
        component.onMouseUp(eventMock, true);
        expect(canvasManagerServiceSpy.onMouseUp).toHaveBeenCalledTimes(0);
    });
    it('handleKeyDown should call enableSquare if key pressed is ShiftRight or ShiftLeft', () => {
        const buttonEventMock = {
            code: 'ShiftRight',
        } as KeyboardEvent;
        component.handleKeyDown(buttonEventMock);
        expect(canvasManagerServiceSpy.enableSquare).toHaveBeenCalled();
        const buttonEventMock2 = {
            code: 'ShiftLeft',
        } as KeyboardEvent;
        component.handleKeyDown(buttonEventMock2);
        expect(canvasManagerServiceSpy.enableSquare).toHaveBeenCalledTimes(2);
    });

    it('handleKeyUp should call enableSquare if key pressed is ShiftRight or ShiftLeft', () => {
        const buttonEventMock = {
            code: 'ShiftRight',
        } as KeyboardEvent;
        component.handleKeyUp(buttonEventMock);
        expect(canvasManagerServiceSpy.enableSquare).toHaveBeenCalled();
        const buttonEventMock2 = {
            code: 'ShiftLeft',
        } as KeyboardEvent;
        component.handleKeyUp(buttonEventMock2);
        expect(canvasManagerServiceSpy.enableSquare).toHaveBeenCalledTimes(2);
    });

    it('handleKeyDown should set isControlPressed to true if key pressed is ControlRight or ControlLeft', () => {
        const buttonEventMock = {
            code: 'ControlRight',
        } as KeyboardEvent;
        component.handleKeyDown(buttonEventMock);
        expect(component.inputsStates.isControlPressed).toBeTrue();
        component.inputsStates.isControlPressed = false;
        const buttonEventMock2 = {
            code: 'ControlLeft',
        } as KeyboardEvent;
        component.handleKeyDown(buttonEventMock2);
        expect(component.inputsStates.isControlPressed).toBeTrue();
    });
    it('handleKeyUp should set isControlPressed to false if key pressed is ControlRight or ControlLeft', () => {
        component.inputsStates.isControlPressed = true;
        const buttonEventMock = {
            code: 'ControlRight',
        } as KeyboardEvent;
        component.handleKeyUp(buttonEventMock);
        expect(component.inputsStates.isControlPressed).toBeFalse();
        component.inputsStates.isControlPressed = true;
        const buttonEventMock2 = {
            code: 'ControlLeft',
        } as KeyboardEvent;
        component.handleKeyUp(buttonEventMock2);
        expect(component.inputsStates.isControlPressed).toBeFalse();
    });
    it('handleKeyDown should call enableSquare if key pressed is ShiftRight or ShiftLeft', () => {
        const buttonEventMock = {
            code: 'ShiftRight',
        } as KeyboardEvent;
        component.handleKeyDown(buttonEventMock);
        expect(canvasManagerServiceSpy.enableSquare).toHaveBeenCalled();
        const buttonEventMock2 = {
            code: 'ShiftLeft',
        } as KeyboardEvent;
        component.handleKeyDown(buttonEventMock2);
        expect(canvasManagerServiceSpy.enableSquare).toHaveBeenCalledTimes(2);
    });
    it('handleKeyDown should call redoAction if key pressed is Z and Control and Shift are pressed', () => {
        const buttonEventMock = {
            code: 'KeyZ',
        } as KeyboardEvent;
        component.inputsStates.isControlPressed = true;
        component.inputsStates.isShiftPressed = true;
        component.handleKeyDown(buttonEventMock);
        expect(canvasManagerServiceSpy.redoAction).toHaveBeenCalled();
    });
    it('handleKeyDown should call undoAction if key pressed is Z and Control is pressed but Shift isnt', () => {
        const buttonEventMock = {
            code: 'KeyZ',
        } as KeyboardEvent;
        component.inputsStates.isControlPressed = true;
        component.inputsStates.isShiftPressed = false;
        component.handleKeyDown(buttonEventMock);
        expect(canvasManagerServiceSpy.undoAction).toHaveBeenCalled();
    });
    it('handleKeyDown should call nothing if key pressed is Z but Control and Shift arent pressed', () => {
        const buttonEventMock = {
            code: 'KeyZ',
        } as KeyboardEvent;
        component.inputsStates.isControlPressed = false;
        component.inputsStates.isShiftPressed = false;
        component.handleKeyDown(buttonEventMock);
        expect(canvasManagerServiceSpy.undoAction).toHaveBeenCalledTimes(0);
        expect(canvasManagerServiceSpy.redoAction).toHaveBeenCalledTimes(0);
    });
});
