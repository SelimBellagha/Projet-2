import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { VictoryComponent } from './victory.component';
import SpyObj = jasmine.SpyObj;
describe('VictoryComponent', () => {
    let component: VictoryComponent;
    let fixture: ComponentFixture<VictoryComponent>;
    let matDialogSpy: SpyObj<MatDialog>;
    let router: Router;
    beforeEach(async () => {
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
        await TestBed.configureTestingModule({
            declarations: [VictoryComponent],
            imports: [RouterTestingModule],
            providers: [{ provide: MatDialog, useValue: matDialogSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(VictoryComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
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
