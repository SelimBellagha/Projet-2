import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GameManagerService } from '@app/services/game-manager.service';
import { CheatComponent } from './cheat.component';
import SpyObj = jasmine.SpyObj;

describe('CheatComponent', () => {
    let component: CheatComponent;
    let fixture: ComponentFixture<CheatComponent>;
    let gameManagerSpy: SpyObj<GameManagerService>;

    beforeEach(async () => {
        gameManagerSpy = jasmine.createSpyObj('GameManager', ['stateChanger', 'flashPixelsCheat']);

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [CheatComponent],
            providers: [{ provide: GameManagerService, useValue: gameManagerSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(CheatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle the toggle property and change the status', () => {
        const giveHintSpy = spyOn(component, 'giveHint');
        // gameManagerSpy.state = false;
        component.onClick();
        expect(component.toggle).toBe(true);
        expect(component.status).toBe('Enable Cheat');
        expect(giveHintSpy).toHaveBeenCalled();
        expect(gameManagerSpy.stateChanger).toHaveBeenCalled();

        component.onClick();
        expect(component.toggle).toBe(false);
        expect(component.status).toBe('Disable Cheat');
        expect(giveHintSpy).toHaveBeenCalled();
        expect(gameManagerSpy.stateChanger).toHaveBeenCalled();
    });

    it('should call flashPixelsCheat method with correct parameters when toggle is true', () => {
        component.toggle = true;
        component.giveHint();
        expect(gameManagerSpy.flashPixelsCheat).toHaveBeenCalledTimes(2);
        expect(gameManagerSpy.flashPixelsCheat).toHaveBeenCalledWith(gameManagerSpy.gameData.differences, gameManagerSpy.modifiedImageCanvas);
        expect(gameManagerSpy.flashPixelsCheat).toHaveBeenCalledWith(gameManagerSpy.gameData.differences, gameManagerSpy.originalImageCanvas);
    });

    it('should not call flashPixelsCheat method when toggle is false', () => {
        component.toggle = false;
        component.giveHint();
        expect(gameManagerSpy.flashPixelsCheat).not.toHaveBeenCalled();
    });

    it('should call onClick when "t" or "T" is pressed', () => {
        spyOn(component, 'onClick');

        const event = new KeyboardEvent('keyup', { key: 'T' });
        component.onKeyUp(event);
        expect(component.onClick).toHaveBeenCalled();

        const event2 = new KeyboardEvent('keyup', { key: 't' });
        component.onKeyUp(event2);
        expect(component.onClick).toHaveBeenCalled();
    });

    it('should not call onClick when another key is pressed', () => {
        spyOn(component, 'onClick');

        const event = new KeyboardEvent('keyup', { key: 'A' });
        component.onKeyUp(event);
        expect(component.onClick).not.toHaveBeenCalled();
    });

    it('should return the value of toggle', () => {
        component.toggle = true;
        expect(component.getToggle()).toBe(true);

        component.toggle = false;
        expect(component.getToggle()).toBe(false);
    });
});
