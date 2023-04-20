import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunicationService } from '@app/services/communication.service';
import { Constants } from '@common/constants';
import { of } from 'rxjs';
import { ConstantsComponent } from './constants.component';
import SpyObj = jasmine.SpyObj;

describe('ConstantsComponent', () => {
    let component: ConstantsComponent;
    let fixture: ComponentFixture<ConstantsComponent>;
    let spyWindowAlert: jasmine.Spy;
    let communicationSpy: SpyObj<CommunicationService>;

    beforeEach(async () => {
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['sendConstants', 'getConstants']);
        await TestBed.configureTestingModule({
            declarations: [ConstantsComponent],
            imports: [HttpClientTestingModule],
            providers: [{ provide: CommunicationService, useValue: communicationSpy }],
        }).compileComponents();

        const response = { initTime: 1, penaltyTime: 1, timeBonus: 1 };
        communicationSpy.getConstants.and.returnValue(of(response));
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
    it('sendConstants() should call sendConstants from communicationService ', () => {
        spyOn(component, 'verifyConstants').and.returnValue(true);
        communicationSpy.sendConstants.and.returnValue(of());
        component.sendConstants();
        expect(communicationSpy.sendConstants).toHaveBeenCalled();
    });
});
