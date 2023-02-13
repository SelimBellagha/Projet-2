import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JeuxComponent } from './jeux.component';

describe('JeuxComponent', () => {
    let component: JeuxComponent;
    let fixture: ComponentFixture<JeuxComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JeuxComponent],
            imports: [RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(JeuxComponent);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' clicking on acceuil button should navigate to home Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToLoginPage();
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/loginPage']);
    });
});
