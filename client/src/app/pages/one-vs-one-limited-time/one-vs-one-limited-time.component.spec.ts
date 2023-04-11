import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OneVsOneLimitedTimeComponent } from './one-vs-one-limited-time.component';

describe('OneVsOneLimitedTimeComponent', () => {
    let component: OneVsOneLimitedTimeComponent;
    let fixture: ComponentFixture<OneVsOneLimitedTimeComponent>;
    // eslint-disable-next-line no-unused-vars

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
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
