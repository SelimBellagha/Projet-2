import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Constants } from '@common/constants';
import { ConstantsComponent } from './constants.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ConstantsComponent', () => {
    let component: ConstantsComponent;
    let fixture: ComponentFixture<ConstantsComponent>;
    let spyWindowAlert: jasmine.Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConstantsComponent],
            imports: [HttpClientTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(ConstantsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyWindowAlert = spyOn(window, 'alert');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('default() should call sendGameConstants()', () => {
        const spy = spyOn(component, 'sendConstants');
        component.default();
        expect(spy).toHaveBeenCalled();
    });

    it('verifyConstants() should return false and display an alert if initTime < 30', () => {
        const gameConstants: Constants = {
            initTime: 0,
            penaltyTime: 5,
            timeBonus: 5,
        };
        expect(component.verifyConstants(gameConstants)).toBeFalse();
        expect(spyWindowAlert).toHaveBeenCalled();
    });

    it('verifyConstants() should return false and display an alert if initTime > 120', () => {
        const gameConstants: Constants = {
            initTime: 150,
            penaltyTime: 5,
            timeBonus: 5,
        };
        expect(component.verifyConstants(gameConstants)).toBeFalse();
        expect(spyWindowAlert).toHaveBeenCalled();
    });

    it('verifyConstants() should return false and display an alert if 30 =< initTime && initTime =< 120', () => {
        const gameConstants: Constants = {
            initTime: 30,
            penaltyTime: 5,
            timeBonus: 5,
        };
        expect(component.verifyConstants(gameConstants)).toBeTrue();
    });

    it('verifyConstants() should return false and display an alert if penaltyTime > 15', () => {
        const gameConstants: Constants = {
            initTime: 30,
            penaltyTime: 30,
            timeBonus: 5,
        };
        expect(component.verifyConstants(gameConstants)).toBeFalse();
        expect(spyWindowAlert).toHaveBeenCalled();
    });

    it('verifyConstants() should return false and display an alert if penaltyTime < 1', () => {
        const gameConstants: Constants = {
            initTime: 30,
            penaltyTime: 0,
            timeBonus: 5,
        };
        expect(component.verifyConstants(gameConstants)).toBeFalse();
        expect(spyWindowAlert).toHaveBeenCalled();
    });

    it('verifyConstants() should return false and display an alert if 1 =< penaltyTime && penaltyTime =< 15', () => {
        const gameConstants: Constants = {
            initTime: 30,
            penaltyTime: 5,
            timeBonus: 5,
        };
        expect(component.verifyConstants(gameConstants)).toBeTrue();
    });

    it('verifyConstants() should return false and display an alert if timeBonus > 15', () => {
        const gameConstants: Constants = {
            initTime: 30,
            penaltyTime: 5,
            timeBonus: 30,
        };
        expect(component.verifyConstants(gameConstants)).toBeFalse();
        expect(spyWindowAlert).toHaveBeenCalled();
    });

    it('verifyConstants() should return false and display an alert if timeBonus < 1', () => {
        const gameConstants: Constants = {
            initTime: 30,
            penaltyTime: 5,
            timeBonus: 0,
        };
        expect(component.verifyConstants(gameConstants)).toBeFalse();
        expect(spyWindowAlert).toHaveBeenCalled();
    });

    it('verifyConstants() should return false and display an alert if 1 =< timeBonus && timeBonus =< 15', () => {
        const gameConstants: Constants = {
            initTime: 30,
            penaltyTime: 5,
            timeBonus: 5,
        };
        expect(component.verifyConstants(gameConstants)).toBeTrue();
    });

    it('verifyConstants() should return true', () => {
        const gameConstants: Constants = {
            initTime: 30,
            penaltyTime: 5,
            timeBonus: 5,
        };
        expect(component.verifyConstants(gameConstants)).toBeTrue();
    });

    it('sendConstants() should call verifyConstants() ', () => {
        const spy = spyOn(component, 'verifyConstants');
        component.sendConstants();
        expect(spy).toHaveBeenCalled();
    });

    it('should call getConstantsFromServer', () => {
        const spy = spyOn(component, 'getConstantsFromServer');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });
});
