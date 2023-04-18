import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplayService } from '@app/services/replay.service';
import { ReplayBarComponent } from './replay-bar.component';
import SpyObj = jasmine.SpyObj;
describe('ReplayBarComponent', () => {
    let component: ReplayBarComponent;
    let fixture: ComponentFixture<ReplayBarComponent>;
    let replayManagerSpy: SpyObj<ReplayService>;
    let router: Router;
    beforeEach(async () => {
        replayManagerSpy = jasmine.createSpyObj('GameManagerService', ['pauseReplay', 'restartReplay', 'setCurrentSpeed']);

        await TestBed.configureTestingModule({
            declarations: [ReplayBarComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [{ provide: ReplayService, useValue: replayManagerSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(ReplayBarComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onPause should call pauseReplay from replayService', () => {
        component.onPause();
        expect(replayManagerSpy.pauseReplay).toHaveBeenCalled();
    });
    it('onStart should call restartReplay from replayService', () => {
        component.onStart();
        expect(replayManagerSpy.restartReplay).toHaveBeenCalled();
    });
    it('onSetSpeed should call setCurrentSpeed from replayService', () => {
        component.onSetSpeed();
        expect(replayManagerSpy.setCurrentSpeed).toHaveBeenCalled();
    });
    it('onSetSpeed should multiply current speed by 2 if speed is 1x or 2x', () => {
        component.speed = 1;
        component.onSetSpeed();
        expect(component.speed).toEqual(2);
        component.speed = 2;
        component.onSetSpeed();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(component.speed).toEqual(4);
    });
    it('onSetSpeed should change  speed to 1 if current speed is 4x', () => {
        component.speed = 4;
        component.onSetSpeed();
        expect(component.speed).toEqual(1);
    });
    it('onReplay should close the popUp window', () => {
        const popUp = component.popUpWindow;
        popUp.nativeElement.style.display = 'block';
        component.onReplay();
        expect(popUp.nativeElement.style.display).toEqual('none');
    });
    it(' clicking on quit button should navigate to home Page', () => {
        const routerSpy = spyOn(router, 'navigate');
        component.goToHomePage();
        expect(routerSpy).toHaveBeenCalled();
    });
});
