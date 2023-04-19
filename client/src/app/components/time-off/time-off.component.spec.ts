import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TimeOffComponent } from './time-off.component';
import SpyObj = jasmine.SpyObj;
describe('TimeOffComponent', () => {
    let component: TimeOffComponent;
    let fixture: ComponentFixture<TimeOffComponent>;
    let matDialogSpy: SpyObj<MatDialog>;
    let router: Router;
    beforeEach(async () => {
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
        await TestBed.configureTestingModule({
            declarations: [TimeOffComponent],
            imports: [RouterTestingModule],
            providers: [{ provide: MatDialog, useValue: matDialogSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(TimeOffComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('goToHomePage should close this component and naviagte to homePage', () => {
        const spy = spyOn(router, 'navigate');
        component.goToHomePage();
        expect(matDialogSpy.closeAll).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(['home']);
        expect(component).toBeTruthy();
    });
});
