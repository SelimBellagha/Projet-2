import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GameHistory } from '@app/interfaces/game-history';
import { GameData, TopScore } from '@app/interfaces/game.interface';
import { CommunicationService } from '@app/services/communication.service';
import { Constants } from '@common/constants';
import { Message } from '@common/message';
import { of } from 'rxjs';

describe('CommunicationService', () => {
    let httpMock: HttpTestingController;
    let service: CommunicationService;
    let baseUrl: string;
    const constants: Constants = {
        initTime: 30,
        penaltyTime: 5,
        timeBonus: 5,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(CommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
        // eslint-disable-next-line dot-notation -- baseUrl is private and we need access for the test
        baseUrl = service['baseUrl'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return expected message (HttpClient called once)', () => {
        const expectedMessage: Message = { body: 'Hello', title: 'World' };

        // check the content of the mocked call
        service.basicGet().subscribe({
            next: (response: Message) => {
                expect(response.title).toEqual(expectedMessage.title);
                expect(response.body).toEqual(expectedMessage.body);
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/example`);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedMessage);
    });

    it('should return expected games for getAllGames', () => {
        const mockGameData: GameData[] = [
            { id: '0', name: 'Game 1', originalImage: '', modifiedImage: '', nbDifferences: 7, differences: [], isDifficult: false },
            { id: '1', name: 'Game 2', originalImage: '', modifiedImage: '', nbDifferences: 7, differences: [], isDifficult: true },
            { id: '2', name: 'Game 3', originalImage: '', modifiedImage: '', nbDifferences: 7, differences: [], isDifficult: false },
        ];

        service.getAllGames().subscribe((games) => {
            expect(games.length).toBe(3);
            expect(games).toEqual(mockGameData);
        });

        const req = httpMock.expectOne(`${baseUrl}/games`);
        expect(req.request.method).toBe('GET');
        req.flush(mockGameData);
    });

    it('should return the expected game for getGameById', () => {
        const mockGameData: GameData = {
            id: '0',
            name: 'Game 1',
            originalImage: '',
            modifiedImage: '',
            nbDifferences: 7,
            differences: [],
            isDifficult: false,
        };
        const requestedId = '0';

        service.getGameById(requestedId).subscribe((game) => {
            expect(game.id).toBe(requestedId);
            expect(game).toEqual(mockGameData);
        });

        const req = httpMock.expectOne(`${baseUrl}/games/${requestedId}?id=${requestedId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockGameData);
    });

    it('should add new game to server', () => {
        const mockNewGame: GameData = {
            id: '0',
            name: 'Game 1',
            originalImage: '',
            modifiedImage: '',
            nbDifferences: 7,
            differences: [],
            isDifficult: false,
        };
        service.addNewGame(mockNewGame);

        const req = httpMock.expectOne(`${baseUrl}/games/send`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockNewGame);
        req.flush(mockNewGame);
    });

    it('should delete game from server', () => {
        const gameId = '0';
        service.deleteGame(gameId);
        const req = httpMock.expectOne(`${baseUrl}/games/${gameId}?id=${gameId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('should not return any message when sending a POST request (HttpClient called once)', () => {
        const sentMessage: Message = { body: 'Hello', title: 'World' };
        // subscribe to the mocked call
        service.basicPost(sentMessage).subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(`${baseUrl}/example/send`);
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(sentMessage);
    });

    it('should handle http error safely', () => {
        service.basicGet().subscribe({
            next: (response: Message) => {
                expect(response).toBeUndefined();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/example`);
        expect(req.request.method).toBe('GET');
        req.error(new ProgressEvent('Random error occurred'));
    });

    it('should return expected scores for getAllScores', () => {
        const mockScoreData: TopScore[] = [
            {
                position: '1',
                gameId: 'test1',
                gameType: 'test1',
                time: '0:20',
                playerName: 'test1',
            },
            {
                position: '2',
                gameId: 'test2',
                gameType: 'test2',
                time: '0:40',
                playerName: 'test2',
            },
            {
                position: '3',
                gameId: 'test3',
                gameType: 'test3',
                time: '0:55',
                playerName: 'test3',
            },
        ];

        service.getAllScores().subscribe((scores) => {
            expect(scores.length).toBe(3);
            expect(scores).toEqual(mockScoreData);
        });

        const req = httpMock.expectOne(`${baseUrl}/scores`);
        expect(req.request.method).toBe('GET');
        req.flush(mockScoreData);
    });

    it('should add new score to server', () => {
        const mockNewScore: TopScore = {
            position: 'test',
            gameId: 'test',
            gameType: 'test',
            time: '0:10',
            playerName: 'test',
        };
        service.addScore(mockNewScore).subscribe();

        const req = httpMock.expectOne(`${baseUrl}/scores`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockNewScore);
        req.flush(mockNewScore);
    });

    it('should return expected histories for getGameHistory', () => {
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

        service.getGameHistory().subscribe((history) => {
            expect(history.length).toBe(2);
            expect(history).toEqual(mockHistoryData);
        });

        const req = httpMock.expectOne(`${baseUrl}/history`);
        expect(req.request.method).toBe('GET');
        req.flush(mockHistoryData);
    });

    it('should add new score to server', () => {
        const mockNewHistory: GameHistory = {
            startDate: 'test1',
            gameLength: 'test1',
            gameMode: 'test1',
            namePlayer1: 'test1',
            namePlayer2: 'test1',
            winnerName: 'test1',
            nameAbandon: 'test1',
        };
        service.addNewGameHistory(mockNewHistory);

        const req = httpMock.expectOne(`${baseUrl}/history`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockNewHistory);
        req.flush(mockNewHistory);
    });

    it('should delete history from server', () => {
        service.deleteGameHistory();
        const req = httpMock.expectOne(`${baseUrl}/history`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('sendConstants() should succeed (HttpClient called once) ', () => {
        service.sendConstants(constants).subscribe({
            next: () => {
                expect();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/games/constants`);
        expect(req.request.method).toBe('POST');
        req.flush(of(undefined));
    });

    it('getConstants() should return constants', async () => {
        service.getConstants().subscribe({
            next: (response) => {
                expect(response).toEqual(constants);
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/games/constants`);
        expect(req.request.method).toBe('GET');
        req.flush(constants);
    });
});
