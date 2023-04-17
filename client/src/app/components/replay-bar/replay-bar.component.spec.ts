import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplayBarComponent } from './replay-bar.component';

describe('ReplayBarComponent', () => {
    let component: ReplayBarComponent;
    let fixture: ComponentFixture<ReplayBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReplayBarComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(ReplayBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
