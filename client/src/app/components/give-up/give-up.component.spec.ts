import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { GiveUpComponent } from './give-up.component';

describe('GiveUpComponent', () => {
    let component: GiveUpComponent;
    let fixture: ComponentFixture<GiveUpComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, MatDialogModule],
            declarations: [GiveUpComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GiveUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
