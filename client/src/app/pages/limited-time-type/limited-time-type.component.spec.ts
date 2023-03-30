import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitedTimeTypeComponent } from './limited-time-type.component';

describe('LimitedTimeTypeComponent', () => {
    let component: LimitedTimeTypeComponent;
    let fixture: ComponentFixture<LimitedTimeTypeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LimitedTimeTypeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LimitedTimeTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
