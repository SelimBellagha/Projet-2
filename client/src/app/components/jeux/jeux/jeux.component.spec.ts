import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JeuxComponent } from './jeux.component';

describe('JeuxComponent', () => {
    let component: JeuxComponent;
    let fixture: ComponentFixture<JeuxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JeuxComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(JeuxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
