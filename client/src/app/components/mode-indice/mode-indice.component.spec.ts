import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModeIndiceComponent } from './mode-indice.component';

describe('ModeIndiceComponent', () => {
    let component: ModeIndiceComponent;
    let fixture: ComponentFixture<ModeIndiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
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
