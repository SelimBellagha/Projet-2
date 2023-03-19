import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { GameData } from '@app/interfaces/game.interface';
import { of } from 'rxjs';
import { CommunicationService } from './communication.service';
import { DisplayGameService } from './display-game.service';
import SpyObj = jasmine.SpyObj;

xdescribe('DisplayGameService', () => {
    let service: DisplayGameService;
    let communicationSpy: SpyObj<CommunicationService>;

    beforeEach(() => {
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['getAllGames', 'getGameById']);
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [{ provide: CommunicationService, useValue: communicationSpy }],
        });
        service = TestBed.inject(DisplayGameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('convertDifficulty should return string "Niveau: difficile" if gameData isDifficult', () => {
        const gameDataStub = { isDifficult: true } as GameData;
        expect(service.convertDifficulty(gameDataStub)).toEqual('Niveau: difficile');
    });
    it('convertDifficulty should return string "Niveau: facile" if gameData is not Difficult', () => {
        const gameDataStub = { isDifficult: false } as GameData;
        expect(service.convertDifficulty(gameDataStub)).toEqual('Niveau: facile');
    });

    it('loadAllGames should call getAllGames from communicationService', () => {
        const gameDataStub = [{ isDifficult: false } as GameData];
        communicationSpy.getAllGames.and.returnValue(of(gameDataStub));
        service.loadAllGames();
        expect(communicationSpy.getAllGames).toHaveBeenCalled();
    });

    it('setGameId should change gameId of service', () => {
        const id = '2';
        service.setGameId(id);
        expect(service.gameId).toBe(id);
    });

    it('ConvertAllGames should properly add every member of tempGames to games', () => {
        const gameDataStub = [
            { isDifficult: false, id: '1', name: 'mock', originalImage: 'mock' } as GameData,
            { isDifficult: true, id: '2', name: 'mock2', originalImage: 'mock' } as GameData,
        ];
        service.tempGames = gameDataStub;
        service.convertAllGames();
        expect(service.games.length).toBe(gameDataStub.length);
        expect(service.games[0].title).toBe('mock');
        expect(service.games[1].id).toBe('2');
    });

    it('loadGame should call getGameById from communicationService', () => {
        const gameDataStub = { isDifficult: false } as GameData;
        communicationSpy.getGameById.and.returnValue(of(gameDataStub));
        service.loadGame(0);
        expect(communicationSpy.getGameById).toHaveBeenCalled();
    });
});
