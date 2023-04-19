import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VictoryComponent } from './victory.component';

describe('VictoryComponent', () => {
    let component: VictoryComponent;
    let fixture: ComponentFixture<VictoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VictoryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(VictoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
