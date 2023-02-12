import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameData } from '@app/interfaces/game.interface';
import { Message } from '@common/message';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    basicGet(): Observable<Message> {
        return this.http.get<Message>(this.baseUrl + '/example').pipe(catchError(this.handleError<Message>('basicGet')));
    }

    getAllGames(): Observable<GameData[]> {
        return this.http.get<GameData[]>(this.baseUrl + '/games').pipe(catchError(this.handleError<GameData[]>('getAllGames')));
    }

    getGameById(id: string): Observable<GameData> {
        const params = new HttpParams().set('id', id);
        return this.http.get<GameData>(`${this.baseUrl}/games/${id}`, { params });
    }

    basicPost(message: Message): Observable<HttpResponse<string>> {
        return this.http.post(this.baseUrl + '/example/send', message, { observe: 'response', responseType: 'text' });
    }

    addNewGame(game: GameData) {
        try {
            this.http.post(this.baseUrl + '/games', game);
        } catch (err) {
            window.alert('An error has occured while adding a new game');
        }
    }

    deleteGame(id: string) {
        const params = new HttpParams().set('id', id);
        try {
            this.http.delete(this.baseUrl + '/games', { params });
        } catch (err) {
            window.alert('An error has occured while deleting a game');
        }
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
