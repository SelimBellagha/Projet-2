import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DisplayGameService } from '@app/services/display-game.service';
import { VictoryComponent } from './victory.component';
import SpyObj = jasmine.SpyObj;
describe('VictoryComponent', () => {
    let component: VictoryComponent;
    let fixture: ComponentFixture<VictoryComponent>;
    let matDialogSpy: SpyObj<MatDialog>;
    let displayServiceSpy: SpyObj<DisplayGameService>;
    let router: Router;
    const mockDialogData = {
        data1: {
            startDate: 'testDate',
            gameLength: '0:19',
            gameMode: 'Temps Limite',
            namePlayer1: 'testName',
            namePlayer2: '',
            winnerName: '',
            nameAbandon: 'testName',
        },
        data2: {
            position: '1',
            gameId: 'test',
            gameType: 'test',
            time: 'test',
            playerName: 'mock',
        },
        data3: false,
    };

    beforeEach(async () => {
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
        displayServiceSpy = jasmine.createSpyObj('DisplayGameService', ['checkPlayerScore', 'addHistory']);
        await TestBed.configureTestingModule({
            declarations: [VictoryComponent],
            imports: [RouterTestingModule, HttpClientModule],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: DisplayGameService, useValue: displayServiceSpy },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VictoryComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('goToHomePage should close this component and naviagte to homePage', () => {
        const spy = spyOn(router, 'navigate');
        component.goToHomePage();
        expect(matDialogSpy.closeAll).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(['home']);
    });
    it('stayForReplay should close this component and but not naviagte to homePage', () => {
        const spy = spyOn(router, 'navigate');
        component.stayForReplay();
        expect(matDialogSpy.closeAll).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should add history and score when data3 is true', () => {
        const data = {
            data1: {
                startDate: 'testDate',
                gameLength: '0:19',
                gameMode: 'Temps Limite',
                namePlayer1: 'testName',
                namePlayer2: '',
                winnerName: '',
                nameAbandon: 'testName',
            },
            data2: {
                position: '1',
                gameId: 'test',
                gameType: 'test',
                time: 'test',
                playerName: 'mock',
            },
            data3: true,
        };
        component.data = data;
        component.addHistoryAndScore();
        expect(displayServiceSpy.addHistory).toHaveBeenCalledWith(data.data1);
        expect(displayServiceSpy.checkPlayerScore).toHaveBeenCalledWith(data.data2);
    });

    it('should not add history and score when data3 is false', () => {
        component.data = {
            data1: {
                startDate: 'testDate',
                gameLength: '0:19',
                gameMode: 'Temps Limite',
                namePlayer1: 'testName',
                namePlayer2: '',
                winnerName: '',
                nameAbandon: 'testName',
            },
            data2: {
                position: '1',
                gameId: 'test',
                gameType: 'test',
                time: 'test',
                playerName: 'mock',
            },
            data3: false,
        };
        component.addHistoryAndScore();
        expect(displayServiceSpy.addHistory).not.toHaveBeenCalled();
        expect(displayServiceSpy.checkPlayerScore).not.toHaveBeenCalled();
    });
});
