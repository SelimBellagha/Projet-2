import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SoloViewPageComponent } from './solo-view-page.component';

describe('SoloViewPageComponent', () => {
    let component: SoloViewPageComponent;
    let fixture: ComponentFixture<SoloViewPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [SoloViewPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SoloViewPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
