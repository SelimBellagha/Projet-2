import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeIndiceComponent } from './mode-indice.component';

describe('ModeIndiceComponent', () => {
    let component: ModeIndiceComponent;
    let fixture: ComponentFixture<ModeIndiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModeIndiceComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ModeIndiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
