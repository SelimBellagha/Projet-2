import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameData } from '@app/interfaces/game-data';
import { Vec2 } from '@app/interfaces/vec2';
import { GameManagerService } from '@app/services/game-manager.service';
import { ModeIndiceComponent } from './mode-indice.component';

describe('ModeIndiceComponent', () => {
    let component: ModeIndiceComponent;
    let fixture: ComponentFixture<ModeIndiceComponent>;
    let gameManagerSpy: jasmine.SpyObj<GameManagerService>;
    const a: Vec2 = { x: 0, y: 240 };

    beforeEach(async () => {
        gameManagerSpy = jasmine.createSpyObj(
            'GameManagerService',
            ['sendHintMessage', 'hintStateChanger', 'timePenalty', 'giveHint3', 'drawLine', 'drawLine2'],
            { gameData: { nbDifferences: 1, differences: [[a]] } as GameData },
        );
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [ModeIndiceComponent],
            providers: [{ provide: GameManagerService, useValue: gameManagerSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(ModeIndiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('onClick', () => {
        it('should find cadran 1 and set toggle to true when counter is 1', () => {
            component.counter = 0;
            const expectedCoordinate: Vec2 = { x: 1, y: 2 };
            spyOn(component, 'setUpCoordinates').and.returnValue(expectedCoordinate);
            spyOn(component, 'findCadran1').and.returnValue(1);
            component.onClick();
            expect(component.toggle).toBeTrue();
            expect(component.findCadran1).toHaveBeenCalledWith(expectedCoordinate);
        });

        it('should find cadran 2 and set toggle to true when counter is 2', () => {
            component.counter = 1;
            const expectedCoordinate: Vec2 = { x: 1, y: 2 };
            spyOn(component, 'setUpCoordinates').and.returnValue(expectedCoordinate);
            spyOn(component, 'findCadran2').and.returnValue(1);
            component.onClick();
            expect(component.toggle).toBeTrue();
            expect(component.findCadran2).toHaveBeenCalledWith(expectedCoordinate);
        });

        // it('should give hint 3 and set toggle to true when counter is 3', () => {
        //     component.counter = 2;
        //     const expectedCoordinate: Vec2 = { x: 1, y: 2 };
        //     spyOn(component, 'setUpCoordinates3').and.returnValue(expectedCoordinate);
        //     component.onClick();
        //     expect(component.toggle).toBeTrue();
        //     expect(gameManagerSpy.giveHint3).toHaveBeenCalledWith(expectedCoordinate);
        // });

        it('should not change anything and show alert when counter is already at max', () => {
            component.counter = 3;
            spyOn(window, 'alert');
            component.onClick();
            expect(component.toggle).toBeFalse();
            expect(window.alert).toHaveBeenCalledWith('Nombre de indice maximum atteint');
        });

        it('should not toggle the toggle property if another key is pressed', () => {
            const keyboardEvent = new KeyboardEvent('keyup', { key: 'k' });
            spyOn(component, 'onClick');
            component.onKeyUp(keyboardEvent);
            expect(component.toggle).toBeFalse();
            expect(component.onClick).not.toHaveBeenCalled();
        });

        describe('setUpCoordinates', () => {
            it('should return the expected average coordinate', () => {
                spyOn(component, 'getRandomNumber').and.returnValues(0, 1);
                const result = component.setUpCoordinates();
                expect(result).toEqual(a);
            });
        });

        // describe('setUpCoordinates3', () => {
        //     it('should return the expected central coordinate', () => {
        //         spyOn(component, 'getRandomNumber').and.returnValues(0, 1);
        //         const result = component.setUpCoordinates3();
        //         expect(result).toEqual(a);
        //     });
        // });
    });
    describe('onKeyUp', () => {
        it('should call onClick when the "i" key is pressed', () => {
            spyOn(component, 'onClick');
            const event = new KeyboardEvent('keyup', { key: 'i' });
            document.dispatchEvent(event);
            expect(component.onClick).toHaveBeenCalled();
        });

        it('should not call onClick when a different key is pressed', () => {
            spyOn(component, 'onClick');
            const event = new KeyboardEvent('keyup', { key: 'a' });
            document.dispatchEvent(event);
            expect(component.onClick).not.toHaveBeenCalled();
        });
    });

    describe('onClick', () => {
        beforeEach(() => {
            component.counter = 0;
            component.toggle = false;
            component.status = '3 Indices Inactive';
            component.result = { x: 0, y: 0 };
        });

        it('should call sendHintMessage with the correct message', () => {
            component.toggle = true;
            gameManagerSpy.gameData = {} as GameData;
            component.counter = 0;
            component.onClick();
            expect(gameManagerSpy.sendHintMessage).toHaveBeenCalledWith('Indice 1 utilisé');
        });

        it('should set toggle to true', () => {
            const mockSource = '../assets/tests/image_7_diff.bmp';
            component.toggle = true;
            gameManagerSpy.gameData = {
                originalImage: mockSource,
                modifiedImage: mockSource,
                nbDifferences: 0,
            } as GameData;
            component.counter = 0;
            component.onClick();
            expect(component.toggle).toBeTrue();
        });

        it('should call hintStateChanger', () => {
            component.onClick();
            expect(gameManagerSpy.hintStateChanger).toHaveBeenCalled();
        });

        it('should set status to the current hint message', () => {
            component.onClick();
            expect(component.status).toBe('Indice 1 utilisé');
        });

        it('should increment the counter', () => {
            component.onClick();
            expect(component.counter).toBe(1);
        });

        it('should call timePenalty', () => {
            component.onClick();
            expect(gameManagerSpy.timePenalty).toHaveBeenCalled();
        });

        it('should call findCadran1 when counter is 0', () => {
            spyOn(component, 'findCadran1');
            component.onClick();
            expect(component.findCadran1).toHaveBeenCalled();
        });

        it('should call findCadran2 when counter is 1', () => {
            spyOn(component, 'findCadran2');
            component.counter = 1;
            component.onClick();
            expect(component.findCadran2).toHaveBeenCalled();
        });
    });

    it('should return the correct cadran number', () => {
        const coordinate: Vec2 = { x: 2, y: 3 };
        const result = component.findCadran2(coordinate);
        expect(result).toBe(1);
    });
    it('should draw the correct lines for cadran 1', () => {
        const coordinate: Vec2 = { x: 1, y: 1 };
        component.findCadran1(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.a, component.centre);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.c, component.centre);
    });
    it('should draw the correct lines for cadran 2', () => {
        const coordinate: Vec2 = { x: 400, y: 130 };
        component.findCadran1(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.b, component.centre);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.c, component.centre);
    });
    it('should draw the correct lines for cadran 3', () => {
        const coordinate: Vec2 = { x: 10, y: 400 };
        component.findCadran1(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.a, component.centre);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.d, component.centre);
    });
    it('should draw the correct lines for cadran 4', () => {
        const coordinate: Vec2 = { x: 400, y: 460 };
        component.findCadran1(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.b, component.centre);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.d, component.centre);
    });

    it('should draw the correct lines for cadran 1.2', () => {
        const coordinate: Vec2 = { x: 0, y: 130 };
        component.findCadran2(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.e, component.f);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.f, component.centre);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.centre, component.a);
    });

    it('should draw the correct lines for cadran 1.1', () => {
        const coordinate: Vec2 = { x: 5, y: 4 };
        component.findCadran2(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.e, component.f);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.f, component.c);
    });

    it('should draw the correct lines for cadran 2.1', () => {
        const coordinate: Vec2 = { x: 340, y: 1 };
        component.findCadran2(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.f, component.g);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.f, component.c);
    });
    it('should draw the correct lines for cadran 2.2', () => {
        const coordinate: Vec2 = { x: 340, y: 220 };
        component.findCadran2(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.f, component.g);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.f, component.centre);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.centre, component.b);
    });

    it('should draw the correct lines for cadran 3.1', () => {
        const coordinate: Vec2 = { x: 1, y: 350 };
        component.findCadran2(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.h, component.i);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.i, component.centre);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.centre, component.a);
    });

    xit('should draw the correct lines for cadran 3.2', () => {
        const coordinate: Vec2 = { x: 1, y: 365 };
        component.findCadran2(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.centre, component.i);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.i, component.h);
    });

    it('should draw the correct lines for cadran 4.1', () => {
        const coordinate: Vec2 = { x: 640, y: 350 };
        component.findCadran2(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.h, component.i);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.i, component.centre);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.centre, component.b);
    });

    it('should draw the correct lines for cadran 4.2', () => {
        const coordinate: Vec2 = { x: 640, y: 365 };
        component.findCadran2(coordinate);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.i, component.j);
        expect(gameManagerSpy.drawLine).toHaveBeenCalledWith(component.i, component.centre);
    });
    it('should not  execute onClick if game is in replay mode', () => {
        gameManagerSpy.replayMode = true;
        component.counter = 0;
        component.onClick();
        expect(gameManagerSpy.sendHintMessage).toHaveBeenCalledTimes(0);
    });
});
