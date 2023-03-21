import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GameData } from '@app/interfaces/game.interface';
import { CommunicationService } from '@app/services/communication.service';
import { Message } from '@common/message';

describe('CommunicationService', () => {
    let httpMock: HttpTestingController;
    let service: CommunicationService;
    let baseUrl: string;

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
});
