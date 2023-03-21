import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { GameData } from '@app/interfaces/game.interface';
import { of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { CommunicationService } from './communication.service';
import { DisplayGameService } from './display-game.service';
import { SocketClientService } from './socket-client-service.service';
import SpyObj = jasmine.SpyObj;

describe('DisplayGameService', () => {
    let service: DisplayGameService;
    let communicationSpy: SpyObj<CommunicationService>;
    let socketServiceSpy: SpyObj<SocketClientService>;

    beforeEach(() => {
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['getAllGames', 'getGameById']);
        socketServiceSpy = jasmine.createSpyObj('SocketClientService', ['send', 'on']);
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                { provide: CommunicationService, useValue: communicationSpy },
                { provide: SocketClientService, useValue: socketServiceSpy },
            ],
        });
        service = TestBed.inject(DisplayGameService);
        socketServiceSpy.socket = new SocketTestHelper() as unknown as Socket;
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

    it('loadAllGames should call getPlayersInGame', async () => {
        const gameDataStub = [{ isDifficult: false, id: '1', name: 'mock', originalImage: 'mock' } as GameData];
        const spy = spyOn(service, 'getPlayersInGame');
        service.tempGames = gameDataStub;
        communicationSpy.getAllGames.and.returnValue(of(gameDataStub));
        await service.loadAllGames();
        expect(spy).toHaveBeenCalledWith(gameDataStub[0].id);
    });

    it('setGameId should change gameId of service', () => {
        const id = '2';
        service.setGameId(id);
        expect(service.gameId).toBe(id);
    });

    it('ConvertAllGames should properly add every member of tempGames to games', async () => {
        const gameDataStub = [
            { isDifficult: false, id: '1', name: 'mock', originalImage: 'mock' } as GameData,
            { isDifficult: true, id: '2', name: 'mock2', originalImage: 'mock' } as GameData,
        ];
        service.tempGames = gameDataStub;
        spyOn(service, 'getPlayersInGame').and.returnValue(Promise.resolve('0'));
        await service.convertAllGames();
        expect(service.games.length).toBe(gameDataStub.length);
        expect(service.games[0].title).toBe('mock');
        expect(service.games[1].id).toBe('2');
    });

    it('loadGame should call getGameById from communicationService', () => {
        const gameDataStub = { isDifficult: false } as GameData;
        communicationSpy.getGameById.and.returnValue(of(gameDataStub));
        service.loadGame('0');
        expect(communicationSpy.getGameById).toHaveBeenCalled();
    });

    it('getPlayersInGame should send a getPlayersInGame event', () => {
        const gameId = '0';
        service.getPlayersInGame(gameId);
        expect(socketServiceSpy.send).toHaveBeenCalledWith('checkPlayersInGame', { gameId });
    });

    it('should call socket.on with an event', () => {
        const event = 'playersInGame';
        const gameId = '0';
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        service.getPlayersInGame(gameId);
        expect(socketServiceSpy.on).toHaveBeenCalled();
        expect(socketServiceSpy.on).toHaveBeenCalledWith(event, jasmine.any(Function));
    });
});
