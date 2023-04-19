import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GiveUpComponent } from './give-up.component';
import SpyObj = jasmine.SpyObj;

describe('GiveUpComponent', () => {
    let component: GiveUpComponent;
    let fixture: ComponentFixture<GiveUpComponent>;
    let matDialogSpy: SpyObj<MatDialog>;
    let router: Router;
    beforeEach(async () => {
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
        await TestBed.configureTestingModule({
            declarations: [GiveUpComponent],
            imports: [RouterTestingModule],
            providers: [{ provide: MatDialog, useValue: matDialogSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(GiveUpComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('goToStay should close this component', () => {
        component.goToStay();
        expect(matDialogSpy.closeAll).toHaveBeenCalled();
    });
    it('giveUp should close Component and navigate to home', () => {
        const spy = spyOn(router, 'navigate');
        component.giveUp();
        expect(matDialogSpy.closeAll).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(['home']);
    });
});
