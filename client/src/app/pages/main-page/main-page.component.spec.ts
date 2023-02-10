import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { CommunicationService } from '@app/services/communication.service';
import { of, throwError } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let communicationServiceSpy: SpyObj<CommunicationService>;
    let router: Router;

    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('ExampleService', ['basicGet', 'basicPost']);
        communicationServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
        communicationServiceSpy.basicPost.and.returnValue(of(new HttpResponse<string>({ status: 201, statusText: 'Created' })));

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [{ provide: CommunicationService, useValue: communicationServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.inject(Router);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'LOG2990'", () => {
        expect(component.title).toEqual('LOG2990');
    });

    it('should call basicGet when calling getMessagesFromServer', () => {
        component.getMessagesFromServer();
        expect(communicationServiceSpy.basicGet).toHaveBeenCalled();
    });

    it('should call basicPost when calling sendTimeToServer', () => {
        component.sendTimeToServer();
        expect(communicationServiceSpy.basicPost).toHaveBeenCalled();
    });

    it('should handle basicPost that returns a valid HTTP response', () => {
        component.sendTimeToServer();
        component.message.subscribe((res) => {
            expect(res).toContain('201 : Created');
        });
    });

    it('should handle basicPost that returns an invalid HTTP response', () => {
        communicationServiceSpy.basicPost.and.returnValue(throwError(() => new Error('test')));
        component.sendTimeToServer();
        component.message.subscribe({
            next: (res) => {
                expect(res).toContain('Le serveur ne répond pas');
            },
        });
    });

    it('goToConfiguration should navigate to configuration Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToConfiguration();
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/config']);
    });
    it('goToConfiguration should navigate to configuration Page', () => {
        const routerSpy = spyOn(router, 'navigate');

        component.goToGameSelection();
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(['/gameSelection']);
    });
});
