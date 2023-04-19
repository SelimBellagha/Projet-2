import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AddedScoreResult } from '@app/interfaces/added-score-result';
import { GameHistory } from '@app/interfaces/game-history';
import { GameData, TopScore } from '@app/interfaces/game.interface';
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
        communicationSpy = jasmine.createSpyObj('CommunicationService', [
            'getAllGames',
            'getGameById',
            'addScore',
            'resetGameScores',
            'addNewGameHistory',
            'deleteGameHistory',
            'getGameHistory',
            'deleteGame',
        ]);
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
        expect(service.convertDifficulty(gameDataStub)).toEqual('difficile');
    });
    it('convertDifficulty should return string "Niveau: facile" if gameData is not Difficult', () => {
        const gameDataStub = { isDifficult: false } as GameData;
        expect(service.convertDifficulty(gameDataStub)).toEqual('facile');
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

    it('deleteAllGames should call deleteGame', () => {
        const gameDataStub = [
            { isDifficult: false, id: '1', name: 'mock', originalImage: 'mock' } as GameData,
            { isDifficult: true, id: '2', name: 'mock2', originalImage: 'mock' } as GameData,
        ];
        service.tempGames = gameDataStub;
        service.deleteAllGames();
        expect(communicationSpy.deleteGame).toHaveBeenCalledTimes(2);
        for (const game of gameDataStub) {
            expect(communicationSpy.deleteGame).toHaveBeenCalledWith(game.id);
        }
    });

    it('resetAllScores should call resetGameScores', () => {
        const gameDataStub = [
            { isDifficult: false, id: '1', name: 'mock', originalImage: 'mock' } as GameData,
            { isDifficult: true, id: '2', name: 'mock2', originalImage: 'mock' } as GameData,
        ];
        service.tempGames = gameDataStub;
        service.resetAllScores();
        expect(communicationSpy.resetGameScores).toHaveBeenCalledTimes(2);
        for (const game of gameDataStub) {
            expect(communicationSpy.resetGameScores).toHaveBeenCalledWith(game.id);
        }
    });

    it('checkPlayerScore should call addScore from communicationService', () => {
        const mockNewScore: TopScore = {
            position: 'test',
            gameId: 'test',
            gameType: 'test',
            time: '0:10',
            playerName: 'test',
        };
        const mockAddedScoreResult: AddedScoreResult = { isAdded: false, positionIndex: '-1' };
        communicationSpy.addScore.and.returnValue(of(mockAddedScoreResult));
        service.checkPlayerScore(mockNewScore);
        expect(communicationSpy.addScore).toHaveBeenCalledWith(mockNewScore);
        expect(service.isScoreAdded).toBe(mockAddedScoreResult.isAdded);
        expect(service.newScorePosition).toBe(mockAddedScoreResult.positionIndex);
    });

    it('addHistory should call addNewGameHistory from communicationService', () => {
        const mockNewHistory: GameHistory = {
            startDate: 'test1',
            gameLength: 'test1',
            gameMode: 'test1',
            namePlayer1: 'test1',
            namePlayer2: 'test1',
            winnerName: 'test1',
            nameAbandon: 'test1',
        };
        service.addHistory(mockNewHistory);
        expect(communicationSpy.addNewGameHistory).toHaveBeenCalledWith(mockNewHistory);
    });

    it('deleteGameHistory should call deleteGameHistory', () => {
        service.deleteGameHistory();
        expect(communicationSpy.deleteGameHistory).toHaveBeenCalled();
    });

    it('getHistory should call getGameHistory', async () => {
        const mockHistoryData: GameHistory[] = [
            {
                startDate: 'test1',
                gameLength: 'test1',
                gameMode: 'test1',
                namePlayer1: 'test1',
                namePlayer2: 'test1',
                winnerName: 'test1',
                nameAbandon: 'test1',
            },
            {
                startDate: 'test2',
                gameLength: 'test2',
                gameMode: 'test2',
                namePlayer1: 'test2',
                namePlayer2: 'test2',
                winnerName: 'test2',
                nameAbandon: 'test2',
            },
        ];
        const source = of(mockHistoryData);
        communicationSpy.getGameHistory.and.returnValue(source);
        await service.getHistory();
        expect(communicationSpy.getGameHistory).toHaveBeenCalled();
        expect(service.history).toEqual(mockHistoryData);
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
