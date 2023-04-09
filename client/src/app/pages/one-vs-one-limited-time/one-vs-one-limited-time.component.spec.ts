import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneVsOneLimitedTimeComponent } from './one-vs-one-limited-time.component';

describe('OneVsOneLimitedTimeComponent', () => {
    let component: OneVsOneLimitedTimeComponent;
    let fixture: ComponentFixture<OneVsOneLimitedTimeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OneVsOneLimitedTimeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OneVsOneLimitedTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
