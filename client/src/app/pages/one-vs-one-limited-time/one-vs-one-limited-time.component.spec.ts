import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { OneVsOneLimitedTimeComponent } from './one-vs-one-limited-time.component';

describe('OneVsOneLimitedTimeComponent', () => {
    let component: OneVsOneLimitedTimeComponent;
    let fixture: ComponentFixture<OneVsOneLimitedTimeComponent>;
    // eslint-disable-next-line no-unused-vars
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [OneVsOneLimitedTimeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OneVsOneLimitedTimeComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
