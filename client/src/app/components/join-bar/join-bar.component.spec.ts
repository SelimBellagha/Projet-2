import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinBarComponent } from './join-bar.component';

describe('JoinBarComponent', () => {
    let component: JoinBarComponent;
    let fixture: ComponentFixture<JoinBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoinBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(JoinBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
