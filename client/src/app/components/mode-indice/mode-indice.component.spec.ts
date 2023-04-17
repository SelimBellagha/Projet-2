import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameData } from '@app/interfaces/game.interface';
import { Vec2 } from '@app/interfaces/vec2';
import { GameManagerService } from '@app/services/game-manager.service';
import { ModeIndiceComponent } from './mode-indice.component';

describe('ModeIndiceComponent', () => {
    let component: ModeIndiceComponent;
    let fixture: ComponentFixture<ModeIndiceComponent>;
    let gameManagerService: jasmine.SpyObj<GameManagerService>;

    beforeEach(async () => {
        const gameManagerSpy = jasmine.createSpyObj('GameManagerService', [
            'sendHintMessage',
            'hintStateChanger',
            'timePenalty',
            'giveHint3',
            'drawLine',
            'drawLine2',
        ]);
        gameManagerSpy.gameData = {
            nbDifferences: 3,
            differences: [
                [
                    { x: 10, y: 20 },
                    { x: 30, y: 40 },
                ],
                [
                    { x: 50, y: 60 },
                    { x: 70, y: 80 },
                ],
                [
                    { x: 90, y: 100 },
                    { x: 110, y: 120 },
                ],
            ],
            hintState: true,
            gameTime: 0,
        };
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [ModeIndiceComponent],
            providers: [{ provide: GameManagerService, useValue: gameManagerSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(ModeIndiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        // gameManagerService = TestBed.inject(GameManagerService) as jasmine.SpyObj<GameManagerService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('onClick', () => {
        // it('should send hint message and increment the counter when counter is less than 3', () => {
        //     // const mockSource = '../assets/tests/image_7_diff.bmp';
        //     gameManagerService.gameData.nbDifferences = 7;
        //     // gameManagerSpy.gameData = { originalImage: mockSource, modifiedImage: mockSource } as GameData;
        //     component.counter = 1;
        //     const expectedHint = component.hints[component.counter];
        //     component.onClick();
        //     expect(gameManagerService.sendHintMessage).toHaveBeenCalledWith(expectedHint);
        //     expect(gameManagerService.hintStateChanger).toHaveBeenCalled();
        //     expect(component.status).toEqual(expectedHint);
        //     expect(component.counter).toEqual(1);
        //     expect(gameManagerService.timePenalty).toHaveBeenCalled();
        // });

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

        it('should give hint 3 and set toggle to true when counter is 3', () => {
            component.counter = 2;
            const expectedCoordinate: Vec2 = { x: 1, y: 2 };
            spyOn(component, 'setUpCoordinates3').and.returnValue(expectedCoordinate);
            component.onClick();
            expect(component.toggle).toBeTrue();
            expect(gameManagerService.giveHint3).toHaveBeenCalledWith(expectedCoordinate);
        });

        it('should not change anything and show alert when counter is already at max', () => {
            component.counter = 3;
            spyOn(window, 'alert');
            component.onClick();
            expect(component.toggle).toBeFalse();
            expect(window.alert).toHaveBeenCalledWith('Nombre de indice maximum atteint');
        });
        describe('onKeyUp', () => {
            // it('should toggle the toggle property if the "i" or "I" key is pressed', () => {
            //     component.toggle = false;
            //     const keyboardEvent = new KeyboardEvent('keyup', { key: 'i' });
            //     spyOn(component, 'onClick');
            //     component.onKeyUp(keyboardEvent);
            //     expect(component.toggle).toBeTrue();
            //     expect(component.onClick).toHaveBeenCalled();
            //     spyOn(component, 'onClick');
            //     // // keyboardEvent = 'I';
            //     component.onKeyUp(keyboardEvent);
            //     expect(component.toggle).toBeFalse();
            //     expect(component.onClick).toHaveBeenCalled();
            // });

            it('should not toggle the toggle property if another key is pressed', () => {
                const keyboardEvent = new KeyboardEvent('keyup', { key: 'k' });
                spyOn(component, 'onClick');
                component.onKeyUp(keyboardEvent);
                expect(component.toggle).toBeFalse();
                expect(component.onClick).not.toHaveBeenCalled();
            });
        });

        // describe('setUpCoordinates', () => {
        //     it('should return the expected average coordinate', () => {
        //         const differences = [
        //             [
        //                 { x: 10, y: 20 },
        //                 { x: 30, y: 40 },
        //             ],
        //             [
        //                 { x: 50, y: 60 },
        //                 { x: 70, y: 80 },
        //                 { x: 90, y: 100 },
        //             ],
        //         ];
        //         const gameData = { nbDifferences: differences.length, differences };
        //         spyOn(component, 'getRandomNumber').and.returnValues(0, 1);
        //         // spyOn(gameManagerService.gameData, 'get').and.returnValue(gameData);
        //         const result = component.setUpCoordinates();
        //         expect(result).toEqual({ x: 20, y: 30 });
        //     });
        // });

        // describe('setUpCoordinates3', () => {
        //     it('should return the expected central coordinate', () => {
        //         const differences = [
        //             [
        //                 { x: 10, y: 20 },
        //                 { x: 30, y: 40 },
        //             ],
        //             [
        //                 { x: 50, y: 60 },
        //                 { x: 70, y: 80 },
        //                 { x: 90, y: 100 },
        //             ],
        //         ];
        //         const gameData = { nbDifferences: differences.length, differences };
        //         spyOn(component, 'getRandomNumber').and.returnValues(0, 1);
        //         spyOn(gameManagerService.gameData, 'get').and.returnValue(gameData);
        //         const result = component.setUpCoordinates3();
        //         expect(result).toEqual({ x: 30, y: 40 });
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
            gameManagerService.gameData = { nbDifferences: 1 } as GameData;
            component.onClick();
            expect(gameManagerService.sendHintMessage).toHaveBeenCalledWith('Indice 1 utilisé');
        });

        it('should set toggle to true', () => {
            component.onClick();
            expect(component.toggle).toBeTrue();
        });

        it('should call hintStateChanger', () => {
            gameManagerService.hintState = true;
            component.onClick();
            expect(gameManagerService.hintStateChanger).toHaveBeenCalled();
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
            expect(gameManagerService.timePenalty).toHaveBeenCalled();
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
});
