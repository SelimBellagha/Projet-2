import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginFormService } from '@app/services/login-form.service';
import { LimitedTimeTypeComponent } from './limited-time-type.component';
import SpyObj = jasmine.SpyObj;

describe('LimitedTimeTypeComponent', () => {
    let component: LimitedTimeTypeComponent;
    let fixture: ComponentFixture<LimitedTimeTypeComponent>;
    let loginServiceSpy: SpyObj<LoginFormService>;
    let router: SpyObj<Router>;

    beforeEach(async () => {
        loginServiceSpy = jasmine.createSpyObj('LoginFormService', ['setGameType']);
        router = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [LimitedTimeTypeComponent],
            imports: [RouterTestingModule],
            providers: [
                { provide: LoginFormService, useValue: loginServiceSpy },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LimitedTimeTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('goToSoloLimitedTime should call setGameType with false', () => {
        component.goToSoloLimitedTime();
        expect(loginServiceSpy.setGameType).toHaveBeenCalledWith(false);
    });

    it('goToSoloLimitedTime should navigate to Login page', () => {
        component.goToSoloLimitedTime();
        expect(router.navigate).toHaveBeenCalledWith(['/loginPage']);
    });

    it('goToCoopLimitedTime should call setGameType with true', () => {
        component.goToCoopLimitedTime();
        expect(loginServiceSpy.setGameType).toHaveBeenCalledWith(true);
    });

    it('goToCoopLimitedTime should navigate to Login page', () => {
        component.goToCoopLimitedTime();
        expect(router.navigate).toHaveBeenCalledWith(['/loginPage']);
    });
});
