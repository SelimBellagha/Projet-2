import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloViewPageComponent } from './solo-view-page.component';

describe('SoloViewPageComponent', () => {
    let component: SoloViewPageComponent;
    let fixture: ComponentFixture<SoloViewPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SoloViewPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SoloViewPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('timer should start', () => {
        // const log = new LoginFormService();
        // const start_time = new SoloViewPageComponent(log);
        const timerTest = 5;
        const time = component.startTimer();
        expect(time).toBeGreaterThanOrEqual(0);
        setTimeout(() => {
            // eslint-disable-next-line no-console
            expect(time).toBeGreaterThanOrEqual(timerTest);
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        }, timerTest);
        expect(time).toBeGreaterThanOrEqual(timerTest);
        // expect(mouseServiceSpy.onMouseUp).toHaveBeenCalled();
    });
});
