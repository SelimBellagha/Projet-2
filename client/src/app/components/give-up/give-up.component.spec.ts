import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LimitedTimeLobbyService } from '@app/services/limited-time-lobby.service';
import { GiveUpComponent } from './give-up.component';
import SpyObj = jasmine.SpyObj;

describe('GiveUpComponent', () => {
    let component: GiveUpComponent;
    let fixture: ComponentFixture<GiveUpComponent>;
    let lobbySpy: SpyObj<LimitedTimeLobbyService>;
    let matDialogSpy: SpyObj<MatDialog>;
    let routerSpy: SpyObj<Router>;
    beforeEach(async () => {
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
        lobbySpy = jasmine.createSpyObj('LimitedTimeLobbyService', [], { timerid: null });
        routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: '/limitedOneVsOne' });
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [GiveUpComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: LimitedTimeLobbyService, useValue: lobbySpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GiveUpComponent);
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
        component.giveUp();
        expect(matDialogSpy.closeAll).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });
    it('giveUp should call clearInterval if current game is limitedOnevsOne', () => {
        const spy = spyOn(window, 'clearInterval');
        component.giveUp();
        expect(spy).toHaveBeenCalled();
    });
});
