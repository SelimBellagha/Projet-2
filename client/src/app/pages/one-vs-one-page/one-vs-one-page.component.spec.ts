import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OneVsOnePageComponent } from './one-vs-one-page.component';

xdescribe('OneVsOnePageComponent', () => {
    let component: OneVsOnePageComponent;
    let fixture: ComponentFixture<OneVsOnePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OneVsOnePageComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(OneVsOnePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
